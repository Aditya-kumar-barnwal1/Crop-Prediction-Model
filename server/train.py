import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import os
import json

print("🌱 Initializing AI Model Build...")

# 1. Load Data OR Generate Fallback Data
try:
    df = pd.read_csv('yield_df.csv')
    print("✅ Found yield_df.csv! Training on Kaggle data...")
except FileNotFoundError:
    print("⚠️ Kaggle CSV not found. Generating synthetic dataset...")
    areas = ['India', 'Brazil', 'Mexico', 'Japan', 'Australia', 'Canada', 'Spain', 'Egypt']
    items = ['Potatoes', 'Maize', 'Wheat', 'Rice, paddy', 'Soybeans']
    data = []
    for _ in range(2000):
        data.append({
            'Area': np.random.choice(areas),
            'Item': np.random.choice(items),
            'Year': np.random.randint(2000, 2024),
            'average_rain_fall_mm_per_year': np.random.uniform(300, 3000),
            'pesticides_tonnes': np.random.uniform(5, 600),
            'avg_temp': np.random.uniform(10, 35),
            'hg/ha_yield': np.random.uniform(15000, 90000)
        })
    df = pd.DataFrame(data)

# 2. Separate Features and Target
X = df[['Area', 'Item', 'Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp']]
y = df['hg/ha_yield']

# 3. Train/Test Split (Crucial for calculating accuracy)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Build Preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), ['Area', 'Item'])
    ],
    remainder='passthrough'
)

# 5. Create and Train Pipeline
print("🧠 Training Random Forest... (this might take a minute)")
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    # Change your regressor line to this:
    ('regressor', RandomForestRegressor(n_estimators=50, max_depth=20, random_state=42))
])

model.fit(X_train, y_train)

# 6. Calculate Metrics
predictions = model.predict(X_test)
r2 = r2_score(y_test, predictions)
mae = mean_absolute_error(y_test, predictions)

metrics = {
    "accuracy": round(r2 * 100, 2),
    "mae": round(mae, 2)
}

print(f"🎯 Model Accuracy (R²): {metrics['accuracy']}%")
print(f"📏 Mean Absolute Error: {metrics['mae']} hg/ha")

# 7. Save Model and Metrics
os.makedirs('model', exist_ok=True)
# Change your dump line to this:
joblib.dump(model, 'model/crop_yield_model.pkl', compress=3)

with open('model/metrics.json', 'w') as f:
    json.dump(metrics, f)

print("🎉 BOOM! Model and Metrics saved successfully.")