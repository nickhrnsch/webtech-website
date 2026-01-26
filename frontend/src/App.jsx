import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./Layout/Sidebar/Sidebar.jsx";
import Fenster from "./Layout/Fenster/Fenster";
import Widget from "./Layout/Widgets/Widget";
import MUICalender from "./Features/MUICalendar/Calendar.jsx";
import CurrencyConverter from "./Features/CurrencyConverter/CurrencyConverter.jsx";

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="app-container">
          <Sidebar />

          <Fenster title="Dashboard">
            <Widget className="calendar-widget">
              <MUICalender />
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
