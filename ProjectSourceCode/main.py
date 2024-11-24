from flask import Flask, request, jsonify
import io
import pandas as pd
import cleaner as clean
import time
from time import sleep
from flask_cors import CORS
import json
import pickle


app = Flask(__name__)
data=None
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])



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
    file = request.files["file"]
    #checks
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith(".csv"):
        try:
    
            file_content = file.stream.read().decode("utf-8")
            # print("File Content:\n", file_content)  # Display file content

            # Reset the stream so it can be read by Pandas
            file.stream.seek(0)

            # Read CSV
            #df = pd.read_csv(io.StringIO(file_content))
            global data
            data = clean.Cleaner(io.StringIO(file_content))
            with open("temp_data/data.pkl", "wb") as f:
                pickle.dump(data, f)
            print("TYPES")
            print(data.get_data_types())
            print("HEAD") 
            print(data.get_head())
            #@TODO there is an issue here with not all methods being applicable

            # print("GRANULARITY")
            # print(data.get_granularity())
            # print("COL")
            # row = data.row(3)
            # print(row)
            # data.clean(duplicates=True, normalize=True, naEntries=True, convertTime=True, convertDate=True)
            
            # print(data.get_granularity())

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
    choices = request.json
    if not choices:
        return jsonify({'error': 'No data choices'}), 400

    # Process the chip states (e.g., save to database or perform actions)
    print("Received chip states:", choices)
    if(choices["graphing"] == True):
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



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

