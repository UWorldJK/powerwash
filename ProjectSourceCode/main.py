from flask import Flask, jsonify, send_from_directory, request
import io
import pandas as pd
import cleaner as clean
import time
from time import sleep
from flask_cors import CORS
import json
import pickle
import os
import shutil



app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])

data=None
granularity = None
fileName = None

# keep in the same order as chips js
features = {
    "graphing": False,
    "normalization": False,
    "granularity": False,
    "standardization": False,
    "missing value removal": False,
    "missing value imputation": False,
    "duplicate removal": False,
    "standardize time format": False,
    "standardize date format": False,
    "scaling": False,
    "binning": False,
    "encoding": False,
    "data type conversion": False,
    "feature extraction": False,
    "noise reduction": False,
    "data augmentation": False,
    "anomaly detection": False,
    "dimensionality reduction": False,
    "text cleaning": False,
    "tokenization": False,
    "stemming": False,
    "lemmatization": False,
    "data smoothing": False,
    "aggregation": False,
    "data transformation": False,
    "categorical conversion": False,
    "time series decomposition": False,
    "data discretization": False,
    "feature selection": False
}


def returnHead():
    return data.get_head()
def get_clean():
    return data.clean()
def get_eda():
    #this method will do all of the automatic EDA, and return the user the 5 pillars
    to_ret = []
    to_ret.append(data.get_granularity())
    to_ret.append(data.get_structure())
    to_ret.append(data.get_data_types())
    return to_ret

@app.route("/upload", methods=["POST"])
def getFile():
    global data
    global fileName
    file = request.files["file"]
    #checks
    fileName = file.filename
    print("FILE NAME", fileName)
    if fileName == "":
        return jsonify({"error": "No selected file"}), 400
    if file and fileName.endswith(".csv"):
        try:
    
            file_content = file.stream.read().decode("utf-8")
            # print("File Content:\n", file_content)  # Display file content

            # Reset the stream so it can be read by Pandas
            file.stream.seek(0)

            # Read CSV
            global data
            data = clean.Cleaner(io.StringIO(file_content))
            with open("temp_data/data.pkl", "wb") as f: #write to pkl file
                pickle.dump(data, f)
            with open("temp_data/fileName.pkl", "wb") as f: #write to pkl file
                pickle.dump(fileName, f)
            print("TYPES")
            print(data.get_data_types())
            print("HEAD") 
            print(data.get_head())

            return jsonify({
                'message': "the file was correctly uploaded"
            }), 200
        except Exception as e:
            print(e)
            return jsonify({
                'message': "the final was not correctly uploaded, exception e caught"
            }), 400

@app.route('/get-data', methods=["GET"])
def get_data():
    with open("temp_data/data.pkl", "rb") as f:
        data = pickle.load(f)
    if data is not None:
        head_data = data.get_head()  # Convert to list of dictionaries
        return head_data.to_json(orient='records'), 200
    else:
        print("DATA WAS NONE IN GET DATA")
        return jsonify({"error": "No data available"}), 400
    
@app.route('/get-vars', methods=["GET"])
def get_varNames():
    with open("temp_data/data.pkl", "rb") as f:
        data = pickle.load(f)
    if data is not None:
        col_data = data.get_columns().tolist()  # Convert to list of dictionaries
        print(col_data)
        return jsonify(json.dumps(col_data)), 200
    else:
        print("DATA WAS NONE IN GET VARS")
        return jsonify({"error": "No cols available"}), 400
    
@app.route('/submit-choices', methods=['POST'])
def submit_choices():
    global features
    global granularity    
    with open("temp_data/data.pkl", "rb") as f: #read from pkl file
        data = pickle.load(f)
    with open("temp_data/fileName.pkl", "rb") as f: #read from pkl file
        fileName = pickle.load(f)
        
    choices = request.json
    if not choices:
        return jsonify({'error': 'No data choices'}), 400
    
    for choice in choices:
        print(choice)
        if choices[choice] == True:
            features[choice] = True
    
    #always run with bools
    data.clean(features)
    
    #store in granularity var 
    if(features["granularity"] == True):
        granularity = data.get_granularity()
    
    # if(features["shape"] == True):
    #     shape = data.get_granularity(
 
    cleanName = "clean_" + fileName
    fileName = cleanName
    
    
    os.mkdir("cleaned_data")
    data.get_df().to_csv("cleaned_data/"+fileName, index=False) #save clean data for download
    
    with open("temp_data/data.pkl", "wb") as f: #write to pkl file
                pickle.dump(data, f)
    with open("temp_data/fileName.pkl", "wb") as f: #write to pkl file
                pickle.dump(fileName, f)
                
    print(features["graphing"])
    print("Received chip states:", choices)
    if(features["graphing"] == True):
        return jsonify({'message': 'Choices received, redirect to graph selection'}), 201
    
    return jsonify({'message': 'Choices received successfully!'}), 200

@app.route('/get-pair-data', methods=['POST'])
def get_pair_data():
    pair = request.json.get("pair", [])
    if not pair or len(pair) != 2:
        return jsonify({"error": "Invalid pair data provided"}), 400

    x_col, y_col = pair
    with open("temp_data/data.pkl", "rb") as f:
        data = pickle.load(f)

    if data is not None:
        try:
            # Fetch the columns from the data
            print("x:",x_col)
            print("y:",y_col)
            x_data = (data.get_column_data(x_col)).tolist()  # Assuming `get_column` is defined in `Cleaner`
            y_data = (data.get_column_data(y_col)).tolist()
            return jsonify({"x": x_data, "y": y_data}), 200
        except KeyError as e:
            return jsonify({"error": f"Column not found: {e}"}), 400
    else:
        return jsonify({"error": "Data is not loaded"}), 400

# Endpoint to get the file name
@app.route('/get-filename', methods=['GET'])
def get_filename():
    with open("temp_data/fileName.pkl", "rb") as f: #read from pkl file
        fileName = pickle.load(f)
    return jsonify({'filename': fileName})

@app.route('/delete-clean-folder', methods=['POST'])
def delete_cleanData_folder():
    removedFile = "removedFile"
    if os.path.exists("cleaned_data/"):
        shutil.rmtree('cleaned_data/')  
    return jsonify({'removed':removedFile}), 200

# Endpoint to serve the file
@app.route('/cleaned_data/<path:filename>', methods=['GET'])
def download_file(filename):
    with open("temp_data/fileName.pkl", "rb") as f: #read from pkl file
        fileName = pickle.load(f)
    try:
        # Make sure the file exists in the cleaned_data directory
        file_path = os.path.join("cleaned_data/", fileName)
        if os.path.exists(file_path):
            return send_from_directory("cleaned_data", fileName, as_attachment=True)
        else:
            return jsonify({"filepath":file_path,"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

