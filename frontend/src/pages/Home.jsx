import { useState } from "react";
import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";
import MUICalender from "../Features/MUICalendar/Calendar.jsx";
import CurrencyConverter from "../Features/CurrencyConverter/CurrencyConverter.jsx";
import NextEventsList from "../Features/NextEventsList/NextEventsList.jsx";
import GoogleMaps from "../Features/GoogleMaps/GoogleMaps.jsx";

function Home() {
  const [vacations, setVacations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <Fenster title="Dashboard">
      <Widget className="calendar-widget">
        <div className="calendar-events-container">
          <MUICalender 
            onVacationsChange={setVacations} 
            selectedDate={selectedDate} 
            onDateChange={handleDateClick}
          />
          <NextEventsList vacations={vacations} onDateClick={handleDateClick} />
        </div>
      </Widget>

      <Widget className="maps-widget">
        <GoogleMaps />
      </Widget>


      <Widget className="currency-widget">
        <CurrencyConverter />
      </Widget>

      
    </Fenster>
  );
}

export default Home;
