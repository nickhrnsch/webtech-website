import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Importiere Styles
import {
  vacationDialogContentBoxStyles,
  weatherDisplayBoxStyles,
  weatherChipsContainerStyles,
  weatherButtonStyles,
} from "./styles";

/**
 * Dialog-Komponente zum Hinzufügen oder Bearbeiten von Urlauben
 * 
 * @param {boolean} open - Ob der Dialog geöffnet ist
 * @param {function} onClose - Callback beim Schließen
 * @param {function} onSave - Callback beim Speichern (erhält alle Urlaubsdaten)
 * @param {boolean} isEditing - Ob ein bestehender Urlaub bearbeitet wird
 * @param {Dayjs} vacationStart - Startdatum
 * @param {function} setVacationStart - Setter für Startdatum
 * @param {Dayjs} vacationEnd - Enddatum
 * @param {function} setVacationEnd - Setter für Enddatum
 * @param {string} vacationLocation - Urlaubsort
 * @param {function} setVacationLocation - Setter für Urlaubsort
 * @param {string} vacationPeople - Personen
 * @param {function} setVacationPeople - Setter für Personen
 * @param {Object} weatherData - Wetterdaten
 * @param {boolean} loadingWeather - Ob Wetterdaten geladen werden
 * @param {string} weatherError - Fehlermeldung beim Wetter-Laden
 * @param {function} onFetchWeather - Callback zum Abrufen der Wetterdaten
 */
export default function VacationDialog({
  open,
  onClose,
  onSave,
  isEditing,
  vacationStart,
  setVacationStart,
  vacationEnd,
  setVacationEnd,
  vacationLocation,
  setVacationLocation,
  vacationPeople,
  setVacationPeople,
  weatherData,
  loadingWeather,
  weatherError,
  onFetchWeather,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? "Urlaub bearbeiten" : "Urlaub hinzufügen"}
      </DialogTitle>
      <DialogContent>
        <Box sx={vacationDialogContentBoxStyles}>
          {/* Startdatum Picker */}
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
          
          {/* Enddatum Picker */}
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
          
          {/* Orts-Eingabe mit Wetter-Button */}
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
              onClick={onFetchWeather}
              disabled={!vacationLocation || loadingWeather}
              sx={weatherButtonStyles}
            >
              Wetter abrufen
            </Button>
            
            {/* Wetterdaten-Anzeige */}
            {weatherData && (
              <Box sx={weatherDisplayBoxStyles}>
                <Alert severity="success" sx={{ mb: 1 }}>
                  Wetter für {weatherData.locationName}
                </Alert>
                <Box sx={weatherChipsContainerStyles}>
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
            
            {/* Wetter-Fehler */}
            {weatherError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {weatherError}
              </Alert>
            )}
          </Box>
          
          {/* Personen-Eingabe */}
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
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!vacationStart || !vacationEnd}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
