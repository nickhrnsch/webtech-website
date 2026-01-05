import { weatherCodes } from "./constants";

export function getWeatherDescription(code) {
  return weatherCodes[code] || "Unbekannt";
}

export async function fetchWeather(location) {
  if (!location || location.trim() === "") {
    throw new Error("Kein Ort angegeben");
  }

  try {
    // 1. Geocoding: Ort zu Koordinaten
    console.log("Suche Koordinaten für:", location);
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=de&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    console.log("Geocoding-Antwort:", geoData);

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Ort "${location}" nicht gefunden`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    console.log(`Gefunden: ${name}, ${country} (${latitude}, ${longitude})`);

    // 2. Wetterdaten abrufen
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    
    console.log("Wetter-Antwort:", weatherData);

    if (!weatherResponse.ok) {
      throw new Error("Fehler beim Abrufen der Wetterdaten");
    }

    const current = weatherData.current;
    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: getWeatherDescription(current.weather_code),
      weatherCode: current.weather_code,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      locationName: `${name}, ${country}`,
    };
  } catch (error) {
    console.error("Wetter-API Fehler:", error);
    throw error;
  }
}
