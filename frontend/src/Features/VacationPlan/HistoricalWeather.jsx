import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { getHistoricalForLocation } from "../../services/historicalWeatherService";

function HistoricalWeather() {
  const [histLocation, setHistLocation] = useState("");
  const [histStart, setHistStart] = useState(dayjs().month(7).date(15));
  const [histEnd, setHistEnd] = useState(dayjs().month(7).date(22));
  const [histYearFrom, setHistYearFrom] = useState(2020);
  const [histYearTo, setHistYearTo] = useState(2024);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);
  const [histResult, setHistResult] = useState(null);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box>
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
      </Box>
    </LocalizationProvider>
  );
}

export default HistoricalWeather;
