# Vidura Image Processing API

This API provides image processing capabilities using the seg_fft_7 model. It takes an input image and returns various orientation metrics.

## Setup

1. Set up the conda environment using the environment.yml file in the seg_fft_7 directory:

```bash
cd seg_fft_7
conda env create -f environment.yml
conda activate segmentation
```

2. Install Flask:

```bash
pip install flask
```

3. Run the API server:

```bash
python app.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Process Image

**Endpoint:** `/api/process`

**Method:** POST

**Request Format:**
- Form data with a file field named 'file'
- Supported file types: .tif, .tiff, .jpg, .jpeg, .png

**Example Request:**
```bash
curl -X POST -F "file=@/path/to/your/image.tif" http://localhost:5000/api/process
```

**Response Format:**
```json
{
  "loss_pred_orient": 0.0012345,
  "loss_threshold_orient": 0.0023456,
  "difference_pred_threshold": 0.0011111
}
```

### Health Check

**Endpoint:** `/api/health`

**Method:** GET

**Example Request:**
```bash
curl http://localhost:5000/api/health
```

**Response Format:**
```json
{
  "status": "healthy"
}
```

## Response Fields

- **loss_pred_orient**: The mean squared error between the predicted orientation and the ground truth orientation.
- **loss_threshold_orient**: The mean squared error between the threshold-based orientation and the ground truth orientation.
- **difference_pred_threshold**: The difference between the threshold-based loss and the prediction-based loss.

## Error Responses

The API will return appropriate error messages with HTTP status codes in case of failures.

Example error response:
```json
{
  "error": "No selected file"
}
```

## Notes

- Maximum file size: 16MB
- The API processes images using the same segmentation model (cnt_segment_model.pth) used in the seg_fft_7 directory
- Temporary uploaded files are automatically deleted after processing