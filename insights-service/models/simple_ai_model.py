from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, IsolationForest
import joblib
import os


class SimpleAIModel:
    """
    A lightweight wrapper for scikit-learn models to handle financial predictions
    without excessive CPU usage. Uses simple models that are efficient for small datasets.
    """

    def __init__(self, model_type="linear"):
        self.model_type = model_type
        if model_type == "linear":
            self.model = LinearRegression()
        elif model_type == "forest":
            self.model = RandomForestRegressor(n_estimators=50, max_depth=10, n_jobs=1)
        elif model_type == "anomaly":
            self.model = IsolationForest(n_estimators=50, contamination=0.1, n_jobs=1)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")

    def fit(self, X, y=None):
        """Fit the model with provided data."""
        try:
            if self.model_type == "anomaly":
                self.model.fit(X)
            else:
                if y is None:
                    raise ValueError(
                        "Target (y) must be provided for regression models."
                    )
                self.model.fit(X, y)
        except Exception as e:
            print(f"Error during model fitting: {e}")
            raise
        return self

    def predict(self, X):
        """Make predictions with the model."""
        try:
            predictions = self.model.predict(X)
        except Exception as e:
            print(f"Error during prediction: {e}")
            raise
        return predictions

    def save(self, filename):
        """Save the model to disk."""
        try:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            joblib.dump(self.model, filename)
        except Exception as e:
            print(f"Error saving model: {e}")
            raise

    def load(self, filename):
        """Load the model from disk."""
        if os.path.exists(filename):
            try:
                self.model = joblib.load(filename)
            except Exception as e:
                print(f"Error loading model: {e}")
                return False
            return True
        else:
            print(f"Model file not found: {filename}")
            return False
