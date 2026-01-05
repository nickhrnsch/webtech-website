import * as React from "react";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShareIcon from "@mui/icons-material/Share";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";

// Importiere Styles
import {
  vacationInfoPaperStyles,
  vacationInfoHeaderStyles,
  vacationInfoTitleStyles,
  vacationInfoDetailsStyles,
  vacationWeatherBoxStyles,
  vacationWeatherTitleStyles,
  noteEditorPaperStyles,
  formatToolbarStyles,
  noteTextFieldInputStyles,
  vacationButtonContainerStyles,
  iconButtonWhiteStyles,
} from "./styles";

/**
 * Komponente zur Anzeige von Urlaubsinformationen im Notizen-Dialog
 */
function VacationInfo({ vacationInfo, onOpenCalendarMenu, onShareVacation, onEditVacation }) {
  if (!vacationInfo) return null;

  return (
    <Paper elevation={3} sx={vacationInfoPaperStyles}>
      <Box sx={{ mb: 2 }}>
        <Box sx={vacationInfoHeaderStyles}>
          <Box sx={vacationInfoTitleStyles}>
            🏖️ Urlaub geplant
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => onEditVacation(vacationInfo)}
              sx={iconButtonWhiteStyles}
              title="Urlaub bearbeiten"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => onOpenCalendarMenu(e, vacationInfo)}
              sx={iconButtonWhiteStyles}
              title="Zu Kalender hinzufügen"
            >
              <CalendarMonthIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onShareVacation(vacationInfo)}
              sx={iconButtonWhiteStyles}
              title="Urlaub teilen"
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={vacationInfoDetailsStyles}>
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
        <Box sx={vacationWeatherBoxStyles}>
          <Box sx={vacationWeatherTitleStyles}>
            🌤️ Wetter
          </Box>
          {/* Wetterdaten hier anzeigen */}
        </Box>
      )}
    </Paper>
  );
}

/**
 * Dialog-Komponente für Notizen an einem bestimmten Tag
 * 
 * @param {boolean} open - Ob der Dialog geöffnet ist
 * @param {function} onClose - Callback beim Schließen
 * @param {function} onSave - Callback beim Speichern der Notiz
 * @param {Dayjs} selectedDay - Ausgewählter Tag
 * @param {string} currentNote - Aktuelle Notiz
 * @param {function} setCurrentNote - Setter für Notiz
 * @param {Object} formatting - Formatierungs-State (bold, italic, underline)
 * @param {function} setFormatting - Setter für Formatierung
 * @param {Object} vacationInfo - Urlaubsinfo falls vorhanden
 * @param {function} onOpenVacationDialog - Callback zum Öffnen des Urlaubs-Dialogs
 * @param {function} onOpenCalendarMenu - Callback zum Öffnen des Kalender-Menüs
 * @param {function} onShareVacation - Callback zum Teilen eines Urlaubs
 */
export default function NoteDialog({
  open,
  onClose,
  onSave,
  selectedDay,
  currentNote,
  setCurrentNote,
  formatting,
  setFormatting,
  vacationInfo,
  onOpenVacationDialog,
  onOpenCalendarMenu,
  onShareVacation,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Notiz für {selectedDay?.format("DD.MM.YYYY")}</DialogTitle>
      <DialogContent>
        {/* Zeige Urlaubs-Info falls vorhanden */}
        <VacationInfo 
          vacationInfo={vacationInfo}
          onOpenCalendarMenu={onOpenCalendarMenu}
          onShareVacation={onShareVacation}
          onEditVacation={onOpenVacationDialog}
        />
        
        {/* Notiz-Editor mit Formatierungs-Toolbar */}
        <Paper elevation={0} sx={noteEditorPaperStyles}>
          {/* Formatierungs-Buttons */}
          <Box sx={formatToolbarStyles}>
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
          
          {/* Textfeld für Notiz */}
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
              sx: noteTextFieldInputStyles(formatting),
            }}
          />
        </Paper>
        
        {/* Buttons für Urlaubsverwaltung */}
        <Box sx={vacationButtonContainerStyles}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={onOpenVacationDialog}
          >
            Urlaub hinzufügen
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onSave} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
