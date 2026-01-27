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
export const holidays = [
  { date: "2026-01-01", name: "Neujahr" },
  { date: "2026-04-03", name: "Karfreitag" },
  { date: "2026-04-06", name: "Ostermontag" },
  { date: "2026-05-01", name: "Tag der Arbeit" },
  { date: "2026-05-14", name: "Christi Himmelfahrt" },
  { date: "2026-05-25", name: "Pfingstmontag" },
  { date: "2026-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2026-12-25", name: "1. Weihnachtstag" },
  { date: "2026-12-26", name: "2. Weihnachtstag" },
  { date: "2027-01-01", name: "Neujahr" },
  { date: "2027-03-26", name: "Karfreitag" },
  { date: "2027-03-29", name: "Ostermontag" },
  { date: "2027-05-01", name: "Tag der Arbeit" },
  { date: "2027-05-06", name: "Christi Himmelfahrt" },
  { date: "2027-05-17", name: "Pfingstmontag" },
  { date: "2027-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2027-12-25", name: "1. Weihnachtstag" },
  { date: "2027-12-26", name: "2. Weihnachtstag" },
  { date: "2028-01-01", name: "Neujahr" },
  { date: "2028-04-14", name: "Karfreitag" },
  { date: "2028-04-17", name: "Ostermontag" },
  { date: "2028-05-01", name: "Tag der Arbeit" },
  { date: "2028-05-25", name: "Christi Himmelfahrt" },
  { date: "2028-06-05", name: "Pfingstmontag" },
  { date: "2028-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2028-12-25", name: "1. Weihnachtstag" },
  { date: "2028-12-26", name: "2. Weihnachtstag" },
  { date: "2029-01-01", name: "Neujahr" },
  { date: "2029-03-30", name: "Karfreitag" },
  { date: "2029-04-02", name: "Ostermontag" },
  { date: "2029-05-01", name: "Tag der Arbeit" },
  { date: "2029-05-10", name: "Christi Himmelfahrt" },
  { date: "2029-05-21", name: "Pfingstmontag" },
  { date: "2029-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2029-12-25", name: "1. Weihnachtstag" },
  { date: "2029-12-26", name: "2. Weihnachtstag" },
  { date: "2030-01-01", name: "Neujahr" },
  { date: "2030-04-19", name: "Karfreitag" },
  { date: "2030-04-22", name: "Ostermontag" },
  { date: "2030-05-01", name: "Tag der Arbeit" },
  { date: "2030-05-30", name: "Christi Himmelfahrt" },
  { date: "2030-06-10", name: "Pfingstmontag" },
  { date: "2030-10-03", name: "Tag der Deutschen Einheit" },
  { date: "2030-12-25", name: "1. Weihnachtstag" },
  { date: "2030-12-26", name: "2. Weihnachtstag" },
];

export default function NextEventsList({ vacations = [], onDateClick }) {
  const getNextEvents = () => {
    const today = dayjs();
    const eventsList = [];
    
    // 1. Heutiger Tag (immer als erstes)
    const todayEvents = [];
    
    // Prüfe ob heute ein Urlaub ist
    vacations.forEach((vacation) => {
      const startDate = dayjs(vacation.startDate);
      const endDate = dayjs(vacation.endDate);
      if (today.isSame(startDate, 'day') || (today.isAfter(startDate) && today.isBefore(endDate)) || today.isSame(endDate, 'day')) {
        todayEvents.push({
          type: 'vacation',
          title: vacation.location ? `🏖️ Urlaub: ${vacation.location}` : '🏖️ Urlaub',
          icon: 'vacation'
        });
      }
    });
    
    // Prüfe ob heute ein Feiertag ist
    holidays.forEach((holiday) => {
      const holidayDate = dayjs(holiday.date);
      if (today.isSame(holidayDate, 'day')) {
        todayEvents.push({
          type: 'holiday',
          title: holiday.name,
          icon: 'event'
        });
      }
    });
    
    // Füge heutigen Tag hinzu
    eventsList.push({
      id: 'today',
      title: todayEvents.length > 0 ? todayEvents[0].title : 'Heute',
      date: today.format('DD.MM.YYYY'),
      sortDate: today,
      type: todayEvents.length > 0 ? todayEvents[0].type : 'today',
      icon: todayEvents.length > 0 ? todayEvents[0].icon : 'event',
      isToday: true,
      noEvent: todayEvents.length === 0
    });

    // 2. Zukünftige Events sammeln
    const upcomingEvents = [];

    // Urlaube hinzufügen
    vacations.forEach((vacation) => {
      const startDate = dayjs(vacation.startDate);
      if (startDate.isAfter(today, 'day')) {
        upcomingEvents.push({
          id: `vacation-${vacation.id}`,
          title: vacation.location ? `🏖️ Urlaub: ${vacation.location}` : '🏖️ Urlaub',
          date: startDate.format('DD.MM.YYYY'),
          sortDate: startDate,
          type: 'vacation',
          icon: 'vacation',
          isToday: false
        });
      }
    });

    // Feiertage hinzufügen
    holidays.forEach((holiday) => {
      const holidayDate = dayjs(holiday.date);
      if (holidayDate.isAfter(today, 'day')) {
        upcomingEvents.push({
          id: `holiday-${holiday.date}`,
          title: holiday.name,
          date: holidayDate.format('DD.MM.YYYY'),
          sortDate: holidayDate,
          type: 'holiday',
          icon: 'event',
          isToday: false
        });
      }
    });

    // Nach Datum sortieren und die nächsten 3 nehmen
    const sortedUpcoming = upcomingEvents
      .sort((a, b) => a.sortDate.unix() - b.sortDate.unix())
      .slice(0, 3);
    
    return [...eventsList, ...sortedUpcoming];
  };

  const events = getNextEvents();

  return (
    <Paper elevation={0} sx={{ p: 2, minWidth: 200, maxWidth: 350, margin: '20px auto',  borderRadius: 1 }}>
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
                  secondary={event.noEvent ? `${event.date} - Keine Ereignisse` : event.date}
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
