import * as React from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
import "dayjs/locale/de";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { listVacations, createVacation, updateVacation, createShareLink, acceptShareCode } from "../../services/vacationService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ShareIcon from "@mui/icons-material/Share";
import Snackbar from "@mui/material/Snackbar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Deutsche Feiertage (vereinfachte Liste, kann erweitert werden)
const holidays = [
  "2026-01-01", // Neujahr
  "2026-04-03", // Karfreitag
  "2026-04-06", // Ostermontag
  "2026-05-01", // Tag der Arbeit
  "2026-05-14", // Christi-Himmelfahrt
  "2026-05-25", // Pfingstmontag
  "2026-06-04", // Fronleichnam
  "2026-10-03", // Tag der deutschen Einheit
  "2026-11-01", // Allerheiligen
  "2026-12-25", // 1. Weihnachstag
  "2026-12-26", // 2. Weihnachstag
  "2027-01-01", // Neujahr
  "2027-03-26", // Karfreitag
  "2027-03-29", // Ostermontag
  "2027-05-01", // Tag der Arbeit
  "2027-05-06", // Christi-Himmelfahrt
  "2027-05-17", // Pfingstmontag
  "2027-05-27", // Fronleichnam
  "2027-10-03", // Tag der deutschen Einheit
  "2027-11-01", // Allerheiligen
  "2027-12-25", // 1. Weihnachstag
  "2027-12-26", // 2. Weihnachstag
  "2028-01-01", // Neujahr
  "2028-04-14", // Karfreitag
  "2028-04-17", // Ostermontag
  "2028-05-01", // Tag der Arbeit
  "2028-05-25", // Christi-Himmelfahrt
  "2028-06-05", // Pfingstmontag
  "2028-06-15", // Fronleichnam
  "2028-10-03", // Tag der deutschen Einheit
  "2028-11-01", // Allerheiligen
  "2028-12-25", // 1. Weihnachstag
  "2028-12-26", // 2. Weihnachstag
  "2029-01-01", // Neujahr
  "2029-03-30", // Karfreitag
  "2029-04-02", // Ostermontag
  "2029-05-01", // Tag der Arbeit
  "2029-05-10", // Christi-Himmelfahrt
  "2029-05-21", // Pfingstmontag
  "2029-05-31", // Fronleichnam
  "2029-10-03", // Tag der deutschen Einheit
  "2029-11-01", // Allerheiligen
  "2029-12-25", // 1. Weihnachstag
  "2029-12-26", // 2. Weihnachstag
  "2030-01-01", // Neujahr
  "2030-04-19", // Karfreitag
  "2030-04-22", // Ostermontag
  "2030-05-01", // Tag der Arbeit
  "2030-05-30", // Christi-Himmelfahrt
  "2030-06-10", // Pfingstmontag
  "2030-06-20", // Fronleichnam
  "2030-10-03", // Tag der deutschen Einheit
  "2030-11-01", // Allerheiligen
  "2030-12-25", // 1. Weihnachstag
  "2030-12-26", // 2. Weihnachstag
];

function isWeekend(day) {
  const dayOfWeek = day.day();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sonntag, 6 = Samstag
}

function isHoliday(dayKey) {
  return holidays.includes(dayKey);
}

function getSeasonEmoji(month) {
  // Frühling: März(3), April(4), Mai(5)
  if (month >= 3 && month <= 5) return "🌸";
  // Sommer: Juni(6), Juli(7), August(8)
  if (month >= 6 && month <= 8) return "🌴";
  // Herbst: September(9), Oktober(10), November(11)
  if (month >= 9 && month <= 11) return "🍂";
  // Winter: Dezember(12), Januar(1), Februar(2)
  return "❄️";
}

export default function DateCalendarServerRequest({ onVacationsChange, selectedDate, onDateChange }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [notes, setNotes] = React.useState({});
  const [currentNote, setCurrentNote] = React.useState("");
  const [formatting, setFormatting] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [openVacationDialog, setOpenVacationDialog] = React.useState(false);
  const [vacationStart, setVacationStart] = React.useState(null);
  const [vacationEnd, setVacationEnd] = React.useState(null);
  const [vacationLocation, setVacationLocation] = React.useState("");
  const [vacationPeople, setVacationPeople] = React.useState("");
  const [vacations, setVacations] = React.useState([]);
  const [weatherData, setWeatherData] = React.useState(null);
  const [loadingWeather, setLoadingWeather] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState(null);
  const [isEditingVacation, setIsEditingVacation] = React.useState(false);
  const [editingVacationId, setEditingVacationId] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [sharedVacationData, setSharedVacationData] = React.useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [calendarMenuAnchor, setCalendarMenuAnchor] = React.useState(null);
  const [selectedVacationForExport, setSelectedVacationForExport] = React.useState(null);
  const [lastClickTime, setLastClickTime] = React.useState(0);
  const [lastClickedDate, setLastClickedDate] = React.useState(null);
  const [activeStartDate, setActiveStartDate] = React.useState(
    selectedDate ? selectedDate.toDate() : new Date()
  );

  // Update activeStartDate when selectedDate changes from outside (e.g., NextEventsList)
  useEffect(() => {
    if (selectedDate) {
      setActiveStartDate(selectedDate.toDate());
    }
  }, [selectedDate]);

  // Lade Urlaube beim Mount
  useEffect(() => {
    async function loadVacations() {
      try {
        const data = await listVacations();
        // Convert API data to component format with days[]
        const vacationsWithDays = data.map(v => {
          const days = [];
          let currentDay = dayjs(v.start_date);
          const endDay = dayjs(v.end_date);
          
          while (currentDay.isBefore(endDay) || currentDay.isSame(endDay, "day")) {
            days.push(currentDay.format("YYYY-MM-DD"));
            currentDay = currentDay.add(1, "day");
          }
          
          return {
            id: v.id,
            startDate: v.start_date,
            endDate: v.end_date,
            location: v.location,
            people: v.people,
            days: days,
            weatherData: null, // Wetter wird bei Bedarf neu abgerufen
          };
        });
        setVacations(vacationsWithDays);
      } catch (error) {
        console.error("Fehler beim Laden der Urlaube:", error);
        setSnackbarMessage("Fehler beim Laden der Urlaube");
        setSnackbarOpen(true);
      }
    }
    
    loadVacations();
  }, []);

  // Benachrichtige Parent-Komponente über Änderungen der Urlaube
  useEffect(() => {
    if (onVacationsChange) {
      onVacationsChange(vacations);
    }
  }, [vacations, onVacationsChange]);

  // Prüfe beim Laden auf geteilte Urlaube via share_code in der URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('vacationShare');
    
    if (shareCode) {
      // Accept share code via API
      async function acceptShare() {
        try {
          await acceptShareCode(shareCode);
          setSnackbarMessage("Urlaub erfolgreich geteilt!");
          setSnackbarOpen(true);
          // Reload vacations
          const data = await listVacations();
          const vacationsWithDays = data.map(v => {
            const days = [];
            let currentDay = dayjs(v.start_date);
            const endDay = dayjs(v.end_date);
            
            while (currentDay.isBefore(endDay) || currentDay.isSame(endDay, "day")) {
              days.push(currentDay.format("YYYY-MM-DD"));
              currentDay = currentDay.add(1, "day");
            }
            
            return {
              id: v.id,
              startDate: v.start_date,
              endDate: v.end_date,
              location: v.location,
              people: v.people,
              days: days,
              weatherData: null,
            };
          });
          setVacations(vacationsWithDays);
        } catch (error) {
          console.error("Fehler beim Akzeptieren des Share-Codes:", error);
          setSnackbarMessage("Fehler beim Teilen des Urlaubs");
          setSnackbarOpen(true);
        }
      }
      
      acceptShare();
      // Entferne Parameter aus URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleShareVacation = async (vacation) => {
    try {
      const response = await createShareLink(vacation.id);
      // Build share URL with frontend origin
      const shareUrl = `${window.location.origin}/calendar?vacationShare=${response.share_code}`;
      
      // Kopiere Share-URL in Zwischenablage
      navigator.clipboard.writeText(shareUrl).then(() => {
        setSnackbarMessage("Link wurde in die Zwischenablage kopiert!");
        setSnackbarOpen(true);
      }).catch((err) => {
        console.error("Fehler beim Kopieren:", err);
        setSnackbarMessage("Fehler beim Kopieren des Links");
        setSnackbarOpen(true);
      });
    } catch (error) {
      console.error("Fehler beim Erstellen des Share-Links:", error);
      setSnackbarMessage("Fehler beim Erstellen des Share-Links");
      setSnackbarOpen(true);
    }
  };

  const handleExportToGoogleCalendar = (vacation) => {
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
    setSnackbarMessage("Google Calendar geöffnet!");
    setSnackbarOpen(true);
  };

  const handleDownloadICS = (vacation) => {
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
    
    const icsContent = `BEGIN:VCALENDAR
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
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `urlaub_${vacation.startDate}.ics`;
    link.click();
    
    setSnackbarMessage(".ics Datei heruntergeladen!");
    setSnackbarOpen(true);
  };

  const handleOpenCalendarMenu = (event, vacation) => {
    setCalendarMenuAnchor(event.currentTarget);
    setSelectedVacationForExport(vacation);
  };

  const handleCloseCalendarMenu = () => {
    setCalendarMenuAnchor(null);
    setSelectedVacationForExport(null);
  };

  const handleAddSharedVacation = () => {
    if (sharedVacationData) {
      const startDate = dayjs(sharedVacationData.startDate);
      const endDate = dayjs(sharedVacationData.endDate);
      
      const days = [];
      let currentDay = startDate.clone();

      while (
        currentDay.isBefore(endDate) ||
        currentDay.isSame(endDate, "day")
      ) {
        days.push(currentDay.format("YYYY-MM-DD"));
        currentDay = currentDay.add(1, "day");
      }

      const vacation = {
        id: Date.now(),
        startDate: sharedVacationData.startDate,
        endDate: sharedVacationData.endDate,
        location: sharedVacationData.location,
        people: sharedVacationData.people,
        weatherData: sharedVacationData.weatherData,
        days: days,
      };

      setVacations((prev) => [...prev, vacation]);
      setSnackbarMessage("Geteilter Urlaub wurde hinzugefügt!");
      setSnackbarOpen(true);
    }
    setConfirmDialogOpen(false);
    setSharedVacationData(null);
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Klar ☀️",
      1: "Überwiegend klar 🌤️",
      2: "Teilweise bewölkt ⛅",
      3: "Bewölkt ☁️",
      45: "Neblig 🌫️",
      48: "Neblig 🌫️",
      51: "Leichter Nieselregen 🌦️",
      53: "Nieselregen 🌦️",
      55: "Starker Nieselregen 🌧️",
      61: "Leichter Regen 🌧️",
      63: "Regen 🌧️",
      65: "Starker Regen 🌧️",
      71: "Leichter Schneefall ❄️",
      73: "Schneefall ❄️",
      75: "Starker Schneefall ❄️",
      77: "Schneegriesel ❄️",
      80: "Leichte Regenschauer 🌦️",
      81: "Regenschauer 🌧️",
      82: "Starke Regenschauer 🌧️",
      85: "Leichte Schneeschauer 🌨️",
      86: "Schneeschauer 🌨️",
      95: "Gewitter ⛈️",
      96: "Gewitter mit Hagel ⛈️",
      99: "Gewitter mit Hagel ⛈️"
    };
    return weatherCodes[code] || "Unbekannt";
  };

  const fetchWeather = async (location) => {
    if (!location || location.trim() === "") {
      setWeatherData(null);
      setWeatherError(null);
      return;
    }

    setLoadingWeather(true);
    setWeatherError(null);

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
      setWeatherData({
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        description: getWeatherDescription(current.weather_code),
        weatherCode: current.weather_code,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        locationName: `${name}, ${country}`,
      });
      console.log("Wetterdaten erfolgreich geladen für:", name);
    } catch (error) {
      console.error("Wetter-API Fehler:", error);
      setWeatherError(error.message);
      setWeatherData(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleDayDoubleClick = (day) => {
    const dayKey = day.format("YYYY-MM-DD");
    setSelectedDay(day);
    setCurrentNote(notes[dayKey] || "");
    
    // Prüfe ob dieser Tag zu einem Urlaub gehört
    const vacationInfo = vacations.find(v => v.days.includes(dayKey));
    if (vacationInfo && vacationInfo.weatherData) {
      setWeatherData(vacationInfo.weatherData);
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDay(null);
    setWeatherData(null);
  };

  const handleSaveNote = () => {
    if (selectedDay) {
      const dayKey = selectedDay.format("YYYY-MM-DD");
      setNotes((prev) => ({
        ...prev,
        [dayKey]: currentNote,
      }));
    }
    handleCloseDialog();
  };

  const handleOpenVacationDialog = (vacationToEdit = null) => {
    if (vacationToEdit) {
      // Bearbeitungsmodus
      setIsEditingVacation(true);
      setEditingVacationId(vacationToEdit.id);
      setVacationStart(dayjs(vacationToEdit.startDate));
      setVacationEnd(dayjs(vacationToEdit.endDate));
      setVacationLocation(vacationToEdit.location || "");
      setVacationPeople(vacationToEdit.people || "");
      setWeatherData(vacationToEdit.weatherData || null);
    } else {
      // Neuer Urlaub
      setIsEditingVacation(false);
      setEditingVacationId(null);
    }
    setOpenVacationDialog(true);
  };

  const handleCloseVacationDialog = () => {
    setOpenVacationDialog(false);
    setVacationStart(null);
    setVacationEnd(null);
    setVacationLocation("");
    setVacationPeople("");
    setWeatherData(null);
    setWeatherError(null);
    setIsEditingVacation(false);
    setEditingVacationId(null);
  };

  const handleSaveVacation = async () => {
    if (vacationStart && vacationEnd) {
      const days = [];
      let currentDay = vacationStart.clone();

      while (
        currentDay.isBefore(vacationEnd) ||
        currentDay.isSame(vacationEnd, "day")
      ) {
        days.push(currentDay.format("YYYY-MM-DD"));
        currentDay = currentDay.add(1, "day");
      }

      try {
        if (isEditingVacation && editingVacationId) {
          // Update bestehenden Urlaub via API
          const updated = await updateVacation(editingVacationId, {
            start_date: vacationStart.format("YYYY-MM-DD"),
            end_date: vacationEnd.format("YYYY-MM-DD"),
            location: vacationLocation,
            people: vacationPeople,
          });
          
          // Update local state
          setVacations((prev) => 
            prev.map((v) => 
              v.id === editingVacationId
                ? {
                    id: updated.id,
                    startDate: updated.start_date,
                    endDate: updated.end_date,
                    location: updated.location,
                    people: updated.people,
                    weatherData: weatherData,
                    days: days,
                  }
                : v
            )
          );
          setSnackbarMessage("Urlaub aktualisiert!");
          setSnackbarOpen(true);
        } else {
          // Speichere neuen Urlaub via API
          const created = await createVacation({
            start_date: vacationStart.format("YYYY-MM-DD"),
            end_date: vacationEnd.format("YYYY-MM-DD"),
            location: vacationLocation,
            people: vacationPeople,
          });
          
          const vacation = {
            id: created.id,
            startDate: created.start_date,
            endDate: created.end_date,
            location: created.location,
            people: created.people,
            weatherData: weatherData,
            days: days,
          };

          setVacations((prev) => [...prev, vacation]);
          setSnackbarMessage("Urlaub erstellt!");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Fehler beim Speichern des Urlaubs:", error);
        setSnackbarMessage("Fehler beim Speichern des Urlaubs");
        setSnackbarOpen(true);
      }
    }
    handleCloseVacationDialog();
  };

  // Helper Funktionen für react-calendar
  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const day = dayjs(date);
    const dayKey = day.format("YYYY-MM-DD");
    const vacation = vacations.find(v => v.days.includes(dayKey));
    const isVacation = !!vacation;
    
    const classes = [];
    
    if (isHoliday(dayKey)) {
      classes.push('holiday-tile');
    }
    
    if (isWeekend(day)) {
      classes.push('weekend-tile');
    }
    
    if (isVacation) {
      const month = day.month() + 1;
      if (month >= 3 && month <= 5) classes.push('vacation-spring');
      else if (month >= 6 && month <= 8) classes.push('vacation-summer');
      else if (month >= 9 && month <= 11) classes.push('vacation-autumn');
      else classes.push('vacation-winter');
    }
    
    if (selectedDate && day.isSame(dayjs(selectedDate), 'day')) {
      classes.push('selected-tile');
    }
    
    return classes.join(' ');
  };

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const day = dayjs(date);
    const dayKey = day.format("YYYY-MM-DD");
    const hasNote = notes[dayKey] && notes[dayKey].trim() !== "";
    const vacation = vacations.find(v => v.days.includes(dayKey));
    const isVacation = !!vacation;
    
    const month = day.month() + 1;
    const vacationEmoji = getSeasonEmoji(month);
    
    if (isVacation) {
      return <div className="tile-badge">{vacationEmoji}</div>;
    }
    
    if (hasNote) {
      return <div className="tile-badge">📝</div>;
    }
    
    return null;
  };

  const handleCalendarClick = (date) => {
    const day = dayjs(date);
    const now = Date.now();
    const dateString = day.format("YYYY-MM-DD");
    
    // Rufe onDateChange immer sofort auf für die NextEventsList
    if (onDateChange) {
      onDateChange(day);
    }
    
    // Prüfe auf Doppelklick (innerhalb von 300ms und auf das gleiche Datum)
    if (now - lastClickTime < 300 && lastClickedDate === dateString) {
      // Doppelklick erkannt - öffne Dialog
      handleDayDoubleClick(day);
      setLastClickTime(0);
      setLastClickedDate(null);
    } else {
      // Einzelklick - setze Timer für Doppelklick-Erkennung
      setLastClickTime(now);
      setLastClickedDate(dateString);
    }
  };

  const handleCalendarDoubleClick = (date) => {
    const day = dayjs(date);
    handleDayDoubleClick(day);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box sx={{ maxWidth: "370px", margin: "0 auto" }}>
        <style>{`
          .react-calendar {
            border: none;
            font-family: inherit;
            width: 100%;
            background: var(--theme-background-paper, #fff);
            color: var(--theme-text-primary, black);
          }
          
          .react-calendar__navigation {
            background: var(--theme-background-paper, #fff);
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }
          
          [data-theme="dark"] .react-calendar__navigation {
            border-bottom-color: rgba(255, 255, 255, 0.12);
          }
          
          .react-calendar__navigation button:disabled {
            background-color: rgba(0, 0, 0, 0.04) !important;
          }
          
          [data-theme="dark"] .react-calendar__navigation button:disabled {
            background-color: rgba(255, 255, 255, 0.08) !important;
          }
          
          .react-calendar__tile {
            position: relative;
            padding: 10px 6px;
            font-size: 0.875rem;
            color: var(--theme-text-primary, black);
            border-radius: 0;
            border: 2px solid transparent;
            box-sizing: border-box;
          }
          
          .react-calendar__tile:enabled:hover {
            background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.12);
          }
          
          .react-calendar__tile--active {
            background: var(--theme-primary, #00796B) !important;
            color: white;
          }
          
          .react-calendar__tile--now {
            background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.1);
            border-color: var(--theme-primary, #00796B);
          }
          
          .react-calendar__tile--now:enabled:hover {
            background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.2);
          }
          
          .weekend-tile {
            background-color: rgba(173, 216, 230, 0.15);
          }
          
          .holiday-tile {
            background-color: rgba(255, 215, 0, 0.2);
          }
          
          .vacation-spring {
            background-color: rgba(255, 192, 203, 0.4) !important;
          }
          
          .vacation-summer {
            background-color: rgba(144, 238, 144, 0.4) !important;
          }
          
          .vacation-autumn {
            background-color: rgba(255, 140, 0, 0.4) !important;
          }
          
          .vacation-winter {
            background-color: rgba(173, 216, 230, 0.4) !important;
          }
          
          .selected-tile {
            border-color: var(--theme-primary, #00796B) !important;
            background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.3) !important;
          }
          
          .tile-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 10px;
          }
          
          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 16px;
            margin-top: 8px;
            color: var(--theme-text-primary, black);
            border-radius: 0;
          }
          
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.12);
          }
          
          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 0.75rem;
            color: var(--theme-text-primary, black);
          }
          
          .react-calendar__month-view__weekdays__weekday {
            padding: 0.5em;
          }
          
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          
          .react-calendar__navigation__label {
            color: var(--theme-text-primary, black);
          }
        `}</style>
        <Calendar
          value={selectedDate ? selectedDate.toDate() : new Date()}
          onChange={handleCalendarClick}
          onClickDay={handleCalendarClick}
          tileClassName={getTileClassName}
          tileContent={getTileContent}
          locale="de-DE"
          minDetail="month"
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notiz für {selectedDay?.format("DD.MM.YYYY")}</DialogTitle>
        <DialogContent>
          {(() => {
            const dayKey = selectedDay?.format("YYYY-MM-DD");
            const vacationInfo = vacations.find(v => v.days.includes(dayKey));
            
            if (vacationInfo) {
              return (
                <Paper
                  elevation={3}
                  sx={{
                    mt: 2,
                    mb: 3,
                    p: 2,
                    bgcolor: "primary.light",
                    color: "black",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        🏖️ Urlaub geplant
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenCalendarMenu(e, vacationInfo)}
                          sx={{ color: "black" }}
                          title="Zu Kalender hinzufügen"
                        >
                          <CalendarMonthIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleShareVacation(vacationInfo)}
                          sx={{ color: "black" }}
                          title="Urlaub teilen"
                        >
                          <ShareIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box>
                        📅 {dayjs(vacationInfo.startDate).format("DD.MM.YYYY")} - {dayjs(vacationInfo.endDate).format("DD.MM.YYYY")}
                      </Box>
                      {vacationInfo.location && (
                        <Box>📍 Ort: {vacationInfo.location}</Box>
                      )}
                      {vacationInfo.people && (
                        <Box>👥 Personen: {vacationInfo.people}</Box>
                      )}
                    </Box>
                  </Box>
                  {vacationInfo.weatherData && (
                    <Box sx={{ 
                      bgcolor: "rgba(255, 255, 255, 0.2)", 
                      p: 1.5, 
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5
                    }}>
                      <Box sx={{ fontWeight: "bold", mb: 0.5 }}>
                        🌤️ Wetter in {vacationInfo.weatherData.locationName}:
                      </Box>
                      <Box>🌡️ {vacationInfo.weatherData.temp}°C (gefühlt {vacationInfo.weatherData.feelsLike}°C)</Box>
                      <Box>☁️ {vacationInfo.weatherData.description}</Box>
                      <Box>💧 {vacationInfo.weatherData.humidity}% Luftfeuchtigkeit</Box>
                      <Box>💨 Wind: {vacationInfo.weatherData.windSpeed} km/h</Box>
                    </Box>
                  )}
                </Paper>
              );
            }
            return null;
          })()}
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                p: 1,
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                bgcolor: "grey.50",
              }}
            >
              <IconButton
                size="small"
                onClick={() =>
                  setFormatting((prev) => ({ ...prev, bold: !prev.bold }))
                }
                color={formatting.bold ? "primary" : "default"}
              >
                <FormatBoldIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setFormatting((prev) => ({ ...prev, italic: !prev.italic }))
                }
                color={formatting.italic ? "primary" : "default"}
              >
                <FormatItalicIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  setFormatting((prev) => ({
                    ...prev,
                    underline: !prev.underline,
                  }))
                }
                color={formatting.underline ? "primary" : "default"}
              >
                <FormatUnderlinedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <FormatListBulletedIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              autoFocus
              multiline
              rows={8}
              fullWidth
              placeholder="Deine Notiz hier eingeben..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  p: 2,
                  fontWeight: formatting.bold ? "bold" : "normal",
                  fontStyle: formatting.italic ? "italic" : "normal",
                  textDecoration: formatting.underline ? "underline" : "none",
                },
              }}
            />
          </Paper>
          <Box
            sx={{ display: "flex", gap: 1, mt: 3, justifyContent: "center" }}
          >
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              disabled={!(() => {
                const dayKey = selectedDay?.format("YYYY-MM-DD");
                return vacations.find(v => v.days.includes(dayKey));
              })()}
              onClick={() => {
                const dayKey = selectedDay?.format("YYYY-MM-DD");
                const vacation = vacations.find(v => v.days.includes(dayKey));
                if (vacation) {
                  handleOpenVacationDialog(vacation);
                }
              }}
            >
              Urlaub bearbeiten
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleOpenVacationDialog()}
            >
              Urlaub hinzufügen
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button onClick={handleSaveNote} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openVacationDialog}
        onClose={handleCloseVacationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditingVacation ? "Urlaub bearbeiten" : "Urlaub hinzufügen"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <DatePicker
              label="Startdatum"
              value={vacationStart}
              onChange={(newValue) => setVacationStart(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
            <DatePicker
              label="Enddatum"
              value={vacationEnd}
              onChange={(newValue) => setVacationEnd(newValue)}
              minDate={vacationStart}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
            <Box>
              <TextField
                label="Ort"
                value={vacationLocation}
                onChange={(e) => setVacationLocation(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="z.B. Mallorca, Italien, Berlin"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={loadingWeather ? <CircularProgress size={16} /> : <WbSunnyIcon />}
                onClick={() => fetchWeather(vacationLocation)}
                disabled={!vacationLocation || loadingWeather}
                sx={{ mt: 1 }}
              >
                Wetter abrufen
              </Button>
              {weatherData && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" sx={{ mb: 1 }}>
                    Wetter für {weatherData.locationName}
                  </Alert>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={`${weatherData.temp}°C`}
                      color="primary"
                    />
                    <Chip label={weatherData.description} />
                    <Chip label={`Gefühlt: ${weatherData.feelsLike}°C`} variant="outlined" />
                    <Chip label={`${weatherData.humidity}% Luftfeuchtigkeit`} variant="outlined" />
                    <Chip label={`Wind: ${weatherData.windSpeed} km/h`} variant="outlined" />
                  </Box>
                </Box>
              )}
              {weatherError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {weatherError}
                </Alert>
              )}
            </Box>
            <TextField
              label="Personen"
              value={vacationPeople}
              onChange={(e) => setVacationPeople(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="z.B. Familie, Freunde, Partner"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVacationDialog}>Abbrechen</Button>
          <Button
            onClick={handleSaveVacation}
            variant="contained"
            disabled={!vacationStart || !vacationEnd}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={calendarMenuAnchor}
        open={Boolean(calendarMenuAnchor)}
        onClose={handleCloseCalendarMenu}
      >
        <MenuItem onClick={() => {
          if (selectedVacationForExport) {
            handleExportToGoogleCalendar(selectedVacationForExport);
          }
          handleCloseCalendarMenu();
        }}>
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Zu Google Calendar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedVacationForExport) {
            handleDownloadICS(selectedVacationForExport);
          }
          handleCloseCalendarMenu();
        }}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>.ics Datei herunterladen</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      <Dialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setSharedVacationData(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Geteilten Urlaub hinzufügen?</DialogTitle>
        <DialogContent>
          {sharedVacationData && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Box sx={{ mb: 1 }}>
                  <strong>Zeitraum:</strong> {dayjs(sharedVacationData.startDate).format("DD.MM.YYYY")} - {dayjs(sharedVacationData.endDate).format("DD.MM.YYYY")}
                </Box>
                {sharedVacationData.location && (
                  <Box sx={{ mb: 1 }}>
                    <strong>Ort:</strong> {sharedVacationData.location}
                  </Box>
                )}
                {sharedVacationData.people && (
                  <Box sx={{ mb: 1 }}>
                    <strong>Personen:</strong> {sharedVacationData.people}
                  </Box>
                )}
                {sharedVacationData.weatherData && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                    <strong>Wetter:</strong> {sharedVacationData.weatherData.temp}°C, {sharedVacationData.weatherData.description}
                  </Box>
                )}
              </Box>
              <Box sx={{ color: "text.secondary" }}>
                Möchtest du diesen Urlaub zu deinem Kalender hinzufügen?
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setConfirmDialogOpen(false);
            setSharedVacationData(null);
          }}>
            Abbrechen
          </Button>
          <Button onClick={handleAddSharedVacation} variant="contained">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
