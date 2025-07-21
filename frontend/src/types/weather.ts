export interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

export interface WeatherData {
  location: string;
  startDate: string;
  endDate: string;
}

export interface ErrorResponse {
  message: string;
}

export interface WeatherResponse {
  message: string;
  excel_report: string;
  pdf_report: string;
}

export interface WeatherInfo {
  temp: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  time: string;
}
