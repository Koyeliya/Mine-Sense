
import sys
import json
import pandas as pd
import numpy as np
import joblib
import os
import warnings
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Suppress sklearn version warnings
warnings.filterwarnings('ignore', category=UserWarning)

MODEL_PATH = 'server/model.pkl'
DATA_PATH = 'server/sonar.csv'

def load_or_train_model():
    model = None
    
    # Try loading existing model
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            # print("Model loaded successfully", file=sys.stderr)
            return model
        except Exception as e:
            print(f"Failed to load model: {e}", file=sys.stderr)

    # Train new model if loading failed
    print("Training new model...", file=sys.stderr)
    try:
        # Read sonar data - no header, 60 features + 1 label
        df = pd.read_csv(DATA_PATH, header=None)
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
        
        # Simple Logistic Regression with increased max_iter for convergence
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
        model = LogisticRegression(max_iter=1000, random_state=42)
        model.fit(X_train, y_train)
        
        # Save for next time
        joblib.dump(model, MODEL_PATH)
        return model
    except Exception as e:
        print(f"Error training model: {e}", file=sys.stderr)
        return None

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            return

        request = json.loads(input_data)
        features = request.get('features')
        
        if not features or len(features) != 60:
            print(json.dumps({"error": "Invalid features. Expected 60 numbers."}))
            return

        model = load_or_train_model()
        if not model:
            print(json.dumps({"error": "Model not available"}))
            return

        # Reshape for prediction
        features_np = np.array(features).reshape(1, -1)
        
        # Predict
        prediction = model.predict(features_np)[0]
        
        # Get probability if available
        confidence = 0.0
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features_np)
            confidence = float(np.max(probs))

        # Map 'R' to Rock, 'M' to Mine if raw output
        result_text = prediction
        if prediction == 'R':
            result_text = "Rock"
        elif prediction == 'M':
            result_text = "Mine"

        print(json.dumps({
            "result": result_text,
            "confidence": confidence
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
