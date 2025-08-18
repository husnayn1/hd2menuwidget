// Mock weather service for preview functionality with real-time dates
export const getWeatherData = async (location, units = 'Fahrenheit') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get real-time dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  // Function to get day name
  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };
  
  // Mock weather data with real-time dates
  const mockData = {
    location: location || 'New York',
    country: '', // Remove country code
    current: {
      temp: units === 'Celsius' ? 25 : 77,
      condition: 'Clear'
    },
    forecast: [
      {
        day: getDayName(today),
        high: units === 'Celsius' ? 28 : 82,
        low: units === 'Celsius' ? 22 : 72,
        condition: 'Clear'
      },
      {
        day: getDayName(tomorrow),
        high: units === 'Celsius' ? 26 : 79,
        low: units === 'Celsius' ? 20 : 68,
        condition: 'Clouds'
      },
      {
        day: getDayName(dayAfterTomorrow),
        high: units === 'Celsius' ? 24 : 75,
        low: units === 'Celsius' ? 18 : 64,
        condition: 'Rain'
      }
    ]
  };
  
  return mockData;
}; 