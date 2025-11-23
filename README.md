# Traffic Accident Hotspot Prediction

This project uses Machine Learning to identify accident-prone areas (hotspots) using historical traffic data.

## 🚦 Project Overview
Road accidents have been increasing yearly, and identifying high-risk zones can help prevent future accidents and improve public safety. This project analyzes accident data and predicts hotspot regions on a map.

## 🧠 Features
- Data Cleaning & Preprocessing  
- Exploratory Data Analysis (EDA)  
- Clustering for hotspot detection (DBSCAN / K-Means)  
- ML model training  
- Geo-visualization (heatmaps)  
- Accuracy evaluation  

## 📊 Technologies Used
- Python  
- Pandas  
- NumPy  
- Scikit-Learn  
- Matplotlib / Seaborn  
- Folium / GeoPandas  

## 📁 Project Structure
traffic-accident-hotspot-prediction/
│
├── data/
│   ├── raw_data.csv              # Original accident dataset
│   ├── cleaned_data.csv          # Preprocessed dataset
│
├── notebooks/
│   ├── EDA.ipynb                 # Exploratory Data Analysis
│   ├── clustering.ipynb          # DBSCAN/K-Means hotspot detection
│
├── src/
│   ├── preprocessing.py          # Data cleaning functions
│   ├── clustering.py             # Clustering model code
│   ├── visualization.py          # Heatmap / map visualization
│
├── results/
│   ├── hotspot_map.html          # Final geo-visualization
│   ├── model_report.pdf          # Accuracy metrics
│
├── README.md                     # Project documentation
├── requirements.txt              # Dependencies
└── main.py                       # Main script to run the project
## 🧪 How It Works
1. Load accident dataset
2. Clean missing values
3. Extract features (time, location, weather, etc.)
4. Apply clustering to detect hotspot regions
5. Plot hotspots on an interactive map

## 🔮 Future Scope
- Real-time accident prediction
- Weather + traffic integration
- Deployment with a live dashboard

## 👩‍💻 Author
Khushi Chaurasia
B.Tech – AIDS
