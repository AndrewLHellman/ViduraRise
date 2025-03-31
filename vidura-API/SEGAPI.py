import os
import numpy as np
import pandas as pd
import torch
import cv2
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import subprocess
import warnings
import shutil
import tempfile

from dotenv import load_dotenv

load_dotenv()

warnings.filterwarnings("ignore")

# Import modules from seg_fft_7
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'seg_fft_7'))
from seg_fft_7.src.utils import set_seed

# Set seed for reproducibility
set_seed(1)

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'temp_uploads'
ALLOWED_EXTENSIONS = {'tif', 'tiff', 'jpg', 'jpeg', 'png'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image_path):
    """Process image by running the segmentation parts directly"""
    try:
        # Since running test_no_labels.py as a script isn't working easily due to import issues,
        # we'll directly use its functions from our SEGAPI
        
        # Import necessary modules from test_no_labels.py
        import torch
        import torch.nn as nn
        import torch.nn.functional as Fn
        from skimage import filters
        
        # Import from seg_fft_7
        sys.path.append(os.path.join(os.path.dirname(__file__), 'seg_fft_7'))
        from seg_fft_7.src.data_loader import get_data, ori_batch
        from seg_fft_7.src.utils import set_seed
        
        # Set seed for reproducibility
        set_seed(1)
        
        # Create a temporary directory just for the image
        temp_dir = tempfile.mkdtemp(dir=os.path.join(os.path.dirname(__file__), UPLOAD_FOLDER))
        temp_img_dir = os.path.join(temp_dir, 'images')
        os.makedirs(temp_img_dir, exist_ok=True)
        
        # Copy the image to temp directory
        img_name = os.path.basename(image_path)
        temp_img_path = os.path.join(temp_img_dir, img_name)
        shutil.copy(image_path, temp_img_path)
        
        # Functions from test_no_labels.py
        def dice_coefficient(prediction, truth):
            dims = list(range(1, len(truth.shape)))
            upper = 2.0 * torch.sum(prediction * truth, dim=dims) + 1
            lower = torch.sum((prediction + truth), dim=dims) + 1
            return upper / lower

        def log_cosh_dice_loss(y_pred, y_true):
            dice = dice_coefficient(y_pred, y_true)
            x = 1 - dice
            lcd = torch.log((torch.exp(x) + torch.exp(-x)) / 2.0)
            return lcd.mean(), dice.mean()
        
        def threshold_hyster(im, low=0.2, high=0.6):
            lowt = (im > low).astype(int)
            hight = (im > high).astype(int)
            hyst = filters.apply_hysteresis_threshold(im, low, high)
            return lowt, hight, hyst
        
        # Load model - identical to test_no_labels.py
        device = torch.device("cpu")
        check_file = os.path.join(os.path.dirname(__file__), 'seg_fft_7', 'models', 'cnt_segment_model.pth')
        checkpoint = torch.load(check_file, map_location=device)
        model = checkpoint['model_state_dict']
        
        # Get data with same parameters as test_no_labels.py
        binsize = 1
        data_sets, data_loaders = get_data(
            temp_img_dir, 
            batch_size=1, 
            ratio=[0.0, 1.0, 0.0], 
            reduce=1, 
            binsize=binsize, 
            binarize='Gaussian', 
            size=None, 
            dNoise=0
        )
        
        test_dataset = data_sets[1]
        test_loader = data_loaders[1]
        
        # Process batch data
        results = []
        thres_level = 0.7
        
        model.eval()
        with torch.no_grad():
            for batch_idx, batch_data in enumerate(test_loader):
                # Process just like test_no_labels.py
                image = batch_data['image']
                binImage = batch_data['binImage']
                cirMask = batch_data['cirMask']
                angle = batch_data['angle']
                file_name = batch_data['file_name']
                
                inputs = image.float().to(device)
                labels = binImage.to(device)
                cirMask = cirMask.to(device)
                angle = angle.to(device)
                
                outputs = model(inputs.unsqueeze(dim=1))
                outputs = torch.sigmoid(outputs)
                loss_1, dice_score = log_cosh_dice_loss(outputs.squeeze(), labels)
                
                pred_mask = (outputs.detach().cpu().numpy() >= thres_level).astype(np.float32)
                lowt, hight, hyster = threshold_hyster(outputs.detach().cpu().numpy())
                pred_mask_2 = hight + hyster
                pred_mask_2[pred_mask_2 > 1] = 1
                
                # Calculate orientation metrics - exactly as in test_no_labels.py
                for k in range(inputs.shape[0]):
                    num_pix = np.product(inputs.shape[1:])
                    
                    ori_out = ori_batch(torch.tensor(pred_mask, device=device).squeeze(dim=1), 
                                       cirMask, reduce=1, binsize=binsize)
                    loss_pred_orient = Fn.mse_loss(ori_out[k,:], angle[k,:]).detach().cpu().numpy() / num_pix
                    
                    ori_label = ori_batch(labels.squeeze(dim=1), cirMask, reduce=1, binsize=binsize)
                    loss_threshold_orient = Fn.mse_loss(ori_label[k,:], angle[k,:]).detach().cpu().numpy() / num_pix
                    
                    difference_pred_threshold = loss_threshold_orient - loss_pred_orient
                    
                    results.append({
                        'file_name': file_name[k],
                        'loss_pred_orient': float(loss_pred_orient),
                        'loss_threshold_orient': float(loss_threshold_orient),
                        'difference_pred_threshold': float(difference_pred_threshold),
                        'dice_score': float(dice_score.item())
                    })
        
        # Clean up
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        
        # Return the first (and only) result
        if results:
            return results[0]
        else:
            raise Exception("No results were generated")
        
    except Exception as e:
        raise Exception(f"Failed to process image: {str(e)}")

@app.route('/api/process', methods=['POST'])
def process_image_api():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # If user does not select file
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            result = process_image(file_path)

            # Clean up
            if os.path.exists(file_path):
                os.remove(file_path)

            return jsonify(result)

        except Exception as e:
            # Clean up in case of error
            if os.path.exists(file_path):
                os.remove(file_path)

            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=os.getenv("FLASK_PORT_SEGMENT"))