import { useState, useEffect, useCallback } from "react";
import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";
import VacationList from "../Features/VacationPlan/VacationList";
import HistoricalWeather from "../Features/VacationPlan/HistoricalWeather";
import VacationMaps from "../Features/VacationPlan/VacationMaps";
import { listVacations } from "../services/vacationService";
import { Box, Snackbar } from "@mui/material";

function VacationPlan() {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

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

  const handleVacationChange = (message) => {
    setSnackbar({ open: true, message });
    loadVacations();
  };

  const handleError = (message) => {
    setSnackbar({ open: true, message });
  };

  return (
    <Fenster title="Urlaubsplanung">
      <Box className="vacation-plan-layout" sx={{ columnSpan: "all", display: "flex", flexDirection: "column", gap: 2 }}>
        <Widget className="vacation-list-widget">
          <VacationList
            vacations={vacations}
            loading={loading}
            error={error}
            onVacationChange={handleVacationChange}
            onError={handleError}
          />
        </Widget>

        <Box className="vacation-plan-maps-row" sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ flex: 3, minWidth: 400, maxWidth: "100%", alignSelf: "flex-start" }}>
            <Widget className="historical-weather-widget">
              <HistoricalWeather vacations={vacations} />
            </Widget>
          </Box>
          <Box sx={{ flex: 7, minWidth: 400, maxWidth: "100%" }}>
            <Widget className="maps-widget maps-widget-compact">
              <VacationMaps vacations={vacations} />
            </Widget>
          </Box>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} message={snackbar.message} />
    </Fenster>
  );
}

export default VacationPlan;
