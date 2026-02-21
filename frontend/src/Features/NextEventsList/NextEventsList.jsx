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
import { fetchPublicHolidaysForYears, getDefaultHolidayYears } from '../../services/holidayService';

export default function NextEventsList({ vacations = [], onDateClick }) {
  const [holidays, setHolidays] = React.useState([]);

  React.useEffect(() => {
    let isCancelled = false;

    async function loadHolidays() {
      try {
        const years = getDefaultHolidayYears(dayjs().year());
        const loadedHolidays = await fetchPublicHolidaysForYears(years);
        if (!isCancelled) {
          setHolidays(loadedHolidays);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Feiertage:', error);
      }
    }

    loadHolidays();

    return () => {
      isCancelled = true;
    };
  }, []);

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
