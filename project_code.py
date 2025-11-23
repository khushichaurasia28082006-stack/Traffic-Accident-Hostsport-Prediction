# Traffic Accident Hotspot Prediction
# Author: Khushi Chaurasia

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# ---------------------------
# 1. Load dataset
# ---------------------------
# Replace "accident_data.csv" with your file name
data = pd.read_csv("accident_data.csv")

# ---------------------------
# 2. Clean data
# ---------------------------
data = data.dropna()   # remove missing rows

# ---------------------------
# 3. Select features & label
# ---------------------------
# Example columns (change names according to your CSV)
X = data[["latitude", "longitude", "traffic_volume", "weather"]]
y = data["accident_hotspot"]  # 1 = hotspot, 0 = not hotspot

# ---------------------------
# 4. Train-Test Split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------
# 5. Model
# ---------------------------
model = RandomForestClassifier()
model.fit(X_train, y_train)

# ---------------------------
# 6. Predictions & Accuracy
# ---------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Model Accuracy:", accuracy)
