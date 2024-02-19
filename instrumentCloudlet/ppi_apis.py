from flask import Flask, request, json, jsonify
from connection import ssh_connection
from common_function import *
from sem_ppi_cmd import *
from datetime import datetime
app = Flask(__name__)

now = datetime.now()
today = now.strftime("%m-%d-%Y-%H:%M:%S")


@app.route('/ppiApi',  methods=['GET', 'POST'])
def connectSem():
    data_coming = json.loads(request.data)
    req_data = data_coming['data']
    
    flag = 1  # 1 to decrypt 0 to encrypt
    req_data = encryptionDecryption(flag, req_data)
    data_dict = json.loads(req_data.decode('utf-8'))

    bucket_name = data_dict['storage']
    projectId  = data_dict['projectId']
    img_name = f'{today}_{projectId}.tif'

    print("after decryption:  ", data_dict)
    # cmd = 'scp -i C:/Users/divya/Downloads/semServer.pem C:/Users/divya/Desktop/Codes/cloudproject/20211116/50000/pillar7.tif ec2-user@172.31.33.221/images/'
    out_original_string = ssh_connection('ls')
    if out_original_string['status'] == 1:
        image_path = 'images/pillar12.tif'  
        bucket_name = bucket_name 
        object_name =  img_name
        upload_image_to_s3(image_path, bucket_name, object_name)
        
        res_data = encryptionDecryption(0, str(img_name))
        
        data = {"status": 1, "img_name": res_data}
    else:
        data = {"status": 0, "msg_type":"fail"}
        
    print(jsonify(data))
    return jsonify(data)


@app.route('/cntSegmentation',  methods=['GET', 'POST'])
def imageSegmentation():
    data_coming = json.loads(request.data)
    req_data = data_coming['sto_file']
    print("Before decryption:  ", req_data)

    flag = 1  # 1 to decrypt 0 to encrypt
    req_data = encryptionDecryption(flag, req_data)
    print("after decryption:  ", req_data)

    # Split the string using '#' as the delimiter
    split_parts = req_data.split(b'#')

    # Convert the parts to strings (if needed)
    split_parts = [part.decode('utf-8') for part in split_parts]

    # filename is at 0 index, storage is at index 1
    print(split_parts)

    status = downloadS3Image(split_parts[1], split_parts[0])
    print(status)
    # call function to provide 5 image segmented results
    # call another fuction that takes those 5 image parameters as input and provides you recommendation as output
    data = {
        "status": 1,
        "oriLoss": '9910',
        "disEntr": '4.04',
        "edgeCov": '14.24%',
        "avgThic": '1.45',
        "avgSep": '2.12',
        "zoom": '25000',
        "focus": '8.5',
        "contrast": '75',
        "msgType": 'success'
    }

    res_data = encryptionDecryption(0, str(data))

    data = {"data": res_data, "status": 1}
    return jsonify(data)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050, debug=True)
