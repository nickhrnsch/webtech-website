const NAGER_DATE_BASE_URL = 'https://date.nager.at/api/v3';
const DEFAULT_COUNTRY_CODE = 'DE';
const DEFAULT_SUBDIVISION_CODE = 'DE-NW';

const holidaysCache = new Map();

function createCacheKey(year, countryCode, subdivisionCode) {
  return `${year}-${countryCode}-${subdivisionCode || 'ALL'}`;
}

function shouldIncludeHoliday(holiday, subdivisionCode) {
  if (!subdivisionCode) {
    return true;
  }

  if (!Array.isArray(holiday.counties) || holiday.counties.length === 0) {
    return true;
  }

  return holiday.counties.includes(subdivisionCode);
}

async function fetchPublicHolidaysByYear(year, options = {}) {
  const countryCode = options.countryCode || DEFAULT_COUNTRY_CODE;
  const subdivisionCode = options.subdivisionCode || DEFAULT_SUBDIVISION_CODE;
  const cacheKey = createCacheKey(year, countryCode, subdivisionCode);

  if (holidaysCache.has(cacheKey)) {
    return holidaysCache.get(cacheKey);
  }

  const response = await fetch(`${NAGER_DATE_BASE_URL}/PublicHolidays/${year}/${countryCode}`);
  if (!response.ok) {
    throw new Error(`Feiertage konnten nicht geladen werden (${response.status})`);
  }

  const data = await response.json();
  const normalized = data
    .filter((holiday) => shouldIncludeHoliday(holiday, subdivisionCode))
    .map((holiday) => ({
      date: holiday.date,
      name: holiday.localName || holiday.name,
    }));

  holidaysCache.set(cacheKey, normalized);
  return normalized;
}

export async function fetchPublicHolidaysForYears(years, options = {}) {
  const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
  const holidaysByYear = await Promise.all(
    uniqueYears.map((year) => fetchPublicHolidaysByYear(year, options))
  );

  return holidaysByYear
    .flat()
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getDefaultHolidayYears(baseYear = new Date().getFullYear()) {
  return [baseYear - 1, baseYear, baseYear + 1, baseYear + 2];
}
