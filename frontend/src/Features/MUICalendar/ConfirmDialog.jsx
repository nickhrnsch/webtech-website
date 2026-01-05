import * as React from "react";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Importiere Styles
import {
  confirmDialogContentBoxStyles,
  confirmDialogInfoBoxStyles,
  confirmDialogItemStyles,
  confirmDialogWeatherStyles,
  confirmDialogTextStyles,
} from "./styles";

/**
 * Bestätigungs-Dialog zum Hinzufügen eines geteilten Urlaubs
 * 
 * @param {boolean} open - Ob der Dialog geöffnet ist
 * @param {function} onClose - Callback beim Schließen
 * @param {function} onConfirm - Callback beim Bestätigen
 * @param {Object} sharedVacationData - Daten des geteilten Urlaubs
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  sharedVacationData,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Geteilten Urlaub hinzufügen?</DialogTitle>
      <DialogContent>
        {sharedVacationData && (
          <Box sx={confirmDialogContentBoxStyles}>
            <Box sx={confirmDialogInfoBoxStyles}>
              <Box sx={confirmDialogItemStyles}>
                <strong>Zeitraum:</strong> {dayjs(sharedVacationData.startDate).format("DD.MM.YYYY")} - {dayjs(sharedVacationData.endDate).format("DD.MM.YYYY")}
              </Box>
              {sharedVacationData.location && (
                <Box sx={confirmDialogItemStyles}>
                  <strong>Ort:</strong> {sharedVacationData.location}
                </Box>
              )}
              {sharedVacationData.people && (
                <Box sx={confirmDialogItemStyles}>
                  <strong>Personen:</strong> {sharedVacationData.people}
                </Box>
              )}
              {sharedVacationData.weatherData && (
                <Box sx={confirmDialogWeatherStyles}>
                  <strong>Wetter:</strong> {sharedVacationData.weatherData.temp}°C, {sharedVacationData.weatherData.description}
                </Box>
              )}
            </Box>
            <Box sx={confirmDialogTextStyles}>
              Möchtest du diesen Urlaub zu deinem Kalender hinzufügen?
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Abbrechen
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
