from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import traceback
import json
import os

app = Flask(__name__)

# This allows your Vite React app (usually running on localhost:5173) to talk to Flask
CORS(app)

# 1. Load your Random Forest pipeline and Metrics
model = None
model_metrics = {"accuracy": "N/A", "mae": "N/A"}

try:
    # Load the trained model
    model = joblib.load('model/crop_yield_model.pkl')
    print("✅ Model loaded successfully!")
    
    # Load the metrics (Accuracy and MAE) generated during training
    if os.path.exists('model/metrics.json'):
        with open('model/metrics.json', 'r') as f:
            model_metrics = json.load(f)
        print(f"✅ Metrics loaded: Accuracy {model_metrics['accuracy']}%")
    else:
        print("⚠️ metrics.json not found. Using default values.")

except Exception as e:
    print(f"❌ Error during initialization: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not found on server.'}), 500

    try:
        # 1. Get the JSON payload sent from React App.jsx
        data = request.json
        
        # 2. Map React keys to the EXACT column names your model was trained on
        input_data = pd.DataFrame([{
            'Area': data['area'],
            'Item': data['item'],
            'Year': int(data['year']),
            'average_rain_fall_mm_per_year': float(data['rainfall']),
            'pesticides_tonnes': float(data['pesticides']),
            'avg_temp': float(data['temp'])
        }])

        # 3. Feed the DataFrame into the Random Forest Pipeline
        prediction = model.predict(input_data)
        
        # 4. Return the full payload needed for ResultCard.jsx
        # We include yield, accuracy, and mae
        return jsonify({
            'yield': round(float(prediction[0]), 2),
            'accuracy': model_metrics['accuracy'],
            'mae': model_metrics['mae']
            # If you add graph generation later, you'd add 'graph_image': graph_base64 here
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Starts the server on http://localhost:5000
    app.run(debug=True, port=5000)