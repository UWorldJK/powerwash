from flask import Flask, request, jsonify
import io
import pandas as pd
import cleaner as clean
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
            print("File Content:\n", file_content)  # Display file content

            # Reset the stream so it can be read by Pandas
            file.stream.seek(0)

            # Read CSV
            df = pd.read_csv(io.StringIO(file_content))
            print(df.head())
            return jsonify({
                'message': "done"
            }), 200
        except Exception as e:
            print(e)
            return jsonify({
                'message': "done"
            }), 400
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
