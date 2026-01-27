import "./App.css";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./Layout/Sidebar/Sidebar.jsx";
import Fenster from "./Layout/Fenster/Fenster";
import Widget from "./Layout/Widgets/Widget";
import MUICalender from "./Features/MUICalendar/Calendar.jsx";
import CurrencyConverter from "./Features/CurrencyConverter/CurrencyConverter.jsx";
import NextEventsList from "./Features/NextEventsList/NextEventsList.jsx";

function App() {
  const [vacations, setVacations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="app-container">
          <Sidebar />

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

            <Widget className="currency-widget">
              <CurrencyConverter />
            </Widget>

            <Widget title="Meine Textwidget 2" text="Hier steht ein Text" />

            {/* oder andere Widgets */}
          </Fenster>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
