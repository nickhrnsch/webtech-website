import * as React from 'react';
import dayjs from 'dayjs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import EventIcon from '@mui/icons-material/Event';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Deutsche Feiertage
const holidays = [
  { date: "2026-01-01", name: "Neujahr" },
  { date: "2026-04-03", name: "Karfreitag" },
  { date: "2026-04-06", name: "Ostermontag" },
  { date: "2026-05-01", name: "Tag der Arbeit" },
  { date: "2026-05-14", name: "Christi Himmelfahrt" },
  { date: "2026-05-25", name: "Pfingstmontag" },
  { date: "2026-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2026-12-25", name: "1. Weihnachtstag" },
  { date: "2026-12-26", name: "2. Weihnachtstag" },
];

export default function NextEventsList({ vacations = [], onDateClick }) {
  const getNextEvents = () => {
    const today = dayjs();
    const upcomingEvents = [];

    // Urlaube hinzufügen
    vacations.forEach((vacation) => {
      const startDate = dayjs(vacation.startDate);
      if (startDate.isAfter(today) || startDate.isSame(today, 'day')) {
        upcomingEvents.push({
          id: `vacation-${vacation.id}`,
          title: vacation.location ? `🏖️ Urlaub: ${vacation.location}` : '🏖️ Urlaub',
          date: startDate.format('DD.MM.YYYY'),
          sortDate: startDate,
          type: 'vacation',
          icon: 'vacation'
        });
      }
    });

    // Feiertage hinzufügen
    holidays.forEach((holiday) => {
      const holidayDate = dayjs(holiday.date);
      if (holidayDate.isAfter(today) || holidayDate.isSame(today, 'day')) {
        upcomingEvents.push({
          id: `holiday-${holiday.date}`,
          title: holiday.name,
          date: holidayDate.format('DD.MM.YYYY'),
          sortDate: holidayDate,
          type: 'holiday',
          icon: 'event'
        });
      }
    });

    // Nach Datum sortieren und nur die nächsten 3 nehmen
    return upcomingEvents
      .sort((a, b) => a.sortDate.unix() - b.sortDate.unix())
      .slice(0, 3);
  };

  const events = getNextEvents();

  return (
    <Paper elevation={0} sx={{ p: 2, maxWidth: 350, margin: '20px auto',  borderRadius: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ fontSize: '1rem' }}>
        Nächste Events
      </Typography>
      <List>
        {events.length > 0 ? (
          events.map((event, index) => (
            <React.Fragment key={event.id}>
              <ListItem 
                sx={{ 
                  py: 0.5,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                onClick={() => onDateClick && onDateClick(event.sortDate)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {event.icon === 'vacation' ? (
                    <BeachAccessIcon color="primary" fontSize="small" />
                  ) : (
                    <EventIcon color="primary" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={event.date}
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
              {index < events.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="Keine Events geplant"
              primaryTypographyProps={{ fontSize: '0.875rem', color: 'text.secondary' }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
