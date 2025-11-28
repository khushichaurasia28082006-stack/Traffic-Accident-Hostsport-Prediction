from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model (optional)
try:
    model = pickle.load(open("model.pkl", "rb"))
except:
    model = None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']

    # If model exists
    if model:
        x = np.array([[lat, lon]])
        result = model.predict(x)[0]
    else:
        # Dummy logic (works even without model)
        result = "High Risk" if lat > 20 else "Low Risk"

    return jsonify({"risk_level": result})

if __name__ == "__main__":
    app.run(debug=True)
