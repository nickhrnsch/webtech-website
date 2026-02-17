import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de";
import {
  createVacation,
  updateVacation,
  deleteVacation,
  createShareLink,
} from "../../services/vacationService";

const VACATION_TYPES = [
  "",
  "Strand",
  "Städtereise",
  "Wandern",
  "Ski",
  "Roadtrip",
  "Kreuzfahrt",
  "Sonstiges",
];

function VacationList({ vacations, loading, error, onVacationChange, onError }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [calendarMenuAnchor, setCalendarMenuAnchor] = useState(null);
  const [selectedVacationForExport, setSelectedVacationForExport] = useState(null);
  const [showPastVacations, setShowPastVacations] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [vacationType, setVacationType] = useState("");
  const [link, setLink] = useState("");

  const openAddDialog = () => {
    setEditingId(null);
    setStartDate(dayjs());
    setEndDate(dayjs().add(7, "day"));
    setLocation("");
    setPeople("");
    setTitle("");
    setNotes("");
    setAccommodation("");
    setVacationType("");
    setLink("");
    setDialogOpen(true);
  };

  const openEditDialog = (v) => {
    setEditingId(v.id);
    setStartDate(dayjs(v.start_date));
    setEndDate(dayjs(v.end_date));
    setLocation(v.location || "");
    setPeople(v.people || "");
    setTitle(v.title || "");
    setNotes(v.notes || "");
    setAccommodation(v.accommodation || "");
    setVacationType(v.vacation_type || "");
    setLink(v.link || "");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!startDate || !endDate) return;
    setSaving(true);
    try {
      const payload = {
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        location: location || null,
        people: people || null,
        title: title || null,
        notes: notes || null,
        accommodation: accommodation || null,
        vacation_type: vacationType || null,
        link: link || null,
      };
      if (editingId) {
        await updateVacation(editingId, payload);
        onVacationChange("Urlaub aktualisiert.");
      } else {
        await createVacation(payload);
        onVacationChange("Urlaub erstellt.");
      }
      closeDialog();
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
      onError("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Urlaub wirklich löschen?")) return;
    try {
      await deleteVacation(id);
      onVacationChange("Urlaub gelöscht.");
    } catch (e) {
      console.error("Fehler beim Löschen:", e);
      onError("Fehler beim Löschen.");
    }
  };

  const handleShareVacation = async (vacation) => {
    try {
      const response = await createShareLink(vacation.id);
      const shareUrl = `${window.location.origin}/calendar?vacationShare=${response.share_code}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        onVacationChange("Link wurde in die Zwischenablage kopiert!");
      }).catch((err) => {
        console.error("Fehler beim Kopieren:", err);
        onError("Fehler beim Kopieren des Links");
      });
    } catch (error) {
      console.error("Fehler beim Erstellen des Share-Links:", error);
      onError("Fehler beim Erstellen des Share-Links");
    }
  };

  const handleExportToGoogleCalendar = (vacation) => {
    const startDate = dayjs(vacation.start_date).format('YYYYMMDD');
    const endDate = dayjs(vacation.end_date).add(1, 'day').format('YYYYMMDD');
    
    const title = vacation.location ? `Urlaub in ${vacation.location}` : 'Urlaub';
    let description = '';
    
    if (vacation.people) {
      description += `Personen: ${vacation.people}\n`;
    }
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
    
    window.open(googleCalendarUrl, '_blank');
    onVacationChange("Google Calendar geöffnet!");
  };

  const handleDownloadICS = (vacation) => {
    const startDate = dayjs(vacation.start_date).format('YYYYMMDD');
    const endDate = dayjs(vacation.end_date).add(1, 'day').format('YYYYMMDD');
    const now = dayjs().format('YYYYMMDDTHHmmss');
    
    const title = vacation.location ? `Urlaub in ${vacation.location}` : 'Urlaub';
    let description = '';
    
    if (vacation.people) {
      description += `Personen: ${vacation.people}\\n`;
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
    link.download = `urlaub_${vacation.start_date}.ics`;
    link.click();
    
    onVacationChange(".ics Datei heruntergeladen!");
  };

  const handleOpenCalendarMenu = (event, vacation) => {
    setCalendarMenuAnchor(event.currentTarget);
    setSelectedVacationForExport(vacation);
  };

  const handleCloseCalendarMenu = () => {
    setCalendarMenuAnchor(null);
    setSelectedVacationForExport(null);
  };

  const displayTitle = (v) => v.title || v.location || "Urlaub";
  const formatDate = (d) => dayjs(d).format("DD.MM.YYYY");

  // Sortiere Urlaube nach Startdatum aufsteigend
  const sortedVacations = [...vacations].sort((a, b) => 
    new Date(a.start_date) - new Date(b.start_date)
  );

  // Filtere vergangene Urlaube, wenn aktiviert
  const today = dayjs().startOf('day');
  const filteredVacations = showPastVacations 
    ? sortedVacations 
    : sortedVacations.filter(v => dayjs(v.end_date).isAfter(today) || dayjs(v.end_date).isSame(today, 'day'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Typography variant="h6">Meine Urlaube</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button 
              variant={showPastVacations ? "outlined" : "contained"} 
              onClick={() => setShowPastVacations(!showPastVacations)}
              size="small"
            >
              {showPastVacations ? "Vergangene ausblenden" : "Vergangene einblenden"}
            </Button>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openAddDialog}>
              Urlaub hinzufügen
            </Button>
          </Box>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : vacations.length === 0 ? (
          <Typography color="text.secondary">Keine Urlaube. Füge einen hinzu.</Typography>
        ) : filteredVacations.length === 0 ? (
          <Typography color="text.secondary">Keine {showPastVacations ? "" : "zukünftigen "}Urlaube vorhanden.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Von</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Bis</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Titel / Ort</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Personen</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Unterkunft</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Notizen</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }} align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVacations.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{formatDate(v.start_date)}</TableCell>
                    <TableCell>{formatDate(v.end_date)}</TableCell>
                    <TableCell>{displayTitle(v)}</TableCell>
                    <TableCell>{v.people || "–"}</TableCell>
                    <TableCell>{v.accommodation || "–"}</TableCell>
                    <TableCell>{v.notes || "–"}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenCalendarMenu(e, v)} title="Zu Kalender hinzufügen">
                        <CalendarMonthIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleShareVacation(v)} title="Urlaub teilen">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => openEditDialog(v)} title="Bearbeiten">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(v.id)} title="Löschen" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? "Urlaub bearbeiten" : "Urlaub hinzufügen"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <DatePicker
                label="Startdatum"
                value={startDate}
                onChange={(d) => setStartDate(d)}
                slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
              />
              <DatePicker
                label="Enddatum"
                value={endDate}
                onChange={(d) => setEndDate(d)}
                minDate={startDate}
                slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
              />
              <TextField label="Titel" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth variant="outlined" placeholder="z.B. Sommerurlaub 2025" />
              <TextField label="Ort" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth variant="outlined" placeholder="z.B. Mallorca, Berlin" />
              <TextField label="Personen" value={people} onChange={(e) => setPeople(e.target.value)} fullWidth variant="outlined" placeholder="z.B. Familie, Partner" />
              <TextField label="Unterkunft" value={accommodation} onChange={(e) => setAccommodation(e.target.value)} fullWidth variant="outlined" placeholder="z.B. Hotel XY, Ferienwohnung" />
              <FormControl fullWidth>
                <InputLabel>Art des Urlaubs</InputLabel>
                <Select value={vacationType} onChange={(e) => setVacationType(e.target.value)} label="Art des Urlaubs">
                  {VACATION_TYPES.map((t) => (
                    <MenuItem key={t || "empty"} value={t}>{t || "–"}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Link / URL" value={link} onChange={(e) => setLink(e.target.value)} fullWidth variant="outlined" placeholder="z.B. Buchungslink" />
              <TextField label="Notizen" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth variant="outlined" multiline rows={3} placeholder="Aktivitäten, Besonderheiten …" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Abbrechen</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!startDate || !endDate || saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
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
      </Box>
    </LocalizationProvider>
  );
}

export default VacationList;
