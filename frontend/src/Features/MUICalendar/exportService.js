import dayjs from "dayjs";

export function createShareUrl(vacation) {
  const shareData = {
    startDate: vacation.startDate,
    endDate: vacation.endDate,
    location: vacation.location,
    people: vacation.people,
    weatherData: vacation.weatherData,
  };
  
  const encoded = encodeURIComponent(JSON.stringify(shareData));
  return `${window.location.origin}${window.location.pathname}?vacation=${encoded}`;
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function exportToGoogleCalendar(vacation) {
  const startDate = dayjs(vacation.startDate).format('YYYYMMDD');
  const endDate = dayjs(vacation.endDate).add(1, 'day').format('YYYYMMDD'); // Google Calendar benötigt exklusives Enddatum
  
  const title = vacation.location ? `Urlaub in ${vacation.location}` : 'Urlaub';
  let description = '';
  
  if (vacation.people) {
    description += `Personen: ${vacation.people}\n`;
  }
  if (vacation.weatherData) {
    description += `Wetter: ${vacation.weatherData.temp}°C, ${vacation.weatherData.description}\n`;
    description += `Ort: ${vacation.weatherData.locationName}`;
  }
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
  
  window.open(googleCalendarUrl, '_blank');
}

export function generateICS(vacation) {
  const startDate = dayjs(vacation.startDate).format('YYYYMMDD');
  const endDate = dayjs(vacation.endDate).add(1, 'day').format('YYYYMMDD');
  const now = dayjs().format('YYYYMMDDTHHmmss');
  
  const title = vacation.location ? `Urlaub in ${vacation.location}` : 'Urlaub';
  let description = '';
  
  if (vacation.people) {
    description += `Personen: ${vacation.people}\\n`;
  }
  if (vacation.weatherData) {
    description += `Wetter: ${vacation.weatherData.temp}°C, ${vacation.weatherData.description}\\n`;
    description += `Ort: ${vacation.weatherData.locationName}`;
  }
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vacation Calendar//DE
BEGIN:VEVENT
UID:${vacation.id}@vacationcalendar
DTSTAMP:${now}Z
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export function downloadICS(vacation) {
  const icsContent = generateICS(vacation);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `urlaub_${vacation.startDate}.ics`;
  link.click();
}

export function parseSharedVacationFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedVacation = urlParams.get('vacation');
  
  if (sharedVacation) {
    try {
      const decoded = JSON.parse(decodeURIComponent(sharedVacation));
      // Entferne Parameter aus URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return decoded;
    } catch (error) {
      console.error("Fehler beim Laden des geteilten Urlaubs:", error);
      return null;
    }
  }
  return null;
}
