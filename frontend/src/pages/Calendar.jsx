import { useState, useEffect } from "react";
import Fenster from "../Layout/Fenster/Fenster";
import BigCalendar from "../Features/BigCalendar/BigCalendar.jsx";
import { acceptShareCode } from "../services/vacationService";

const styles = `
.calendar-share-section {
  margin-bottom: 16px;
  padding: 12px;
  background-color: var(--theme-background-paper, #f5f5f5);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: var(--theme-text-primary, #000);
}

[data-theme="dark"] .calendar-share-section {
  border-color: rgba(255, 255, 255, 0.12);
}

.share-input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.share-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  font-size: 14px;
  min-width: 0;
  background: var(--theme-background-default, #fff);
  color: var(--theme-text-primary, #000);
}

[data-theme="dark"] .share-input {
  border-color: rgba(255, 255, 255, 0.23);
}

.share-input:focus {
  outline: none;
  border-color: var(--theme-primary, #00796B);
  box-shadow: 0 0 0 2px rgba(var(--theme-primary-rgb, 0, 121, 107), 0.2);
}

.share-accept-button {
  padding: 8px 16px;
  background-color: var(--theme-primary, #00796B);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  font-weight: 500;
  transition: background-color 0.2s;
}

.share-accept-button:hover {
  background-color: var(--theme-primary-dark, #004C40);
}

.share-accept-button:active {
  filter: brightness(0.9);
}

.share-message {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: rgba(var(--theme-primary-rgb, 0, 121, 107), 0.12);
  color: var(--theme-primary, #00796B);
}

.share-message:first-letter {
  font-size: 16px;
}
`;

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
      <style>{styles}</style>
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
