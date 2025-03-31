from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import joblib
import numpy as np
import pandas as pd

import re

load_dotenv()

rf_model = joblib.load("rf_model.pkl")

def get_temperature_and_thickness(string):
    # Case insensitive regex pattern matching
    temperature_match = re.search(r"temperature\s+(\d+)", string, re.IGNORECASE)
    thickness_match = re.search(r"thickness\s+(\d+(?:\.\d+)?)", string, re.IGNORECASE)
    
    temperature = None
    thickness = None
    
    if temperature_match:
        temperature = int(temperature_match.group(1))
    if thickness_match:
        thickness = float(thickness_match.group(1))
        
    return temperature, thickness

app = Flask(__name__)
CORS(app)

@app.route('/temp_thickness', methods=['POST'])
def temp_thickness():
    try:
        data = request.json
        if not data or 'user_query' not in data:
                    return jsonify({"error": "Missing 'user_query' in request body"}), 400

        user_query = data['user_query']

        experiment_time_span = 20 # minutes

        temperature, catalyst_thickness = get_temperature_and_thickness(user_query)
        time_values = np.arange(0, experiment_time_span * 60 +1 , 1)

        user_test_set = pd.DataFrame({
            'Temperature (Tp, °C)': [temperature] * len(time_values),
            'Time (t, s)': time_values,
            'Catalyst Thickness (d, nm)': [catalyst_thickness] * len(time_values)
        })

        user_test_set['CNT-G (micrometers/s)'] = rf_model.predict(user_test_set)
        user_test_set.tail()

        # Return the response with metadata
        return jsonify(user_test_set.to_dict(orient='records'))



    except Exception as e:
        # Enhanced error handling with more detail
        import traceback
        error_detail = traceback.format_exc()
        print(f"Error processing query: {str(e)}\n{error_detail}")

        # Return a more user-friendly error
        return jsonify({
            "error": "An error occurred while processing your query",
            "detail": str(e) if app.debug else "Please try again later"
        }), 500

if __name__ == '__main__':
    # Get environment variables with defaults
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT_REGRESSION", "5002"))
    debug = os.getenv("FLASK_DEBUG", "False") == "True"
    
    # Start Flask app
    app.run(host=host, port=port, debug=debug)
