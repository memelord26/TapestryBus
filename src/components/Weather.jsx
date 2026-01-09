import React, { useState, useEffect} from "react";

function Weather() {
    const [temperature, setTemperature] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = () => {
            //temperature API
            fetch('https://api.data.gov.sg/v1/environment/air-temperature')
                .then(res => res.json())
                .then(data => {
                    console.log('temperature data:', data);
                    if (data.items && data.items[0] && data.items[0].readings) {
                        const readings = data.items[0].readings;
                        const avgTemp = (readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length).toFixed(1);
                        setTemperature(avgTemp);
                    }
                })
                .catch(err => console.error('Error fetching temperature data:', err));
            
            //2-hr forecast API
            fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
                .then(res => res.json())
                .then(data => {
                    console.log('forecast data:', data);
                    if (data.items && data.items[0] && data.items[0].forecasts) {
                        const forecasts = data.items[0].forecasts;
                        const tampinesForecast = forecasts.find(f => f.area === 'Tampines');
                        setForecast(tampinesForecast ? tampinesForecast.forecast : forecasts[0].forecast);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching forecast data:', err);
                    setLoading(false);
                });
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 5 * 60 * 1000); // Refresh every 10 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="content">
                <h1>Weather (Tampines)</h1>
                <h3>{temperature ? `${temperature}°C` : 'Loading...'} - {forecast || 'Loading...'}</h3>
            </div>
        </>
    );
}

export default Weather;