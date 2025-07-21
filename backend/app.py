from flask import Flask, request, jsonify, send_from_directory, send_file
from datetime import datetime, timedelta
from meteostat import Stations, Daily, Hourly
from geopy.geocoders import Nominatim
import pandas as pd
import os
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from flask_cors import CORS
from utils import normalize_request_data
import io
import uuid
from threading import Timer
from constants import (
    API_CONFIG, DATE_FORMATS, WEATHER_THRESHOLDS, FILE_CONFIG, 
    ERROR_MESSAGES, MONTH_MAPPING, APP_METADATA, DEFAULTS, PERFORMANCE_CONFIG
)

app = Flask(__name__)
CORS(app)

class FileStorage:
    def __init__(self):
        self.files = {}
        self.metadata = {}
        self.expiry = {}
        
    def store(self, data, file_type, location_name=None):
        file_id = str(uuid.uuid4())
        self.files[file_id] = data
        self.metadata[file_id] = {
            'file_type': file_type,
            'location_name': location_name
        }
        self.expiry[file_id] = datetime.now() + timedelta(minutes=API_CONFIG['FILE_EXPIRY_MINUTES'])
        
        Timer(API_CONFIG['FILE_EXPIRY_SECONDS'], self.remove, args=[file_id]).start()
        return file_id
        
    def get(self, file_id):
        if file_id in self.files and datetime.now() < self.expiry[file_id]:
            data = self.files[file_id]
            metadata = self.metadata[file_id]
            self.remove(file_id)
            return data, metadata
        return None, None
        
    def remove(self, file_id):
        self.files.pop(file_id, None)
        self.metadata.pop(file_id, None)
        self.expiry.pop(file_id, None)

file_storage = FileStorage()

def get_coordinates(location_name):
    geolocator = Nominatim(user_agent=API_CONFIG['USER_AGENT'])
    location = geolocator.geocode(location_name)
    if location:
        return location.latitude, location.longitude
    else:
        raise ValueError(ERROR_MESSAGES['VALIDATION']['LOCATION_NOT_FOUND'].format(location_name))

def get_nearest_station(lat, lon):
    stations = Stations()
    stations = stations.nearby(lat, lon)
    station = stations.fetch(1)
    if not station.empty:
        return station.index[0]
    else:
        raise ValueError(ERROR_MESSAGES['VALIDATION']['NO_WEATHER_STATIONS'])

def fetch_weather_data(station_id, start_date, end_date):
    data = Daily(station_id, start=start_date, end=end_date)
    data = data.fetch()
    if data.empty:
        raise ValueError(ERROR_MESSAGES['VALIDATION']['NO_WEATHER_DATA'])
    return data

def validate_date(date_text):
    try:
        return datetime.strptime(date_text, DATE_FORMATS['INPUT_FORMAT'])
    except ValueError:
        raise ValueError(ERROR_MESSAGES['VALIDATION']['INVALID_DATE_FORMAT'])

def calculate_monthly_lost_days(weather_data):
    monthly_groups = weather_data.groupby('month')
    total_years = weather_data['year'].nunique()
    
    temp_thresholds = WEATHER_THRESHOLDS['TEMPERATURE']
    precip_thresholds = WEATHER_THRESHOLDS['PRECIPITATION']
    wind_thresholds = WEATHER_THRESHOLDS['WIND']

    monthly_lost_days = pd.DataFrame(index=range(1, 13))
    
    for threshold_name, threshold_value in [
        (f'Max > {temp_thresholds["MAX_HIGH"]}°C', temp_thresholds['MAX_HIGH']),
        (f'Max > {temp_thresholds["MAX_MODERATE"]}°C', temp_thresholds['MAX_MODERATE'])
    ]:
        monthly_lost_days[threshold_name] = monthly_groups.apply(
            lambda x: (x['tmax'] > threshold_value).sum()
        )
    
    for threshold_name, threshold_value in [
        (f'Min < {temp_thresholds["MIN_COLD"]}°C', temp_thresholds['MIN_COLD']),
        (f'Min < {temp_thresholds["MIN_VERY_COLD"]}°C', temp_thresholds['MIN_VERY_COLD']),
        (f'Min < {temp_thresholds["MIN_FREEZING"]}°C', temp_thresholds['MIN_FREEZING']),
        (f'Min < {temp_thresholds["MIN_EXTREME_COLD"]}°C', temp_thresholds['MIN_EXTREME_COLD'])
    ]:
        monthly_lost_days[threshold_name] = monthly_groups.apply(
            lambda x: (x['tmin'] < threshold_value).sum()
        )

    for threshold_name, threshold_value in [
        (f'Rain > {precip_thresholds["HEAVY_RAIN"]}mm', precip_thresholds['HEAVY_RAIN']),
        (f'Rain > {precip_thresholds["VERY_HEAVY_RAIN"]}mm', precip_thresholds['VERY_HEAVY_RAIN'])
    ]:
        monthly_lost_days[threshold_name] = monthly_groups.apply(
            lambda x: (x['prcp'] > threshold_value).sum()
        )

    if 'wspd' in weather_data.columns:
        for threshold_name, threshold_value in [
            (f'Wind > {wind_thresholds["MODERATE"]} m/s', wind_thresholds['MODERATE']),
            (f'Wind > {wind_thresholds["HIGH"]} m/s', wind_thresholds['HIGH']),
            (f'Wind > {wind_thresholds["VERY_HIGH"]} m/s', wind_thresholds['VERY_HIGH'])
        ]:
            monthly_lost_days[threshold_name] = monthly_groups.apply(
                lambda x: (x['wspd'] > threshold_value).sum()
            )
    else:
        for threshold_name in [
            f'Wind > {wind_thresholds["MODERATE"]} m/s',
            f'Wind > {wind_thresholds["HIGH"]} m/s',
            f'Wind > {wind_thresholds["VERY_HIGH"]} m/s'
        ]:
            monthly_lost_days[threshold_name] = 0

    monthly_lost_days = monthly_lost_days.fillna(0) / total_years

    monthly_lost_days.index = monthly_lost_days.index.map(MONTH_MAPPING)

    return monthly_lost_days

def analyze_weather_data(weather_data, location_name, script_dir, lat, lon):
    weather_data['month'] = weather_data.index.month
    weather_data['year'] = weather_data.index.year
    
    precip_thresholds = WEATHER_THRESHOLDS['PRECIPITATION']
    wind_thresholds = WEATHER_THRESHOLDS['WIND']

    monthly_groups = weather_data.groupby('month')
    total_years = weather_data['year'].nunique()
    
    rain_over_5mm = monthly_groups.apply(lambda x: (x['prcp'] > precip_thresholds['LIGHT_RAIN']).sum()) / total_years
    rain_over_10mm = monthly_groups.apply(lambda x: (x['prcp'] > precip_thresholds['MODERATE_RAIN']).sum()) / total_years
    
    if 'wspd' in weather_data.columns:
        wind_over_40km = monthly_groups.apply(lambda x: (x['wspd'] > wind_thresholds['EXTREME_KMH']).sum()) / total_years
    else:
        wind_over_40km = pd.Series(0, index=rain_over_5mm.index)

    summary = pd.DataFrame({
        f'Rain > {precip_thresholds["LIGHT_RAIN"]}mm Days (Avg)': rain_over_5mm,
        f'Rain > {precip_thresholds["MODERATE_RAIN"]}mm Days (Avg)': rain_over_10mm,
        f'Wind > {wind_thresholds["EXTREME_KMH"]}km/h Days (Avg)': wind_over_40km
    }).fillna(0)

    summary.index = summary.index.map(MONTH_MAPPING)

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
        if len(weather_data) > 1000:
            sample_data = weather_data.iloc[::max(1, len(weather_data)//500)]
        else:
            sample_data = weather_data
        plt.plot(sample_data.index, sample_data['tavg'], label="Avg Temp (°C)", color='blue', linewidth=0.8)
        plt.title(f"Temperature Trends - {location_name}")
        plt.xlabel("Date")
        plt.ylabel("Temperature (°C)")
        plt.legend()
        plt.tight_layout()
        pdf.savefig(dpi=100)
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
            plt.tight_layout()
            pdf.savefig(dpi=100)
            plt.close()

        plt.figure(figsize=(14, 8))
        monthly_lost_days.plot(kind='bar', figsize=(14, 8))
        plt.title(f"Lost Days Summary (Monthly Averages) - {location_name}")
        plt.ylabel("Average Number of Days")
        plt.xlabel("Month")
        plt.xticks(rotation=45)
        plt.legend(title="Thresholds", bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        pdf.savefig(dpi=100)
        plt.close()

        plt.figure(figsize=(10, 4))
        plt.text(0.5, 0.7, f"Weather Station Location", fontsize=16, fontweight='bold', ha='center')
        plt.text(0.5, 0.5, f"Location: {location_name}", fontsize=12, ha='center')
        plt.text(0.5, 0.3, f"Coordinates: {lat:.4f}°N, {lon:.4f}°E", fontsize=12, ha='center')
        plt.text(0.5, 0.1, f"Data processed: {len(weather_data)} days", fontsize=10, ha='center', style='italic')
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.axis('off')
        plt.title("Location Summary")
        plt.tight_layout()
        pdf.savefig(dpi=100)
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
        return jsonify({"error": ERROR_MESSAGES['VALIDATION']['MISSING_PARAMETERS']}), 400

    try:
        start_date = validate_date(start_date_input)
        end_date = validate_date(end_date_input)
        
        date_diff = (end_date - start_date).days
        if date_diff > PERFORMANCE_CONFIG['MAX_PROCESSING_DAYS']:
            return jsonify({
                "error": f"Date range too large. Maximum allowed is {PERFORMANCE_CONFIG['MAX_PROCESSING_DAYS']} days ({PERFORMANCE_CONFIG['MAX_PROCESSING_DAYS']/365:.1f} years)."
            }), 400
        
        if date_diff <= 0:
            return jsonify({"error": "End date must be after start date."}), 400
            
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        lat, lon = get_coordinates(location_name)
        station_id = get_nearest_station(lat, lon)
        weather_data = fetch_weather_data(station_id, start_date, end_date)
        
        excel_buffer, pdf_buffer = analyze_weather_data(weather_data, location_name, script_dir, lat, lon)

        excel_id = file_storage.store(excel_buffer.getvalue(), 'excel', location_name)
        pdf_id = file_storage.store(pdf_buffer.getvalue(), 'pdf', location_name)

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
        return jsonify({"error": ERROR_MESSAGES['VALIDATION']['MISSING_COORDINATES']}), 400
        
    try:
        geolocator = Nominatim(user_agent=API_CONFIG['USER_AGENT'])
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
        return jsonify({"error": ERROR_MESSAGES['VALIDATION']['MISSING_SEARCH_QUERY']}), 400
        
    try:
        geolocator = Nominatim(user_agent=API_CONFIG['USER_AGENT'])
        locations = geolocator.geocode(query, exactly_one=False, limit=API_CONFIG['GEOCODE_RESULT_LIMIT'])
        
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

@app.route('/api/current-weather', methods=['GET'])
def current_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not all([lat, lon]):
        return jsonify({"error": ERROR_MESSAGES['VALIDATION']['MISSING_COORDINATES']}), 400
        
    try:
        station = get_nearest_station(float(lat), float(lon))
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=API_CONFIG['HOURLY_DATA_WINDOW_HOURS'])
        
        data = Hourly(station, start=start_time, end=end_time)
        data = data.fetch()
        
        if data.empty:
            return jsonify({"error": "No weather data available"}), 404
            
        latest_data = data.iloc[-1]
        weather_info = {
            "temp": round(float(latest_data.get('temp', DEFAULTS['TEMPERATURE'])), 1),
            "humidity": round(float(latest_data.get('rhum', DEFAULTS['HUMIDITY'])), 1),
            "precipitation": round(float(latest_data.get('prcp', DEFAULTS['PRECIPITATION'])), 1),
            "wind_speed": round(float(latest_data.get('wspd', DEFAULTS['WIND_SPEED'])), 1),
            "time": latest_data.name.isoformat()
        }
        
        return jsonify(weather_info)
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download/<path:filename>')
def download_file(filename):
    try:
        file_id = filename.rsplit('.', 1)[0]
        
        if filename.endswith(FILE_CONFIG['EXCEL_EXTENSION']):
            buffer_data, metadata = file_storage.get(file_id)
            mimetype = FILE_CONFIG['MIME_TYPES']['EXCEL']
            file_suffix = "_weather_analysis.xlsx"
        elif filename.endswith(FILE_CONFIG['PDF_EXTENSION']):
            buffer_data, metadata = file_storage.get(file_id)
            mimetype = FILE_CONFIG['MIME_TYPES']['PDF']
            file_suffix = "_weather_report.pdf"
        else:
            return jsonify({"error": ERROR_MESSAGES['FILES']['INVALID_FILE_TYPE']}), 400

        if buffer_data is None:
            return jsonify({"error": ERROR_MESSAGES['FILES']['NOT_FOUND_OR_EXPIRED']}), 404

        if metadata and metadata.get('location_name'):
            location_clean = metadata['location_name'].replace(' ', '_').replace(',', '').replace('.', '')
            download_filename = f"{location_clean}{file_suffix}"
        else:
            download_filename = f"{filename.split('.')[0]}_{datetime.now().strftime(FILE_CONFIG['DATE_FORMAT_SUFFIX'])}.{filename.split('.')[1]}"

        return send_file(
            io.BytesIO(buffer_data),
            mimetype=mimetype,
            as_attachment=True,
            download_name=download_filename
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=APP_METADATA['DEBUG'])