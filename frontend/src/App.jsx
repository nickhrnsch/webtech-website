import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeWrapper } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./Layout/Sidebar/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Calendar from "./pages/Calendar.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import VacationPlan from "./pages/VacationPlan.jsx";

function App() {
  return (
    <ThemeWrapper>
      <AuthProvider>
        <ProtectedRoute>
          <Router>
            <div className="app-container">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/vacation-plan" element={<VacationPlan />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ProtectedRoute>
      </AuthProvider>
    </ThemeWrapper>
  );
}

export default App;
