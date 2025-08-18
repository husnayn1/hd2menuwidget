import React, { useState, useEffect } from 'react';
import { getWeatherData } from './services/weatherService';

const WeatherPreview = ({ formData, onClose }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!formData.forecastLocation) {
        setError('Please enter a location');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Using our weather service with real-time dates
        const data = await getWeatherData(formData.forecastLocation, formData.units);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [formData.forecastLocation, formData.units]);

  const getTemperatureUnit = () => {
    return formData.units === 'Celsius' ? '°C' : '°F';
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  // Get real-time day abbreviation using custom labels
  const getDayAbbreviation = (dayName) => {
    const dayMap = {
      'Sunday': formData.customLabels?.sun || 'Sun',
      'Monday': formData.customLabels?.mon || 'Mon',
      'Tuesday': formData.customLabels?.tue || 'Tue',
      'Wednesday': formData.customLabels?.wed || 'Wed',
      'Thursday': formData.customLabels?.thu || 'Thu',
      'Friday': formData.customLabels?.fri || 'Fri',
      'Saturday': formData.customLabels?.sat || 'Sat'
    };
    return dayMap[dayName] || dayName;
  };

  if (loading) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 40,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 18, marginBottom: 10 }}>Loading weather data...</div>
          <div style={{ fontSize: 14, color: '#666' }}>Fetching weather for {formData.forecastLocation}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: 40,
          textAlign: 'center',
          maxWidth: 400
        }}>
          <div style={{ fontSize: 18, marginBottom: 10, color: '#d32f2f' }}>Error</div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>{error}</div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100
    }}>
      <div style={{
        background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Preview Header - Transparent */}
        <div style={{
          padding: '20px 30px',
          borderBottom: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          background: 'white'
        }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Preview: {formData.appName || 'Modern Weather Forecast'}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Weather Widget Preview - Full Screen */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          background: 'transparent'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: 0,
            overflow: 'hidden',
            boxShadow: 'none',
            background: formData.backgroundImage ? `url(${formData.backgroundImage})` : (formData.backgroundColor || 'linear-gradient(135deg, #1976d2, #42a5f5)'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
          }}>
            {/* Top Section - Current Weather */}
            <div style={{
              height: '60%',
              background: formData.topSectionColor ? `linear-gradient(135deg, ${formData.topSectionColor}, ${formData.topSectionColor}dd)` : 'linear-gradient(135deg, #ffeb3b, #ffc107)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 30px',
              position: 'relative'
            }}>
              <div style={{ fontSize: 48, color: 'white' }}>
                {getWeatherIcon(weatherData.current.condition)}
              </div>
              <div style={{ textAlign: 'right', color: 'white' }}>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  fontFamily: formData.textFont || 'Arial, sans-serif',
                  color: formData.textColor || 'white'
                }}>
                  {weatherData.location}
                </div>
                <div style={{ 
                  fontSize: 20, 
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontFamily: formData.textFont || 'Arial, sans-serif',
                  color: formData.textColor || 'white'
                }}>
                  {formData.customLabels?.now?.toUpperCase() || 'TODAY'}
                </div>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontFamily: formData.textFont || 'Arial, sans-serif',
                  color: formData.textColor || 'white'
                }}>
                  {weatherData.current.temp}°{formData.units === 'Celsius' ? 'C' : 'F'}
                </div>
              </div>
            </div>

            {/* Bottom Section - Forecast */}
            <div style={{
              height: '40%',
              background: formData.bottomSectionColor ? `linear-gradient(135deg, ${formData.bottomSectionColor}, ${formData.bottomSectionColor}dd)` : 'linear-gradient(135deg, #87ceeb, #4fc3f7)',
              padding: '15px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {weatherData.forecast.map((day, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  color: 'white',
                  flex: 1
                }}>
                  <div style={{ 
                    fontSize: 24, 
                    marginBottom: 5,
                    fontFamily: formData.textFont || 'Arial, sans-serif',
                    color: formData.textColor || 'white'
                  }}>
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontFamily: formData.textFont || 'Arial, sans-serif',
                    color: formData.textColor || 'white',
                    marginBottom: 8,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {getDayAbbreviation(day.day)}
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontFamily: formData.textFont || 'Arial, sans-serif',
                    color: formData.textColor || 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {day.high}°/{day.low}°{formData.units === 'Celsius' ? 'C' : 'F'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Footer - Transparent */}
        <div style={{
          padding: '0px 30px',
          borderTop: 'none',
          textAlign: 'center',
          flexShrink: 0,
          background: 'white'
        }}>
          <div style={{ fontSize: 14, color: 'white', marginBottom: 10, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Location: {weatherData.location}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherPreview; 