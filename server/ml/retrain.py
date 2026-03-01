import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# ----------------------------
# Load Original Dataset
# ----------------------------
original_path = "dataset/cleaned_dataset.csv"
updated_path = "dataset/updated_dataset.csv"

original_df = pd.read_csv(original_path)

# ----------------------------
# Check if updated dataset exists & not empty
# ----------------------------
if os.path.exists(updated_path) and os.path.getsize(updated_path) > 0:
    updated_df = pd.read_csv(updated_path)
    df = pd.concat([original_df, updated_df], ignore_index=True)
    print("Using original + updated dataset")
else:
    df = original_df
    print("No updated data found, using original dataset")

# ----------------------------
# Split Features & Target
# ----------------------------
X = df.drop("yield", axis=1)
y = df["yield"]

categorical_features = ["soil_type", "crop_type", "fertilizer"]
numeric_features = ["temperature", "rainfall", "humidity", "area"]

# ----------------------------
# Preprocessing
# ----------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features),
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(
            n_estimators=200,
            random_state=42
        ))
    ]
)

# ----------------------------
# Train
# ----------------------------
model.fit(X, y)

# ----------------------------
# Save New Model
# ----------------------------
joblib.dump(model, "model.pkl")

print("Model retrained successfully and updated.")