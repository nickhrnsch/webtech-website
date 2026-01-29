/**
 * Open-Meteo Historical Weather API (archive-api.open-meteo.com).
 * Geocoding via geocoding-api.open-meteo.com.
 */

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

const DEFAULT_YEARS = [2022, 2023, 2024];

const WEATHER_CODE_LABELS = {
  0: "Klar",
  1: "Überwiegend klar",
  2: "Teilweise bewölkt",
  3: "Bewölkt",
  45: "Neblig",
  48: "Neblig",
  51: "Leichter Nieselregen",
  53: "Nieselregen",
  55: "Starker Nieselregen",
  61: "Leichter Regen",
  63: "Regen",
  65: "Starker Regen",
  71: "Leichter Schneefall",
  73: "Schneefall",
  75: "Starker Schneefall",
  77: "Schneegriesel",
  80: "Leichte Regenschauer",
  81: "Regenschauer",
  82: "Starke Regenschauer",
  85: "Leichte Schneeschauer",
  86: "Schneeschauer",
  95: "Gewitter",
  96: "Gewitter mit Hagel",
  99: "Gewitter mit Hagel",
};

function weatherCodeLabel(code) {
  if (code == null) return "–";
  return WEATHER_CODE_LABELS[code] ?? `Code ${code}`;
}

/**
 * @param {string} name - Ort (z.B. "Berlin", "Mallorca")
 * @returns {Promise<{ lat: number, lon: number, name: string, country: string }>}
 */
export async function geocode(name) {
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=de&format=json`
  );
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Ort "${name}" nicht gefunden`);
  }
  const r = data.results[0];
  return {
    lat: r.latitude,
    lon: r.longitude,
    name: r.name,
    country: r.country ?? "",
  };
}

/**
 * @param {number} lat
 * @param {number} lon
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Promise<{ time: string[], temperature_2m_max: number[], temperature_2m_min: number[], precipitation_sum: number[], weather_code: number[] }>}
 */
export async function fetchArchive(lat, lon, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
    timezone: "auto",
  });
  const res = await fetch(`${ARCHIVE_URL}?${params}`);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Fehler beim Abruf der historischen Wetterdaten");
  }
  const data = await res.json();
  return data.daily || {};
}

function lastDayOfFebruary(year) {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
}

function toYearDate(year, month, day) {
  if (month === 2 && day === 29 && lastDayOfFebruary(year) !== 29) {
    day = 28;
  }
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Gleichen Zeitraum (Monat/Tag) in mehreren Jahren abfragen und aggregieren.
 *
 * @param {string} location - Ort (z.B. "Berlin")
 * @param {string} startDate - YYYY-MM-DD (Jahr kann beliebig sein)
 * @param {string} endDate - YYYY-MM-DD
 * @param {number[]} years - z.B. [2022, 2023, 2024]
 * @returns {Promise<{ locationName: string, avgMaxTemp: number, avgMinTemp: number, avgPrecip: number, typicalWeatherCode: number, typicalWeatherLabel: string, yearsUsed: number[] }>}
 */
export async function getHistoricalForLocation(
  location,
  startDate,
  endDate,
  years = DEFAULT_YEARS
) {
  const loc = await geocode(location);
  const locationName = [loc.name, loc.country].filter(Boolean).join(", ");

  const [, sm, sd] = startDate.split("-").map(Number);
  const [, em, ed] = endDate.split("-").map(Number);

  const allMax = [];
  const allMin = [];
  const allPrecip = [];
  const codeCounts = {};

  for (const y of years) {
    const s = toYearDate(y, sm, sd);
    const e = toYearDate(y, em, ed);
    const daily = await fetchArchive(loc.lat, loc.lon, s, e);

    const times = daily.time || [];
    const maxT = daily.temperature_2m_max ?? [];
    const minT = daily.temperature_2m_min ?? [];
    const prec = daily.precipitation_sum ?? [];
    const codes = daily.weather_code ?? [];

    for (let i = 0; i < times.length; i++) {
      if (maxT[i] != null) allMax.push(maxT[i]);
      if (minT[i] != null) allMin.push(minT[i]);
      if (prec[i] != null) allPrecip.push(prec[i]);
      const c = codes[i];
      if (c != null) codeCounts[c] = (codeCounts[c] || 0) + 1;
    }
  }

  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const avg = (a) => (a.length ? sum(a) / a.length : null);

  let typicalCode = null;
  let maxCount = 0;
  for (const [c, n] of Object.entries(codeCounts)) {
    if (n > maxCount) {
      maxCount = n;
      typicalCode = Number(c);
    }
  }

  return {
    locationName,
    avgMaxTemp: avg(allMax),
    avgMinTemp: avg(allMin),
    avgPrecip: avg(allPrecip),
    typicalWeatherCode: typicalCode,
    typicalWeatherLabel: weatherCodeLabel(typicalCode),
    yearsUsed: years,
  };
}
