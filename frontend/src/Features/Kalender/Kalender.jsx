import React, { useState } from 'react';
import './Kalender.css';

function Kalender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const today = new Date();
    
    // Leere Zellen für Tage vor dem ersten Tag des Monats
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="kalender-day empty"></div>);
    }
    
    // Tage des Monats rendern
    for (let day = 1; day <= totalDays; day++) {
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      
      days.push(
        <div key={day} className={`kalender-day ${isToday ? 'today' : ''}`}>
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="kalender-widget">
      <div className="kalender-header">
        <button onClick={previousMonth} className="kalender-nav-button">‹</button>
        <h3 className="kalender-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="kalender-nav-button">›</button>
      </div>
      
      <div className="kalender-weekdays">
        {dayNames.map((day, index) => (
          <div key={index} className="kalender-weekday">{day}</div>
        ))}
      </div>
      
      <div className="kalender-days">
        {renderCalendar()}
      </div>
    </div>
  );
}

export default Kalender;