import requests
import json
import matplotlib.pyplot as plt
import pandas as pd
import sys

def test_api(query, api_url="http://localhost:5002/temp_thickness"):
    """
    Test the temperature and thickness prediction API with a given query.

    Parameters:
    - query: The user query string containing temperature and thickness info
    - api_url: The URL of the API endpoint

    Returns:
    - API response data if successful
    """
    # Prepare the request payload
    payload = {"user_query": query}

    # Make the POST request to the API
    try:
        response = requests.post(api_url, json=payload)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
        return None

def visualize_results(data):
    """
    Visualize the CNT-G prediction results over time.

    Parameters:
    - data: API response data containing the prediction results
    """
    if not data or len(data) == 0:
        print("No data to visualize")
        return

    # Convert the data to a DataFrame
    df = pd.DataFrame(data)

    # Extract unique temperature and thickness values for the title
    temperature = df['Temperature (Tp, °C)'].iloc[0]
    thickness = df['Catalyst Thickness (d, nm)'].iloc[0]

    # Create the visualization
    plt.figure(figsize=(10, 6))
    plt.plot(df['Time (t, s)'] / 60, df['CNT-G (micrometers/s)'], 'b-')
    plt.xlabel('Time (minutes)')
    plt.ylabel('CNT-G (micrometers/s)')
    plt.title(f'CNT-G Prediction for Temperature {temperature}°C and Thickness {thickness}nm')
    plt.grid(True)
    plt.tight_layout()

    # Save the figure
    plt.savefig('cnt_g_prediction.png')

    # Show the figure
    plt.show()

    # Print some summary statistics
    print("\nSummary Statistics:")
    print(f"Mean CNT-G: {df['CNT-G (micrometers/s)'].mean():.4f} micrometers/s")
    print(f"Max CNT-G: {df['CNT-G (micrometers/s)'].max():.4f} micrometers/s")
    print(f"Min CNT-G: {df['CNT-G (micrometers/s)'].min():.4f} micrometers/s")

def main():
    # Get the query from command line or use default
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "run the prediction for Temperature 800 and Thickness 1.27"

    print(f"Testing API with query: '{query}'")

    # Call the API
    data = test_api(query)

    if data:
        print(f"API returned {len(data)} data points")

        # Display first 5 and last 5 data points
        df = pd.DataFrame(data)
        print("\nFirst 5 data points:")
        print(df.head().to_string())
        print("\nLast 5 data points:")
        print(df.tail().to_string())

        # Visualize the results
        visualize_results(data)
    else:
        print("Failed to get valid data from the API")

if __name__ == "__main__":
    main()
