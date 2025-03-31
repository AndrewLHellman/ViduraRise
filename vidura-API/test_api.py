import requests
import os
import sys
import json

def test_api(image_path):
    """
    Test the API by sending an image file and printing the response.

    Args:
        image_path (str): Path to the image file to test
    """
    if not os.path.exists(image_path):
        print(f"Error: Image file {image_path} does not exist.")
        return

    print(f"Testing API with image: {image_path}")

    # API endpoint
    url = "http://localh/api/process"

    # Open the file in binary mode
    with open(image_path, 'rb') as file:
        # Create the files dict for the request
        files = {'file': (os.path.basename(image_path), file, 'image/tiff')}

        # Send the request
        try:
            response = requests.post(url, files=files)

            # Print the response
            print(f"Status code: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print("API Response:")
                print(json.dumps(result, indent=2))
            else:
                print(f"Error: {response.text}")
        except requests.exceptions.ConnectionError:
            print("Connection error: Make sure the API server is running.")
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Check if an image path was provided
    if len(sys.argv) > 1:
        test_api(sys.argv[1])
    else:
        # Try to use a sample image from the seg_fft_7 test directory
        sample_image = "seg_fft_7/outputs/test/test_no_labels/test_pillar1_002.tif"
        if os.path.exists(sample_image):
            test_api(sample_image)
        else:
            print("Usage: python test_api.py <path_to_image_file>")
            print("No image path provided and couldn't find a sample image.")
