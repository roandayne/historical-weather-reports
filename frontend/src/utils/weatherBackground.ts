import type { WeatherInfo } from '../types/weather';

export const getWeatherBackground = (weather: WeatherInfo) => {
  const backgrounds = {
    snow: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&q=80',
    rainy:
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80',
    cloudy:
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80',
    partlyCloudy:
      'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80',
    sunny:
      'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&q=80',
    misty:
      'https://images.unsplash.com/photo-1485249245068-d8dc50b77cc7?auto=format&fit=crop&q=80',
  };

  const { temp, precipitation, humidity } = weather;

  if (precipitation > 0) {
    if (temp <= 0) {
      return backgrounds.snow;
    }
    return backgrounds.rainy;
  }

  if (humidity > 90) {
    return backgrounds.misty;
  }

  if (temp <= 0) {
    return backgrounds.snow;
  } else if (temp <= 10) {
    return humidity > 70 ? backgrounds.cloudy : backgrounds.partlyCloudy;
  } else if (temp <= 20) {
    return humidity > 60 ? backgrounds.cloudy : backgrounds.partlyCloudy;
  } else if (temp <= 30) {
    return humidity > 50 ? backgrounds.partlyCloudy : backgrounds.sunny;
  } else {
    return backgrounds.sunny;
  }
};
