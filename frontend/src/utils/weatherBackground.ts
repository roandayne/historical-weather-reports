export const getWeatherBackground = (temp: number) => {
  const defaultBg = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80';
  
  if (temp <= 0) {
    return 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&q=80';
  } else if (temp <= 10) {
    return 'https://images.unsplash.com/photo-1485249245068-d8dc50b77cc7?auto=format&fit=crop&q=80';
  } else if (temp <= 20) {
    return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80';
  } else if (temp <= 30) {
    return defaultBg;
  } else {
    return 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&q=80';
  }
}; 