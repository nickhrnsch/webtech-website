import dayjs from "dayjs";

/**
 * Generiert ein Array mit allen Tagen zwischen Start- und Enddatum
 * @param {Dayjs} startDate - Startdatum
 * @param {Dayjs} endDate - Enddatum
 * @returns {Array<string>} - Array mit Datumsstrings im Format "YYYY-MM-DD"
 */
export function generateVacationDays(startDate, endDate) {
  const days = [];
  let currentDay = startDate.clone();

  while (
    currentDay.isBefore(endDate) ||
    currentDay.isSame(endDate, "day")
  ) {
    days.push(currentDay.format("YYYY-MM-DD"));
    currentDay = currentDay.add(1, "day");
  }

  return days;
}

/**
 * Erstellt ein neues Urlaubs-Objekt
 * @param {Dayjs} startDate - Startdatum
 * @param {Dayjs} endDate - Enddatum
 * @param {string} location - Urlaubsort
 * @param {string} people - Personen
 * @param {Object} weatherData - Wetterdaten
 * @returns {Object} - Neues Urlaubs-Objekt
 */
export function createVacation(startDate, endDate, location, people, weatherData) {
  const days = generateVacationDays(startDate, endDate);
  
  return {
    id: Date.now(),
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    location: location,
    people: people,
    weatherData: weatherData,
    days: days,
  };
}

/**
 * Aktualisiert ein bestehendes Urlaubs-Objekt
 * @param {Object} existingVacation - Das zu aktualisierende Urlaubs-Objekt
 * @param {Dayjs} startDate - Neues Startdatum
 * @param {Dayjs} endDate - Neues Enddatum
 * @param {string} location - Neuer Urlaubsort
 * @param {string} people - Neue Personen
 * @param {Object} weatherData - Neue Wetterdaten
 * @returns {Object} - Aktualisiertes Urlaubs-Objekt
 */
export function updateVacation(existingVacation, startDate, endDate, location, people, weatherData) {
  const days = generateVacationDays(startDate, endDate);
  
  return {
    ...existingVacation,
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    location: location,
    people: people,
    weatherData: weatherData,
    days: days,
  };
}

/**
 * Fügt einen neuen Urlaub zur Liste hinzu
 * @param {Array} vacations - Aktuelle Urlaubs-Liste
 * @param {Object} newVacation - Neuer Urlaub
 * @returns {Array} - Aktualisierte Urlaubs-Liste
 */
export function addVacation(vacations, newVacation) {
  return [...vacations, newVacation];
}

/**
 * Aktualisiert einen Urlaub in der Liste
 * @param {Array} vacations - Aktuelle Urlaubs-Liste
 * @param {number} vacationId - ID des zu aktualisierenden Urlaubs
 * @param {Object} updatedVacation - Aktualisierte Urlaubsdaten
 * @returns {Array} - Aktualisierte Urlaubs-Liste
 */
export function updateVacationInList(vacations, vacationId, updatedVacation) {
  return vacations.map((v) => 
    v.id === vacationId ? updatedVacation : v
  );
}

/**
 * Entfernt einen Urlaub aus der Liste
 * @param {Array} vacations - Aktuelle Urlaubs-Liste
 * @param {number} vacationId - ID des zu löschenden Urlaubs
 * @returns {Array} - Aktualisierte Urlaubs-Liste
 */
export function removeVacation(vacations, vacationId) {
  return vacations.filter((v) => v.id !== vacationId);
}

/**
 * Findet einen Urlaub anhand eines Datums
 * @param {Array} vacations - Liste der Urlaube
 * @param {string} dayKey - Datum im Format "YYYY-MM-DD"
 * @returns {Object|undefined} - Gefundener Urlaub oder undefined
 */
export function findVacationByDay(vacations, dayKey) {
  return vacations.find(v => v.days.includes(dayKey));
}
