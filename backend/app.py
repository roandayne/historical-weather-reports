from flask import Flask, request, jsonify, send_from_directory, send_file
from datetime import datetime, timedelta
from meteostat import Stations, Daily
from geopy.geocoders import Nominatim
import pandas as pd
import os
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from flask_cors import CORS
from utils import normalize_request_data
import io
import uuid
from threading import Timer

app = Flask(__name__)
CORS(app)

class FileStorage:
    def __init__(self):
        self.files = {}
        self.expiry = {}
        
    def store(self, data, file_type):
        file_id = str(uuid.uuid4())
        self.files[file_id] = data
        self.expiry[file_id] = datetime.now() + timedelta(minutes=5)
        
        Timer(300, self.remove, args=[file_id]).start()
        return file_id
        
    def get(self, file_id):
        if file_id in self.files and datetime.now() < self.expiry[file_id]:
            data = self.files[file_id]
            self.remove(file_id)
            return data
        return None
        
    def remove(self, file_id):
        self.files.pop(file_id, None)
        self.expiry.pop(file_id, None)

file_storage = FileStorage()

def get_coordinates(location_name):
    geolocator = Nominatim(user_agent="weather_data_extractor")
    location = geolocator.geocode(location_name)
    if location:
        return location.latitude, location.longitude
    else:
        raise ValueError(f"Location '{location_name}' not found. Please check the spelling or try a more specific name.")

def get_nearest_station(lat, lon):
    stations = Stations()
    stations = stations.nearby(lat, lon)
    station = stations.fetch(1)
    if not station.empty:
        return station.index[0]
    else:
        raise ValueError("No weather stations found nearby. Try a different location.")

def fetch_weather_data(station_id, start_date, end_date):
    data = Daily(station_id, start=start_date, end=end_date)
    data = data.fetch()
    if data.empty:
        raise ValueError("No weather data available for the specified date range.")
    return data

def validate_date(date_text):
    try:
        return datetime.strptime(date_text, "%d-%m-%Y")
    except ValueError:
        raise ValueError("Incorrect date format. Please use DD-MM-YYYY.")

def calculate_monthly_lost_days(weather_data):
    monthly_lost_days = pd.DataFrame(index=range(1, 13))

    monthly_lost_days['Max > 44°C'] = weather_data[weather_data['tmax'] > 44].groupby('month').size()
    monthly_lost_days['Max > 35°C'] = weather_data[weather_data['tmax'] > 35].groupby('month').size()
    monthly_lost_days['Min < 20°C'] = weather_data[weather_data['tmin'] < 20].groupby('month').size()
    monthly_lost_days['Min < 15°C'] = weather_data[weather_data['tmin'] < 15].groupby('month').size()
    monthly_lost_days['Min < 10°C'] = weather_data[weather_data['tmin'] < 10].groupby('month').size()
    monthly_lost_days['Min < 5°C'] = weather_data[weather_data['tmin'] < 5].groupby('month').size()

    monthly_lost_days['Rain > 25mm'] = weather_data[weather_data['prcp'] > 25].groupby('month').size()
    monthly_lost_days['Rain > 50mm'] = weather_data[weather_data['prcp'] > 50].groupby('month').size()

    if 'wspd' in weather_data.columns:
        monthly_lost_days['Wind > 10 m/s'] = weather_data[weather_data['wspd'] > 10].groupby('month').size()
        monthly_lost_days['Wind > 15 m/s'] = weather_data[weather_data['wspd'] > 15].groupby('month').size()
        monthly_lost_days['Wind > 20 m/s'] = weather_data[weather_data['wspd'] > 20].groupby('month').size()
    else:
        monthly_lost_days['Wind > 10 m/s'] = 0
        monthly_lost_days['Wind > 15 m/s'] = 0
        monthly_lost_days['Wind > 20 m/s'] = 0

    total_years = weather_data['year'].nunique()
    monthly_lost_days = monthly_lost_days.fillna(0) / total_years

    monthly_lost_days.index = monthly_lost_days.index.map({
        1: 'January', 2: 'February', 3: 'March', 4: 'April',
        5: 'May', 6: 'June', 7: 'July', 8: 'August',
        9: 'September', 10: 'October', 11: 'November', 12: 'December'
    })

    return monthly_lost_days

def analyze_weather_data(weather_data, location_name, script_dir, lat, lon):
    weather_data['month'] = weather_data.index.month
    weather_data['year'] = weather_data.index.year

    rain_over_5mm = weather_data[weather_data['prcp'] > 5].groupby('month').size() / weather_data['year'].nunique()
    rain_over_10mm = weather_data[weather_data['prcp'] > 10].groupby('month').size() / weather_data['year'].nunique()
    if 'wspd' in weather_data.columns:
        wind_over_40km = weather_data[weather_data['wspd'] > 40].groupby('month').size() / weather_data['year'].nunique()
    else:
        wind_over_40km = pd.Series(0, index=rain_over_5mm.index)

    summary = pd.DataFrame({
        'Rain > 5mm Days (Avg)': rain_over_5mm,
        'Rain > 10mm Days (Avg)': rain_over_10mm,
        'Wind > 40km/h Days (Avg)': wind_over_40km
    }).fillna(0)

    summary.index = summary.index.map({
        1: 'January', 2: 'February', 3: 'March', 4: 'April',
        5: 'May', 6: 'June', 7: 'July', 8: 'August',
        9: 'September', 10: 'October', 11: 'November', 12: 'December'
    })

    monthly_lost_days = calculate_monthly_lost_days(weather_data)

    excel_buffer = io.BytesIO()
    with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
        weather_data.to_excel(writer, sheet_name="Raw Data")
        summary.to_excel(writer, sheet_name="Monthly Summary")
        monthly_lost_days.to_excel(writer, sheet_name="Lost Days Summary")
    excel_buffer.seek(0)

    pdf_buffer = io.BytesIO()
    with PdfPages(pdf_buffer) as pdf:
        plt.figure(figsize=(10, 6))
        plt.plot(weather_data.index, weather_data['tavg'], label="Avg Temp (°C)", color='blue')
        plt.title(f"Temperature Trends - {location_name}")
        plt.xlabel("Date")
        plt.ylabel("Temperature (°C)")
        plt.legend()
        pdf.savefig()
        plt.close()

        if {'Rain > 5mm Days (Avg)', 'Rain > 10mm Days (Avg)', 'Wind > 40km/h Days (Avg)'}.issubset(summary.columns):
            plt.figure(figsize=(12, 6))
            bar_width = 0.25
            months = summary.index
            x = range(len(months))
            plt.bar(x, summary['Rain > 5mm Days (Avg)'], width=bar_width, label="Rain > 5mm Days", color='skyblue')
            plt.bar([i + bar_width for i in x], summary['Rain > 10mm Days (Avg)'], width=bar_width, label="Rain > 10mm Days", color='orange')
            plt.bar([i + 2 * bar_width for i in x], summary['Wind > 40km/h Days (Avg)'], width=bar_width, label="Wind > 40km/h Days", color='green')
            plt.title(f"Monthly Summary - {location_name}")
            plt.xticks([i + bar_width for i in x], months, rotation=45)
            plt.legend()
            pdf.savefig()
            plt.close()

        plt.figure(figsize=(14, 8))
        monthly_lost_days.plot(kind='bar', figsize=(14, 8))
        plt.title(f"Lost Days Summary (Monthly Averages) - {location_name}")
        plt.ylabel("Average Number of Days")
        plt.xlabel("Month")
        plt.xticks(rotation=45)
        plt.legend(title="Thresholds")
        pdf.savefig()
        plt.close()

        plt.figure(figsize=(10, 6))
        ax = plt.axes(projection=ccrs.PlateCarree())
        ax.set_extent([-180, 180, -90, 90], crs=ccrs.PlateCarree())
        ax.add_feature(cfeature.COASTLINE, linewidth=0.5)
        ax.add_feature(cfeature.BORDERS, linestyle=':')
        ax.add_feature(cfeature.LAND, color='lightgray')
        ax.add_feature(cfeature.OCEAN, color='lightblue')
        plt.plot(lon, lat, 'ro', markersize=8, transform=ccrs.PlateCarree(), label='Weather Station')
        plt.title(f"Weather Station Location - {location_name}")
        plt.legend()
        pdf.savefig()
        plt.close()
    pdf_buffer.seek(0)

    return excel_buffer, pdf_buffer

@app.route('/api/weather-data', methods=['POST'])
@normalize_request_data
def weather_data_endpoint():
    data = request.get_json()
    location_name = data.get('location')
    start_date_input = data.get('start_date')
    end_date_input = data.get('end_date')

    if not all([location_name, start_date_input, end_date_input]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        start_date = validate_date(start_date_input)
        end_date = validate_date(end_date_input)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        lat, lon = get_coordinates(location_name)
        station_id = get_nearest_station(lat, lon)
        weather_data = fetch_weather_data(station_id, start_date, end_date)
        
        excel_buffer, pdf_buffer = analyze_weather_data(weather_data, location_name, script_dir, lat, lon)

        excel_id = file_storage.store(excel_buffer.getvalue(), 'excel')
        pdf_id = file_storage.store(pdf_buffer.getvalue(), 'pdf')

        return jsonify({
            "message": "Weather analysis complete.",
            "excel_report": f"{excel_id}.xlsx",
            "pdf_report": f"{pdf_id}.pdf"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not all([lat, lon]):
        return jsonify({"error": "Missing latitude or longitude"}), 400
        
    try:
        geolocator = Nominatim(user_agent="weather_data_extractor")
        location = geolocator.reverse((float(lat), float(lon)), language='en')
        
        if location and location.raw.get('address'):
            address = location.raw['address']
            city = address.get('city') or address.get('town') or address.get('village')
            country = address.get('country')
            
            if city and country:
                formatted_location = f"{city}, {country}"
            else:
                formatted_location = location.address
                
            return jsonify({
                "location": formatted_location,
                "raw": location.raw
            })
        else:
            return jsonify({"error": "Location not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/geocode', methods=['GET'])
def geocode():
    query = request.args.get('q')
    
    if not query:
        return jsonify({"error": "Missing search query"}), 400
        
    try:
        geolocator = Nominatim(user_agent="weather_data_extractor")
        locations = geolocator.geocode(query, exactly_one=False, limit=5)
        
        if locations:
            results = []
            for location in locations:
                results.append({
                    "display_name": location.address,
                    "lat": location.latitude,
                    "lon": location.longitude
                })
            return jsonify(results)
        else:
            return jsonify([])
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download/<path:filename>')
def download_file(filename):
    try:
        file_id = filename.rsplit('.', 1)[0]
        
        if filename.endswith('.xlsx'):
            buffer_data = file_storage.get(file_id)
            mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        elif filename.endswith('.pdf'):
            buffer_data = file_storage.get(file_id)
            mimetype = 'application/pdf'
        else:
            return jsonify({"error": "Invalid file type"}), 400

        if buffer_data is None:
            return jsonify({"error": "File not found or expired"}), 404

        return send_file(
            io.BytesIO(buffer_data),
            mimetype=mimetype,
            as_attachment=True,
            download_name=f"{filename.split('.')[0]}_{datetime.now().strftime('%Y%m%d')}.{filename.split('.')[1]}"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)