# Historical Weather Data

A web application for generating comprehensive historical weather reports and analyzing weather patterns for any location worldwide. The application provides detailed weather analysis, current conditions, and exports data in both Excel and PDF formats.

## Features

### Historical Weather Analysis
- **10-year historical data** support (up to 3,650 days)
- **Comprehensive weather metrics**: temperature, precipitation, humidity, wind speed
- **Weather threshold analysis**: extreme temperatures, heavy rainfall, high winds
- **"Lost Days" calculations** based on weather conditions unsuitable for outdoor activities
- **Monthly summaries** with averages and trends

### Real-time Weather Data
- **Current weather conditions** for selected locations
- **Automatic location detection** via GPS
- **Location search** with autocomplete functionality

### Report Generation
- **Excel reports** with raw data, monthly summaries, and lost days analysis
- **PDF reports** with interactive charts and visualizations
- **Downloadable files** with automatic cleanup after 5 minutes
- **Data visualization** including temperature trends and threshold comparisons

### User Experience
- **Modern Material-UI interface** with responsive design
- **Dynamic weather backgrounds** based on current conditions
- **Smart location search** with geocoding support
- **Date range validation** and error handling

## Project Structure

```
.
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Main application pages
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API client services
│   │   ├── types/      # TypeScript type definitions
│   │   ├── styles/     # Styled components and themes
│   │   └── utils/      # Utility functions
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/            # Flask + Python backend
│   ├── app.py         # Main Flask application
│   ├── constants.py   # Configuration and constants
│   ├── utils.py       # Utility functions
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Technologies Used

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library with icons and date pickers
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client for API calls
- **Day.js** - Date manipulation library
- **Styled Components** - CSS-in-JS styling

### Backend
- **Flask** - Python web framework with CORS support
- **Meteostat** - Historical weather data API
- **Pandas** - Data analysis and manipulation
- **Matplotlib** - Chart generation for PDF reports
- **Geopy** - Geocoding and location services
- **XlsxWriter & OpenPyXL** - Excel file generation
- **FPDF** - PDF report creation

## Getting Started

### Prerequisites
- **Docker & Docker Compose** (recommended)
- **Node.js 18+** and **npm** (for local development)
- **Python 3.8+** and **pip** (for local development)

### Quick Start with Docker

1. **Clone the repository:**
```bash
git clone git@github.com:roandayne/historical-weather-reports.git
cd historical-weather-data
```
or
```bash
git clone https://github.com/roandayne/historical-weather-reports.git
cd historical-weather-reports
```

2. **Start the application:**
```bash
docker compose build
docker compose up
```

This will:
- Start the React frontend on http://localhost:8080
- Start the Flask backend on http://localhost:5000
- Set up hot-reloading for both services
- Handle all dependencies automatically

### Alternative: Local Development Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5000 --debug
```

## How to Use

1. **Select Location**: Use the search box to find a location or click "Use My Location"
2. **Choose Date Range**: Select start and end dates (up to 10 years of data)
3. **Generate Report**: Click "Generate Report" to create Excel and PDF files
4. **Download Files**: Reports will automatically download when ready
5. **View Current Weather**: Real-time weather data displays for selected locations

### Weather Thresholds Analyzed

- **Temperature Extremes**: Days above 44°C, 35°C or below 20°C, 15°C, 10°C, 5°C
- **Precipitation**: Days with rain >5mm, >10mm, >25mm, >50mm
- **Wind Conditions**: Days with wind speeds >40km/h
- **Lost Days**: Days unsuitable for outdoor activities based on weather conditions

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/weather-data` | POST | Generate historical weather reports |
| `/api/current-weather` | GET | Get current weather conditions |
| `/api/geocode` | GET | Search for locations by name |
| `/api/reverse-geocode` | GET | Get location name from coordinates |
| `/api/download/<filename>` | GET | Download generated report files |

### Example API Usage

**Generate Weather Report:**
```bash
curl -X POST http://localhost:5000/api/weather-data \
  -H "Content-Type: application/json" \
  -d '{
    "location": "London, UK",
    "start_date": "01-01-2020",
    "end_date": "31-12-2023"
  }'
```

**Get Current Weather:**
```bash
curl "http://localhost:5000/api/current-weather?lat=51.5074&lon=-0.1278"
```

## Docker Configuration

### Frontend Container
- **Development build** with Vite dev server
- **Volume mounting** for live code updates
- **Node modules persistence** for faster rebuilds
- **Port 8080** exposed for web access

### Backend Container
- **Flask development server** with debug mode
- **Python code volume mounting** for hot-reloading
- **Port 5000** exposed for API access
- **Automatic dependency installation**

## Development Features

### Frontend Development
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality
- **Hot Module Replacement** for instant updates
- **React Query DevTools** for debugging API calls

### Backend Development
- **Flask debug mode** with detailed error messages
- **Auto-reloading** on code changes
- **CORS enabled** for cross-origin requests
- **File cleanup** system for temporary reports

## Performance Optimizations

- **Data sampling** for large datasets (>1000 points) in visualizations
- **File expiry system** (5-minute cleanup) to manage storage
- **Request validation** and error handling
- **Efficient data processing** with pandas vectorization
- **Memory management** for large weather datasets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Data Sources

- **Meteostat**: Historical weather data from meteorological stations worldwide
- **Nominatim (OpenStreetMap)**: Geocoding and location search services

---

**Note**: Weather data availability depends on meteorological station coverage in your selected location. Some remote areas may have limited historical data. 
