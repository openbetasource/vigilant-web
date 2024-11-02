const API_KEY = 'c37780aa79fc8fdd2a07b49e7dd483ac'; // You'll need to get an API key from OpenWeatherMap
const searchInput = document.querySelector('.location-search input');
const searchButton = document.querySelector('.location-search button');
const weatherDisplay = document.querySelector('.weather-display');

// Weather icons mapping
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️'
};

// Format temperature
const formatTemp = temp => `${Math.round(temp)}°C`;

// Get weather data
async function getWeatherData(city) {
    try {
        // Encode the city name to handle Swedish characters
        const encodedCity = encodeURIComponent(city);
        
        // Get coordinates first
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity},SE&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.length) throw new Error('Plats hittades inte');

        const { lat, lon } = geoData[0];

        // Get current weather and forecast
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&lang=sv&appid=${API_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        updateWeatherDisplay(weatherData, geoData[0].local_names?.sv || geoData[0].name);
    } catch (error) {
        console.error('Error:', error);
        showError('Kunde inte hämta väderdata. Försök igen.');
    }
}

// Update weather display
function updateWeatherDisplay(data, cityName) {
    const current = data.current;
    const daily = data.daily;

    // Update current weather
    document.querySelector('.temperature').textContent = formatTemp(current.temp);
    document.querySelector('.weather-icon').textContent = weatherIcons[current.weather[0].main] || '⛅';
    document.querySelector('.weather-desc').textContent = current.weather[0].description;
    document.querySelector('.location').textContent = `${cityName}, Sverige`;

    // Update weather details
    document.querySelector('.detail-item:nth-child(1) .value').textContent = `${current.humidity}%`;
    document.querySelector('.detail-item:nth-child(2) .value').textContent = `${Math.round(current.wind_speed)} m/s`;
    document.querySelector('.detail-item:nth-child(3) .value').textContent = `${current.pressure} hPa`;

    // Update forecast
    const forecastItems = document.querySelectorAll('.forecast-item');
    daily.slice(1, 6).forEach((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = new Intl.DateTimeFormat('sv-SE', { weekday: 'short' }).format(date);
        
        forecastItems[index].querySelector('.day').textContent = dayName;
        forecastItems[index].querySelector('.icon').textContent = weatherIcons[day.weather[0].main] || '⛅';
        forecastItems[index].querySelector('.temp').textContent = formatTemp(day.temp.day);
    });

    // Add animation
    weatherDisplay.style.opacity = '0';
    setTimeout(() => {
        weatherDisplay.style.opacity = '1';
    }, 100);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    weatherDisplay.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Event listeners
searchButton.addEventListener('click', () => {
    getWeatherData(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData(searchInput.value);
    }
});

// Initial load with default city
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData('Stockholm');
}); 