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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de";
import {
  createVacation,
  updateVacation,
  deleteVacation,
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

  const displayTitle = (v) => v.title || v.location || "Urlaub";
  const formatDate = (d) => dayjs(d).format("DD.MM.YYYY");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Typography variant="h6">Meine Urlaube</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openAddDialog}>
            Urlaub hinzufügen
          </Button>
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
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Titel / Ort</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Von</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Bis</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Personen</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vacations.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{displayTitle(v)}</TableCell>
                    <TableCell>{formatDate(v.start_date)}</TableCell>
                    <TableCell>{formatDate(v.end_date)}</TableCell>
                    <TableCell>{v.people || "–"}</TableCell>
                    <TableCell align="right">
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
      </Box>
    </LocalizationProvider>
  );
}

export default VacationList;
