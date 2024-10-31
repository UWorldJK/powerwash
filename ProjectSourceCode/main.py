from flask import Flask, request, jsonify
import io
import pandas as pd
import cleaner as clean
import time

app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def getFile():
    file = request.files["file"]
    #checks
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith(".csv"):
        try:
            # Print file content for debugging
            file_content = file.stream.read().decode("utf-8")
            # print("File Content:\n", file_content)  # Display file content

            # Reset the stream so it can be read by Pandas
            file.stream.seek(0)

            # Read CSV
            #df = pd.read_csv(io.StringIO(file_content))
            #print(df.head())
            start_time = time.time()
            # ... (file reading code)
            print(f"File read time: {time.time() - start_time:.2f} seconds")

            cleaner_start = time.time()
            data = clean.Cleaner(io.StringIO(file_content))
            print(f"Cleaner initialization time: {time.time() - cleaner_start:.2f} seconds")

            head_start = time.time()
            head = data.get_head()
            print(f"get_head time: {time.time() - head_start:.2f} seconds")

            granularity_start = time.time()
            granularity = data.get_granularity()
            print(f"get_granularity time: {time.time() - granularity_start:.2f} seconds")

            print(f"Total processing time: {time.time() - start_time:.2f} seconds")

            return jsonify({
                'message': "the file was correctly uploaded"
            }), 200
        except Exception as e:
            print(e)
            return jsonify({
                'message': "the final was not correctly uploaded, exception e caught"
            }), 400
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
