import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import r2_score, mean_absolute_error

# ----------------------------
# Load Cleaned Dataset
# ----------------------------
df = pd.read_csv("dataset/cleaned_dataset.csv")

# ----------------------------
# Features and Target
# ----------------------------
X = df.drop("yield", axis=1)
y = df["yield"]

# ----------------------------
# Identify Column Types
# ----------------------------
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

# ----------------------------
# Model Pipeline
# ----------------------------
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
# Train-Test Split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------
# Train Model
# ----------------------------
model.fit(X_train, y_train)

# ----------------------------
# Evaluate Model
# ----------------------------
y_pred = model.predict(X_test)

print("R2 Score:", r2_score(y_test, y_pred))
print("MAE:", mean_absolute_error(y_test, y_pred))

# ----------------------------
# Save Model
# ----------------------------
joblib.dump(model, "model.pkl")

print("Model trained and saved as model.pkl")