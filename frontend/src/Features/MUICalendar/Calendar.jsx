import * as React from "react";
import dayjs from "dayjs";
import { useEffect } from "react";
import "dayjs/locale/de";
import Snackbar from "@mui/material/Snackbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

// Importiere ausgelagerte Komponenten
import ServerDay from "./ServerDay";
import NoteDialog from "./NoteDialog";
import VacationDialog from "./VacationDialog";
import ConfirmDialog from "./ConfirmDialog";
import ExportMenu from "./ExportMenu";

// Importiere Service-Funktionen
import { fetchWeather } from "./weatherService";
import {
  createShareUrl,
  copyToClipboard,
  exportToGoogleCalendar,
  downloadICS,
  parseSharedVacationFromUrl,
} from "./exportService";
import {
  createVacation,
  updateVacation,
  addVacation,
  updateVacationInList,
  findVacationByDay,
} from "./vacationHandlers";

// Importiere Styles
import { calendarStyles, snackbarConfig } from "./styles";

const initialValue = dayjs();

/**
 * Hauptkomponente für den Kalender mit Notizen und Urlaubsplanung
 * 
 * Features:
 * - Anzeige eines interaktiven Kalenders
 * - Notizen für einzelne Tage
 * - Urlaubsplanung mit Datum, Ort und Personen
 * - Wetter-API Integration
 * - Export zu Google Calendar und .ics Dateien
 * - Teilen von Urlauben via URL
 */
export default function DateCalendarServerRequest() {
  // ========== Dialog States ==========
  // State für Notizen-Dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);
  
  // State für Notizen
  const [notes, setNotes] = React.useState({}); // Speichert Notizen nach Datum
  const [currentNote, setCurrentNote] = React.useState("");
  const [formatting, setFormatting] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });
  
  // ========== Urlaubs-States ==========
  // State für Urlaubs-Dialog
  const [openVacationDialog, setOpenVacationDialog] = React.useState(false);
  const [vacationStart, setVacationStart] = React.useState(null);
  const [vacationEnd, setVacationEnd] = React.useState(null);
  const [vacationLocation, setVacationLocation] = React.useState("");
  const [vacationPeople, setVacationPeople] = React.useState("");
  const [vacations, setVacations] = React.useState([]); // Array aller gespeicherten Urlaube
  
  // ========== Wetter-States ==========
  const [weatherData, setWeatherData] = React.useState(null);
  const [loadingWeather, setLoadingWeather] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState(null);
  
  // ========== Edit & Share States ==========
  const [isEditingVacation, setIsEditingVacation] = React.useState(false);
  const [editingVacationId, setEditingVacationId] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [sharedVacationData, setSharedVacationData] = React.useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  
  // ========== Export-States ==========
  const [calendarMenuAnchor, setCalendarMenuAnchor] = React.useState(null);
  const [selectedVacationForExport, setSelectedVacationForExport] = React.useState(null);

  // ========== EFFECTS ==========
  /**
   * Prüft beim ersten Laden der Komponente, ob ein geteilter Urlaub
   * in der URL vorhanden ist (z.B. ?vacation=...)
   * Falls ja, wird ein Bestätigungs-Dialog angezeigt
   */
  useEffect(() => {
    const sharedData = parseSharedVacationFromUrl();
    if (sharedData) {
      setSharedVacationData(sharedData);
      setConfirmDialogOpen(true);
    }
  }, []);

  // ========== SHARE & EXPORT HANDLERS ==========
  /**
   * Erstellt einen teilbaren Link für einen Urlaub und kopiert ihn in die Zwischenablage
   * @param {Object} vacation - Das Urlaubs-Objekt mit allen Daten
   */
  const handleShareVacation = (vacation) => {
    const shareUrl = createShareUrl(vacation);
    
    copyToClipboard(shareUrl)
      .then(() => {
        setSnackbarMessage("Link wurde in die Zwischenablage kopiert!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Fehler beim Kopieren:", err);
        setSnackbarMessage("Fehler beim Kopieren des Links");
        setSnackbarOpen(true);
      });
  };

  /**
   * Öffnet Google Calendar mit vorausgefüllten Urlaubsdaten
   * @param {Object} vacation - Das Urlaubs-Objekt
   */
  const handleExportToGoogleCalendar = (vacation) => {
    exportToGoogleCalendar(vacation);
    setSnackbarMessage("Google Calendar geöffnet!");
    setSnackbarOpen(true);
  };

  /**
   * Lädt eine .ics Datei herunter (kompatibel mit allen Kalender-Apps)
   * @param {Object} vacation - Das Urlaubs-Objekt
   */
  const handleDownloadICS = (vacation) => {
    downloadICS(vacation);
    setSnackbarMessage(".ics Datei heruntergeladen!");
    setSnackbarOpen(true);
  };

  /**
   * Öffnet das Export-Menü (Google Calendar oder .ics)
   */
  const handleOpenCalendarMenu = (event, vacation) => {
    setCalendarMenuAnchor(event.currentTarget);
    setSelectedVacationForExport(vacation);
  };

  /**
   * Schließt das Export-Menü
   */
  const handleCloseCalendarMenu = () => {
    setCalendarMenuAnchor(null);
    setSelectedVacationForExport(null);
  };

  /**
   * Fügt einen geteilten Urlaub (aus URL) zum eigenen Kalender hinzu
   */
  const handleAddSharedVacation = () => {
    if (sharedVacationData) {
      const newVacation = createVacation(
        dayjs(sharedVacationData.startDate),
        dayjs(sharedVacationData.endDate),
        sharedVacationData.location,
        sharedVacationData.people,
        sharedVacationData.weatherData
      );

      setVacations((prev) => addVacation(prev, newVacation));
      setSnackbarMessage("Geteilter Urlaub wurde hinzugefügt!");
      setSnackbarOpen(true);
    }
    setConfirmDialogOpen(false);
    setSharedVacationData(null);
  };

  // ========== WETTER HANDLER ==========
  /**
   * Ruft Wetterdaten für den eingegebenen Urlaubsort ab
   * Nutzt die Open-Meteo API über weatherService.js
   */
  const handleFetchWeather = async () => {
    if (!vacationLocation || vacationLocation.trim() === "") {
      setWeatherData(null);
      setWeatherError(null);
      return;
    }

    setLoadingWeather(true);
    setWeatherError(null);

    try {
      const data = await fetchWeather(vacationLocation);
      setWeatherData(data);
      console.log("Wetterdaten erfolgreich geladen");
    } catch (error) {
      setWeatherError(error.message);
      setWeatherData(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  // ========== NOTIZEN HANDLERS ==========
  /**
   * Wird beim Doppelklick auf einen Tag im Kalender aufgerufen
   * Öffnet den Notizen-Dialog mit vorhandenen Daten
   */
  const handleDayDoubleClick = (day) => {
    const dayKey = day.format("YYYY-MM-DD");
    setSelectedDay(day);
    setCurrentNote(notes[dayKey] || "");
    
    // Prüfe ob dieser Tag zu einem Urlaub gehört und zeige Wetterdaten an
    const vacationInfo = vacations.find(v => v.days.includes(dayKey));
    if (vacationInfo && vacationInfo.weatherData) {
      setWeatherData(vacationInfo.weatherData);
    }
    
    setOpenDialog(true);
  };

  /**
   * Schließt den Notizen-Dialog und setzt alle temporären States zurück
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);findVacationByDay(vacations, dayKey)
    setSelectedDay(null);
    setWeatherData(null);
  };

  /**
   * Speichert die Notiz für den ausgewählten Tag
   */
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

  // ========== URLAUB HANDLERS ==========
  /**
   * Öffnet den Urlaubs-Dialog
   * @param {Object|null} vacationToEdit - Falls vorhanden: Bearbeitungsmodus, sonst: Neuer Urlaub
   */
  const handleOpenVacationDialog = (vacationToEdit = null) => {
    if (vacationToEdit) {
      // Bearbeitungsmodus: Lade vorhandene Urlaubsdaten
      setIsEditingVacation(true);
      setEditingVacationId(vacationToEdit.id);
      setVacationStart(dayjs(vacationToEdit.startDate));
      setVacationEnd(dayjs(vacationToEdit.endDate));
      setVacationLocation(vacationToEdit.location || "");
      setVacationPeople(vacationToEdit.people || "");
      setWeatherData(vacationToEdit.weatherData || null);
    } else {
      // Neuer Urlaub: Starte mit leeren Feldern
      setIsEditingVacation(false);
      setEditingVacationId(null);
    }
    setOpenVacationDialog(true);
  };

  /**
   * Schließt den Urlaubs-Dialog und setzt alle Felder zurück
   */
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

  /**
   * Speichert einen neuen Urlaub oder aktualisiert einen bestehenden
   * Nutzt die ausgelagerten Funktionen aus vacationHandlers.js
   */
  const handleSaveVacation = () => {
    if (vacationStart && vacationEnd) {
      if (isEditingVacation && editingVacationId) {
        // Update-Modus: Aktualisiere bestehenden Urlaub
        const existingVacation = vacations.find(v => v.id === editingVacationId);
        const updatedVacation = updateVacation(
          existingVacation,
          vacationStart,
          vacationEnd,
          vacationLocation,
          vacationPeople,
          weatherData
        );
        setVacations((prev) => updateVacationInList(prev, editingVacationId, updatedVacation));
        console.log("Urlaub aktualisiert:", editingVacationId);
      } else {
        // Erstell-Modus: Füge neuen Urlaub hinzu
        const newVacation = createVacation(
          vacationStart,
          vacationEnd,
          vacationLocation,
          vacationPeople,
          weatherData
        );
        setVacations((prev) => addVacation(prev, newVacation));
        console.log("Urlaub gespeichert:", newVacation);
      }
    }
    handleCloseVacationDialog();
  };

  // ========== RENDER ==========
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      {/* Haupt-Kalender Komponente mit deutscher Lokalisierung */}
      <DateCalendar
        defaultValue={initialValue}
        slots={{
          day: ServerDay, // Custom Day-Komponente mit Notizen & Urlaubs-Badges
        }}
        slotProps={{
          day: {
            notes,
            vacationDays: vacations,
            onDayDoubleClick: handleDayDoubleClick,
          },
        }}
        sx={calendarStyles}
      />

      {/* ========== NOTIZEN DIALOG ========== */}
      <NoteDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveNote}
        selectedDay={selectedDay}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        formatting={formatting}
        setFormatting={setFormatting}
        vacationInfo={selectedDay ? findVacationByDay(vacations, selectedDay.format("YYYY-MM-DD")) : null}
        onOpenVacationDialog={handleOpenVacationDialog}
        onOpenCalendarMenu={handleOpenCalendarMenu}
        onShareVacation={handleShareVacation}
      />

      {/* ========== URLAUBS-DIALOG ========== */}
      <VacationDialog
        open={openVacationDialog}
        onClose={handleCloseVacationDialog}
        onSave={handleSaveVacation}
        isEditing={isEditingVacation}
        vacationStart={vacationStart}
        setVacationStart={setVacationStart}
        vacationEnd={vacationEnd}
        setVacationEnd={setVacationEnd}
        vacationLocation={vacationLocation}
        setVacationLocation={setVacationLocation}
        vacationPeople={vacationPeople}
        setVacationPeople={setVacationPeople}
        weatherData={weatherData}
        loadingWeather={loadingWeather}
        weatherError={weatherError}
        onFetchWeather={handleFetchWeather}
      />

      {/* ========== EXPORT-MENÜ ========== */}
      <ExportMenu
        anchorEl={calendarMenuAnchor}
        open={Boolean(calendarMenuAnchor)}
        onClose={handleCloseCalendarMenu}
        onExportToGoogle={() => selectedVacationForExport && handleExportToGoogleCalendar(selectedVacationForExport)}
        onDownloadICS={() => selectedVacationForExport && handleDownloadICS(selectedVacationForExport)}
      />

      {/* ========== FEEDBACK KOMPONENTEN ========== */}
      {/* Snackbar für Erfolgs- und Fehlermeldungen */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarConfig.autoHideDuration}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {/* ========== BESTÄTIGUNGS-DIALOG ========== */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setSharedVacationData(null);
        }}
        onConfirm={handleAddSharedVacation}
        sharedVacationData={sharedVacationData}
      />
    </LocalizationProvider>
  );
}
