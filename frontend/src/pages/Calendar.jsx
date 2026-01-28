import { useState, useEffect } from "react";
import Fenster from "../Layout/Fenster/Fenster";
import BigCalendar from "../Features/BigCalendar/BigCalendar.jsx";
import { acceptShareCode } from "../services/vacationService";
import "./CalendarPage.css";

function Calendar() {
  const [shareInput, setShareInput] = useState("");
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Automatisches Akzeptieren von Share-Codes aus der URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('vacationShare');
    
    if (shareCode) {
      handleAcceptShare(shareCode);
      // URL Parameter entfernen nach dem Accept
      window.history.replaceState({}, '', '/calendar');
    }
  }, []);

  const handleAcceptShare = async (code) => {
    if (!code || code.trim() === '') {
      setMessage("Bitte gib einen gültigen Share-Code oder Link ein.");
      return;
    }

    // Extract share code from URL if full link was pasted
    let shareCode = code.trim();
    if (shareCode.includes('vacationShare=')) {
      const match = shareCode.match(/vacationShare=([^&]+)/);
      if (match) {
        shareCode = match[1];
      }
    }

    try {
      await acceptShareCode(shareCode);
      setMessage("✓ Urlaub erfolgreich geteilt!");
      setShareInput("");
      // Trigger refresh of BigCalendar
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Fehler beim Akzeptieren des Share-Codes:", error);
      setMessage("✗ Fehler: Ungültiger Share-Code oder Urlaub bereits geteilt.");
    }
  };

  return (
    <Fenster title="Kalender">
      <div className="calendar-share-section">
        <div className="share-input-container">
          <input
            type="text"
            placeholder="Share-Code oder Link hier eingeben..."
            value={shareInput}
            onChange={(e) => setShareInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAcceptShare(shareInput);
              }
            }}
            className="share-input"
          />
          <button 
            onClick={() => handleAcceptShare(shareInput)}
            className="share-accept-button"
          >
            Urlaub hinzufügen
          </button>
        </div>
        {message && <div className="share-message">{message}</div>}
      </div>
      <BigCalendar key={refreshKey} />
    </Fenster>
  );
}

export default Calendar;
