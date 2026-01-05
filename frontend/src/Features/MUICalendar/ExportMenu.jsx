import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

/**
 * Menü-Komponente für den Export von Urlauben
 * Bietet Optionen für Google Calendar und .ics Download
 * 
 * @param {Element} anchorEl - Anker-Element für das Menü
 * @param {boolean} open - Ob das Menü geöffnet ist
 * @param {function} onClose - Callback beim Schließen
 * @param {function} onExportToGoogle - Callback für Google Calendar Export
 * @param {function} onDownloadICS - Callback für .ics Download
 */
export default function ExportMenu({
  anchorEl,
  open,
  onClose,
  onExportToGoogle,
  onDownloadICS,
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => {
        onExportToGoogle();
        onClose();
      }}>
        <ListItemIcon>
          <CalendarMonthIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Zu Google Calendar</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        onDownloadICS();
        onClose();
      }}>
        <ListItemIcon>
          <FileDownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>.ics Datei herunterladen</ListItemText>
      </MenuItem>
    </Menu>
  );
}
