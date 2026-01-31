import { Box, Typography } from "@mui/material";
import GoogleMaps from "../GoogleMaps/GoogleMaps";

function VacationMaps({ vacations }) {
  const vacationsForMaps = vacations.map((v) => ({
    ...v,
    startDate: v.start_date,
    endDate: v.end_date,
  }));

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Karte & Orte</Typography>
      <Box sx={{ width: "100%", height: 600 }}>
        <GoogleMaps vacations={vacationsForMaps} />
      </Box>
    </Box>
  );
}

export default VacationMaps;
