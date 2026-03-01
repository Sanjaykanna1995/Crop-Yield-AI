import sys
import json
import joblib
import pandas as pd
import os

# ----------------------------
# Load Model
# ----------------------------


current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "model.pkl")

model = joblib.load(model_path)

# ----------------------------
# Read JSON input from STDIN
# ----------------------------
input_json = sys.stdin.read()

data = json.loads(input_json)

input_df = pd.DataFrame([data])

# ----------------------------
# Predict
# ----------------------------
prediction = model.predict(input_df)[0]

result = {
    "predicted_yield": round(float(prediction), 2)
}

print(json.dumps(result))