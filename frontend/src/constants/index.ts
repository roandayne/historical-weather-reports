export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  FILE_DOWNLOAD_TIMEOUT: 60000,
  GEOCODING_TIMEOUT: 60000,

  BASE_URL: '/api',
  BACKEND_URL: 'http://backend:5000',

  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/api/current-weather',
  WEATHER_DATA: '/api/weather-data',
  REVERSE_GEOCODE: '/api/reverse-geocode',
  GEOCODE: '/api/geocode',
  DOWNLOAD: '/api/download',
} as const;

export const PORTS = {
  FRONTEND: 8080,
  BACKEND: 5000,
} as const;

export const UI_CONFIG = {
  SEARCH_DEBOUNCE_DELAY: 300,

  MIN_SEARCH_LENGTH: 3,

  ALERT_AUTO_HIDE_DURATION: 6000,

  SEARCH_STALE_TIME: 60 * 1000,
  SEARCH_GC_TIME: 2 * 60 * 1000,
  WEATHER_STALE_TIME: 5 * 60 * 1000,
  WEATHER_GC_TIME: 10 * 60 * 1000,

  DEFAULT_RETRY_COUNT: 1,
  GEOCODING_RETRY_COUNT: 2,

  GEOCODE_RESULT_LIMIT: 5,
} as const;

export const FILE_CONFIG = {
  FILE_EXPIRY_TIME: 5 * 60 * 1000,
  FILE_EXPIRY_SECONDS: 300,

  SUPPORTED_FILE_TYPES: {
    EXCEL: '.xlsx',
    PDF: '.pdf',
  },

  MIME_TYPES: {
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PDF: 'application/pdf',
  },
} as const;

export const DATE_CONFIG = {
  BACKEND_DATE_FORMAT: 'DD-MM-YYYY',
  ISO_DATE_FORMAT: 'YYYY-MM-DD',

  DATE_REGEX: /^\d{2}-\d{2}-\d{4}$/,
} as const;

export const WEATHER_THRESHOLDS = {
  TEMPERATURE: {
    MAX_HIGH: 44, // °C
    MAX_MODERATE: 35, // °C
    MIN_COLD: 20, // °C
    MIN_VERY_COLD: 15, // °C
    MIN_FREEZING: 10, // °C
    MIN_EXTREME_COLD: 5, // °C
  },
  PRECIPITATION: {
    LIGHT_RAIN: 5, // mm
    MODERATE_RAIN: 10, // mm
    HEAVY_RAIN: 25, // mm
    VERY_HEAVY_RAIN: 50, // mm
  },
  WIND: {
    MODERATE: 10, // m/s
    HIGH: 15, // m/s
    VERY_HIGH: 20, // m/s
    EXTREME: 40, // km/h
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: {
    TIMEOUT: 'Request timed out. Please try again.',
    NO_RESPONSE: 'No response from server. Please try again.',
    CONNECTION_ERROR:
      'Connection error. Please check your internet connection.',
  },
  VALIDATION: {
    MISSING_LOCATION: 'Please select a location and date range',
    INVALID_DATE: 'Incorrect date format. Please use DD-MM-YYYY.',
    LOCATION_NOT_FOUND:
      'Location not found. Please check the spelling or try a more specific name.',
    NO_WEATHER_STATIONS:
      'No weather stations found nearby. Try a different location.',
    NO_WEATHER_DATA: 'No weather data available for the specified date range.',
  },
  GEOCODING: {
    TIMEOUT: 'Location search timed out. Please try again or use a simpler search term.',
    REVERSE_TIMEOUT: 'Location lookup timed out. Please try again.',
    SERVICE_UNAVAILABLE: 'Location service is temporarily unavailable. Please try again later.',
  },
  GEOLOCATION: {
    NOT_SUPPORTED: 'Geolocation is not supported by this browser.',
    PERMISSION_DENIED:
      'Location access denied. Please enable location services.',
    POSITION_UNAVAILABLE: 'Location information is unavailable.',
    TIMEOUT: 'Location request timed out.',
  },
  FILE: {
    DOWNLOAD_FAILED: 'Failed to download file. Please try again.',
    FILE_NOT_FOUND: 'File not found or expired',
    INVALID_FILE_TYPE: 'Invalid file type',
  },
} as const;

export const SUCCESS_MESSAGES = {
  REPORT_GENERATED: 'Reports generated and downloaded successfully!',
  LOCATION_UPDATED: 'Location updated successfully',
} as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const APP_CONFIG = {
  NAME: 'Weather History',
  USER_AGENT: 'weather_data_extractor',
  VERSION: '1.0.0',
} as const;
