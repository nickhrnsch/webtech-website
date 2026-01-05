/**
 * Zentralisierte Styles für die Kalender-Komponente
 * Enthält alle MUI SX-Props und Style-Objekte
 */

// ========== KALENDER STYLES ==========
export const calendarStyles = {
  color: "black",
  "& .MuiPickersDay-root": {
    color: "black",
  },
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#1976d2", // Farbe des ausgewählten Tags
    color: "white",
    "&:hover": {
      backgroundColor: "#1565c0", // Hover-Farbe
    },
  },
  "& .MuiDayCalendar-weekDayLabel": {
    color: "black",
  },
  "& .MuiPickersCalendarHeader-label": {
    color: "black",
  },
};

// ========== NOTE DIALOG STYLES ==========
export const vacationInfoPaperStyles = {
  mt: 2,
  mb: 3,
  p: 2,
  bgcolor: "primary.light",
  color: "white",
};

export const vacationInfoHeaderStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
};

export const vacationInfoTitleStyles = {
  fontWeight: "bold",
  fontSize: "1.1rem",
};

export const vacationInfoDetailsStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

export const vacationWeatherBoxStyles = {
  bgcolor: "rgba(255, 255, 255, 0.2)",
  p: 1.5,
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const vacationWeatherTitleStyles = {
  fontWeight: "bold",
  mb: 0.5,
};

export const noteEditorPaperStyles = {
  mt: 2,
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: 1,
  overflow: "hidden",
};

export const formatToolbarStyles = {
  display: "flex",
  gap: 0.5,
  p: 1,
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  bgcolor: "grey.50",
};

export const noteTextFieldInputStyles = (formatting) => ({
  p: 2,
  fontWeight: formatting.bold ? "bold" : "normal",
  fontStyle: formatting.italic ? "italic" : "normal",
  textDecoration: formatting.underline ? "underline" : "none",
});

export const vacationButtonContainerStyles = {
  display: "flex",
  gap: 1,
  mt: 3,
  justifyContent: "center",
};

export const iconButtonWhiteStyles = {
  color: "white",
};

// ========== VACATION DIALOG STYLES ==========
export const vacationDialogContentBoxStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  mt: 2,
};

export const weatherDisplayBoxStyles = {
  mt: 2,
};

export const weatherChipsContainerStyles = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
};

export const weatherButtonStyles = {
  mt: 1,
};

// ========== CONFIRM DIALOG STYLES ==========
export const confirmDialogContentBoxStyles = {
  mt: 2,
};

export const confirmDialogInfoBoxStyles = {
  mb: 2,
  p: 2,
  bgcolor: "grey.100",
  borderRadius: 1,
};

export const confirmDialogItemStyles = {
  mb: 1,
};

export const confirmDialogWeatherStyles = {
  mt: 1,
  pt: 1,
  borderTop: "1px solid rgba(0,0,0,0.1)",
};

export const confirmDialogTextStyles = {
  color: "text.secondary",
};

// ========== SNACKBAR STYLES ==========
export const snackbarConfig = {
  autoHideDuration: 3000,
};
