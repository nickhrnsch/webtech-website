import { holidays } from "./constants";

export function isWeekend(day) {
  const dayOfWeek = day.day();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sonntag, 6 = Samstag
}

export function isHoliday(dayKey) {
  return holidays.includes(dayKey);
}

export function getDayBackgroundColor(day, dayKey, isVacation) {
  if (isVacation) {
    // Urlaubstage mit Saisonfarben
    const month = day.month() + 1;
    if (month >= 3 && month <= 5) return "rgba(255, 192, 203, 0.4)"; // Frühling
    if (month >= 6 && month <= 8) return "rgba(144, 238, 144, 0.4)"; // Sommer
    if (month >= 9 && month <= 11) return "rgba(255, 140, 0, 0.4)"; // Herbst
    return "rgba(173, 216, 230, 0.4)"; // Winter
  }

  if (isHoliday(dayKey)) {
    return "rgba(255, 215, 0, 0.2)"; // Gold/Gelb für Feiertage
  }

  if (isWeekend(day)) {
    return "rgba(173, 216, 230, 0.15)"; // Hellblau für Wochenende
  }

  return "rgba(240, 240, 240, 0.15)"; // Sehr blasses Grau für Arbeitstage
}

export function getSeasonEmoji(month) {
  // Frühling: März(3), April(4), Mai(5)
  if (month >= 3 && month <= 5) return "🌸";
  // Sommer: Juni(6), Juli(7), August(8)
  if (month >= 6 && month <= 8) return "🌴";
  // Herbst: September(9), Oktober(10), November(11)
  if (month >= 9 && month <= 11) return "🍂";
  // Winter: Dezember(12), Januar(1), Februar(2)
  return "❄️";
}
