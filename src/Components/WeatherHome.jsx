import React, { useState, useEffect } from 'react';
import './WeatherHome.css'; 

const WeatherHome = () => {
  const [countries, setCountries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryNames = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  // Fetch locations for selected country (mock data for demonstration)
  const fetchLocations = async (country) => {
    const mockLocations = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
      'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow'],
      'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
    };

    setLocations(mockLocations[country] || []);
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    fetchLocations(country);
    setSelectedLocation('');
    setWeatherData(null);
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    if (!apiKey || !selectedLocation || !selectedCountry) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${selectedLocation},${selectedCountry}&appid=${apiKey}&units=metric`;

      const response = await fetch(weatherApi);
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Error fetching weather data');
      console.error(err);
    }
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather App</h1>

      <input
        type="text"
        placeholder="Enter OpenWeatherMap API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="api-key-input"
      />

      <div className="select-container">
        <select 
          value={selectedCountry} 
          onChange={handleCountryChange}
          className="select-input"
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select 
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          disabled={!selectedCountry}
          className="select-input"
        >
          <option value="">Select Location</option>
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <button 
          onClick={fetchWeatherData}
          disabled={!apiKey || !selectedLocation || !selectedCountry}
          className="weather-button"
        >
          Get Weather
        </button>
      </div>


      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <div className="weather-result">
          <h2 className="weather-location">
            {weatherData.name}, {selectedCountry}
          </h2>
          <div className="weather-details">
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feels Like: {weatherData.main.feels_like}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Description: {weatherData.weather[0].description}</p>
          </div>
        </div>
      )}


    </div>
  );
};

export default WeatherHome;