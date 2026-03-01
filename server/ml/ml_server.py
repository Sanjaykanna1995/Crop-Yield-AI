from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "model.pkl")

# 🔥 Load model ONCE
model = joblib.load(model_path)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    input_df = pd.DataFrame([data])
    prediction = model.predict(input_df)[0]

    return jsonify({
        "predicted_yield": round(float(prediction), 2)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)