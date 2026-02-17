import React, { useState, useEffect } from "react";
import { listVacations } from "../../services/vacationService";
import dayjs from "dayjs";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

function UpcomingVacationsWidget({ vacations: externalVacations, refreshTrigger, onDateClick }) {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVacations() {
      try {
        const data = await listVacations();
        // Filter upcoming vacations (start_date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = data
          .filter(v => new Date(v.start_date) >= today)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        setVacations(upcoming);
      } catch (error) {
        console.error("Fehler beim Laden der Urlaube:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadVacations();
  }, [refreshTrigger, externalVacations]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (vacations.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Kommende Urlaube
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Keine kommenden Urlaube geplant.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Kommende Urlaube
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Von</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Bis</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Titel / Ort</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: (t) => t.palette.mode === "dark" ? t.palette.grey[800] : t.palette.grey[200] }}>Personen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vacations.map((vacation) => {
              const startDate = new Date(vacation.start_date);
              const endDate = new Date(vacation.end_date);
              
              return (
                <TableRow 
                  key={vacation.id} 
                  hover
                  onClick={() => onDateClick && onDateClick(dayjs(vacation.start_date))}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    {startDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    {endDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </TableCell>
                  <TableCell>{vacation.title || vacation.location || '-'}</TableCell>
                  <TableCell>{vacation.people || '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UpcomingVacationsWidget;
