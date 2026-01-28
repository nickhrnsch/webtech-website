import React, { useState, useMemo, useCallback } from "react";
import { Calendar as RBCalendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

  const events = useMemo(
    () => [
      {
        title: "Beispieltermin",
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        allDay: false,
      },
      {
        title: "Ganztägiger Event",
        start: new Date(new Date().setDate(new Date().getDate() + 3)),
        end: new Date(new Date().setDate(new Date().getDate() + 3)),
        allDay: true,
      },
      {
        title: "Meeting",
        start: new Date(new Date().setDate(new Date().getDate() - 2)),
        end: new Date(new Date().setDate(new Date().getDate() - 2)),
        allDay: false,
      },
    ],
    []
  );

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

