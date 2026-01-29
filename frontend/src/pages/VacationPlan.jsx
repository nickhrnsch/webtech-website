import { useState, useEffect, useCallback } from "react";
import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";
import GoogleMaps from "../Features/GoogleMaps/GoogleMaps";
import {
  listVacations,
  createVacation,
  updateVacation,
  deleteVacation,
} from "../services/vacationService";
import { getHistoricalForLocation } from "../services/historicalWeatherService";
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
  Snackbar,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de";

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

function VacationPlan() {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [vacationType, setVacationType] = useState("");
  const [link, setLink] = useState("");

  const [histLocation, setHistLocation] = useState("");
  const [histStart, setHistStart] = useState(dayjs().month(7).date(15));
  const [histEnd, setHistEnd] = useState(dayjs().month(7).date(22));
  const [histYearFrom, setHistYearFrom] = useState(2020);
  const [histYearTo, setHistYearTo] = useState(2024);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);
  const [histResult, setHistResult] = useState(null);

  const loadVacations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listVacations();
      setVacations(data);
    } catch (e) {
      console.error("Fehler beim Laden der Urlaube:", e);
      setError("Urlaube konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVacations();
  }, [loadVacations]);

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
        setSnackbar({ open: true, message: "Urlaub aktualisiert." });
      } else {
        await createVacation(payload);
        setSnackbar({ open: true, message: "Urlaub erstellt." });
      }
      closeDialog();
      await loadVacations();
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
      setSnackbar({ open: true, message: "Fehler beim Speichern." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Urlaub wirklich löschen?")) return;
    try {
      await deleteVacation(id);
      setSnackbar({ open: true, message: "Urlaub gelöscht." });
      await loadVacations();
    } catch (e) {
      console.error("Fehler beim Löschen:", e);
      setSnackbar({ open: true, message: "Fehler beim Löschen." });
    }
  };

  const loadHistoricalWeather = async () => {
    if (!histLocation.trim() || !histStart || !histEnd) return;
    const yFrom = Math.min(histYearFrom, histYearTo);
    const yTo = Math.max(histYearFrom, histYearTo);
    const years = [];
    for (let y = yFrom; y <= yTo; y++) years.push(y);
    if (years.length === 0) return;
    setHistLoading(true);
    setHistError(null);
    setHistResult(null);
    try {
      const r = await getHistoricalForLocation(
        histLocation.trim(),
        histStart.format("YYYY-MM-DD"),
        histEnd.format("YYYY-MM-DD"),
        years
      );
      setHistResult(r);
    } catch (e) {
      console.error("Historisches Wetter:", e);
      setHistError(e.message || "Fehler beim Laden.");
    } finally {
      setHistLoading(false);
    }
  };

  const displayTitle = (v) => v.title || v.location || "Urlaub";
  const formatDate = (d) => dayjs(d).format("DD.MM.YYYY");

  const vacationsForMaps = vacations.map((v) => ({
    ...v,
    startDate: v.start_date,
    endDate: v.end_date,
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Fenster title="Urlaub planen">
        <Box className="vacation-plan-layout" sx={{ columnSpan: "all", display: "flex", flexDirection: "column", gap: 2 }}>
          <Widget className="vacation-list-widget">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Typography variant="h6">Meine Urlaube</Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openAddDialog}>
                Urlaub hinzufügen
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
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
          </Widget>

          <Box className="vacation-plan-maps-row" sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "0 0 360px", minWidth: 320, maxWidth: "100%", alignSelf: "flex-start" }}>
            <Widget className="historical-weather-widget">
              <Typography variant="h6" sx={{ mb: 1 }}>Historisches Wetter</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Typisches Wetter für Ort und Zeitraum in den gewählten Jahren.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Ort"
                  value={histLocation}
                  onChange={(e) => setHistLocation(e.target.value)}
                  variant="outlined"
                  placeholder="z.B. Mallorca, Berlin"
                  size="small"
                  fullWidth
                />
                <DatePicker
                  label="Startdatum (Monat/Tag)"
                  value={histStart}
                  onChange={(d) => setHistStart(d)}
                  slotProps={{ textField: { fullWidth: true, variant: "outlined", size: "small" } }}
                />
                <DatePicker
                  label="Enddatum"
                  value={histEnd}
                  onChange={(d) => setHistEnd(d)}
                  minDate={histStart}
                  slotProps={{ textField: { fullWidth: true, variant: "outlined", size: "small" } }}
                />
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                  <TextField
                    label="Von Jahr"
                    type="number"
                    value={histYearFrom}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) setHistYearFrom(Math.max(1940, Math.min(new Date().getFullYear(), v)));
                    }}
                    inputProps={{ min: 1940, max: new Date().getFullYear() }}
                    size="small"
                    sx={{ width: 110 }}
                  />
                  <TextField
                    label="Bis Jahr"
                    type="number"
                    value={histYearTo}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) setHistYearTo(Math.max(1940, Math.min(new Date().getFullYear(), v)));
                    }}
                    inputProps={{ min: 1940, max: new Date().getFullYear() }}
                    size="small"
                    sx={{ width: 110 }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={histLoading ? <CircularProgress size={18} color="inherit" /> : <WbSunnyIcon />}
                  onClick={loadHistoricalWeather}
                  disabled={!histLocation.trim() || !histStart || !histEnd || histLoading}
                >
                  Historisches Wetter laden
                </Button>
              </Box>
              {histError && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setHistError(null)}>
                  {histError}
                </Alert>
              )}
              {histResult && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {histResult.locationName} · {histResult.yearsUsed.join(", ")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label={`Ø Max ${histResult.avgMaxTemp != null ? histResult.avgMaxTemp.toFixed(1) : "–"} °C`} color="primary" size="small" />
                    <Chip label={`Ø Min ${histResult.avgMinTemp != null ? histResult.avgMinTemp.toFixed(1) : "–"} °C`} variant="outlined" size="small" />
                    <Chip label={`Ø Niederschlag ${histResult.avgPrecip != null ? histResult.avgPrecip.toFixed(1) : "–"} mm`} variant="outlined" size="small" />
                    <Chip label={histResult.typicalWeatherLabel} variant="outlined" size="small" />
                  </Box>
                </Box>
              )}
            </Widget>
            </Box>
            <Box sx={{ flex: "1 1 400px", minWidth: 320, maxWidth: 900 }}>
              <Widget className="maps-widget maps-widget-compact">
                <Typography variant="h6" sx={{ mb: 2 }}>Karte & Orte</Typography>
                <Box sx={{ width: "100%", height: 600 }}>
                  <GoogleMaps vacations={vacationsForMaps} />
                </Box>
              </Widget>
            </Box>
          </Box>
        </Box>

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

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} message={snackbar.message} />
      </Fenster>
    </LocalizationProvider>
  );
}

export default VacationPlan;
