import pandas as pd
import numpy as np

# Load raw Kaggle dataset
df = pd.read_csv("dataset/original_dataset.csv")

# Rename label to crop_type
df.rename(columns={"label": "crop_type"}, inplace=True)

# ----------------------------
# Derive Fertilizer from NPK
# ----------------------------
def determine_fertilizer(row):
    if row["N"] > row["P"] and row["N"] > row["K"]:
        return "Urea"
    elif row["P"] > row["N"] and row["P"] > row["K"]:
        return "DAP"
    elif row["K"] > row["N"] and row["K"] > row["P"]:
        return "MOP"
    else:
        return "NPK"

df["fertilizer"] = df.apply(determine_fertilizer, axis=1)

# ----------------------------
# Derive Soil Type from pH
# ----------------------------
def determine_soil(ph):
    if ph < 6.0:
        return "Acidic"
    elif ph <= 7.5:
        return "Loamy"
    else:
        return "Alkaline"

df["soil_type"] = df["ph"].apply(determine_soil)

# ----------------------------
# Generate Area (1–5 hectares)
# ----------------------------
np.random.seed(42)
df["area"] = np.random.uniform(1.0, 5.0, len(df))

# ----------------------------
# Generate Yield (Simulated)
# ----------------------------
df["yield"] = (
    0.05 * df["rainfall"]
    + 0.04 * df["humidity"]
    + 0.03 * df["temperature"]
    + 0.1 * df["area"]
    + np.random.normal(0, 2, len(df))
)

# Keep only required columns
final_df = df[
    [
        "temperature",
        "rainfall",
        "humidity",
        "soil_type",
        "crop_type",
        "fertilizer",
        "area",
        "yield",
    ]
]

# Save cleaned dataset
final_df.to_csv("dataset/cleaned_dataset.csv", index=False)

print("Dataset transformed successfully!")