# API Configuration
API_CONFIG = {
    'USER_AGENT': 'weather_data_extractor',
    'FILE_EXPIRY_MINUTES': 5,
    'FILE_EXPIRY_SECONDS': 300,
    'GEOCODE_RESULT_LIMIT': 5,
    'HOURLY_DATA_WINDOW_HOURS': 1
}

# Date Format Configuration
DATE_FORMATS = {
    'INPUT_FORMAT': '%d-%m-%Y',
    'DISPLAY_FORMAT': '%Y-%m-%d'
}

# Weather Thresholds for Analysis
WEATHER_THRESHOLDS = {
    'TEMPERATURE': {
        'MAX_HIGH': 44,           # °C
        'MAX_MODERATE': 35,       # °C
        'MIN_COLD': 20,          # °C
        'MIN_VERY_COLD': 15,     # °C
        'MIN_FREEZING': 10,      # °C
        'MIN_EXTREME_COLD': 5    # °C
    },
    'PRECIPITATION': {
        'LIGHT_RAIN': 5,         # mm
        'MODERATE_RAIN': 10,     # mm
        'HEAVY_RAIN': 25,        # mm
        'VERY_HEAVY_RAIN': 50    # mm
    },
    'WIND': {
        'MODERATE': 10,          # m/s
        'HIGH': 15,              # m/s
        'VERY_HIGH': 20,         # m/s
        'EXTREME_KMH': 40        # km/h (for different analysis)
    }
}

# File Configuration
FILE_CONFIG = {
    'EXCEL_EXTENSION': '.xlsx',
    'PDF_EXTENSION': '.pdf',
    'MIME_TYPES': {
        'EXCEL': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'PDF': 'application/pdf'
    },
    'DATE_FORMAT_SUFFIX': '%Y%m%d'
}

# Error Messages
ERROR_MESSAGES = {
    'VALIDATION': {
        'MISSING_PARAMETERS': 'Missing required parameters',
        'INVALID_DATE_FORMAT': 'Incorrect date format. Please use DD-MM-YYYY.',
        'LOCATION_NOT_FOUND': 'Location \'{}\' not found. Please check the spelling or try a more specific name.',
        'NO_WEATHER_STATIONS': 'No weather stations found nearby. Try a different location.',
        'NO_WEATHER_DATA': 'No weather data available for the specified date range.',
        'MISSING_COORDINATES': 'Missing latitude or longitude',
        'MISSING_SEARCH_QUERY': 'Missing search query'
    },
    'FILES': {
        'NOT_FOUND_OR_EXPIRED': 'File not found or expired',
        'INVALID_FILE_TYPE': 'Invalid file type'
    }
}

# Month Names
MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

# Month Mapping (1-based index to name)
MONTH_MAPPING = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

# Application Metadata
APP_METADATA = {
    'NAME': 'Weather History API',
    'VERSION': '1.0.0',
    'DEBUG': True
}

# Default Values
DEFAULTS = {
    'WIND_SPEED': 0,
    'TEMPERATURE': 0,
    'HUMIDITY': 0,
    'PRECIPITATION': 0
} 