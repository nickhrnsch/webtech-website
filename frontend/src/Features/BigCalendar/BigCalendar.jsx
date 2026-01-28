import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Calendar as RBCalendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { listVacations } from "../../services/vacationService";

dayjs.locale("de");

const localizer = dayjsLocalizer(dayjs);

const messages = {
  today: "Heute",
  previous: "Zurück",
  next: "Weiter",
  month: "Monat",
  week: "Woche",
  day: "Tag",
  agenda: "Agenda",
  date: "Datum",
  time: "Zeit",
  event: "Termin",
  noEventsInRange: "Keine Termine in diesem Zeitraum.",
};

function BigCalendar() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [vacations, setVacations] = useState([]);
  const [showVacations, setShowVacations] = useState(true);

  // Lade Urlaube beim Mount
  useEffect(() => {
    async function loadVacations() {
      try {
        const data = await listVacations();
        setVacations(data);
      } catch (error) {
        console.error("Fehler beim Laden der Urlaube:", error);
      }
    }
    
    loadVacations();
  }, []);

  // Mappe Urlaube zu Kalender-Events
  const events = useMemo(() => {
    if (!showVacations) {
      return [];
    }
    
    return vacations.map(vacation => {
      const startDate = dayjs(vacation.start_date).toDate();
      // Add 1 day to end_date for correct display (react-big-calendar expects exclusive end for allDay events)
      const endDate = dayjs(vacation.end_date).add(1, 'day').toDate();
      
      return {
        title: vacation.location ? `Urlaub: ${vacation.location}` : 'Urlaub',
        start: startDate,
        end: endDate,
        allDay: true,
        resource: {
          type: 'vacation',
          vacationId: vacation.id,
          location: vacation.location,
          people: vacation.people,
        }
      };
    });
  }, [vacations, showVacations]);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleSelectSlot = useCallback((slotInfo) => {
    console.log("Zeitslot ausgewählt:", slotInfo);
    // Hier später Dialog zum Erstellen eines neuen Events öffnen
  }, []);

  const handleSelectEvent = useCallback((event) => {
    console.log("Event ausgewählt:", event);
    // Hier später Dialog zum Bearbeiten des Events öffnen
  }, []);

  return (
    <div className="big-calendar-wrapper">
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={showVacations}
            onChange={(e) => setShowVacations(e.target.checked)}
          />
          {" "}Urlaube anzeigen
        </label>
      </div>
      <RBCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        style={{ height: "100%", minHeight: "600px", width: "100%" }}
        messages={messages}
      />
    </div>
  );
}

export default BigCalendar;

