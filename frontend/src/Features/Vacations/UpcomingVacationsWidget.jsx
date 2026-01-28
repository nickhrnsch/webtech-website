import React, { useState, useEffect } from "react";
import { listVacations } from "../../services/vacationService";
import "./UpcomingVacationsWidget.css";

function UpcomingVacationsWidget() {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVacations() {
      try {
        const data = await listVacations();
        // Filter upcoming vacations (start_date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = data
          .filter(v => new Date(v.start_date) >= today)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        setVacations(upcoming);
      } catch (error) {
        console.error("Fehler beim Laden der Urlaube:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadVacations();
  }, []);

  if (loading) {
    return <div className="upcoming-vacations-widget">Lädt...</div>;
  }

  if (vacations.length === 0) {
    return (
      <div className="upcoming-vacations-widget">
        <h3>Kommende Urlaube</h3>
        <p className="no-vacations">Keine kommenden Urlaube geplant.</p>
      </div>
    );
  }

  return (
    <div className="upcoming-vacations-widget">
      <h3>Kommende Urlaube</h3>
      <div className="vacations-table-container">
        <table className="vacations-table">
          <thead>
            <tr>
              <th>Von</th>
              <th>Bis</th>
              <th>Ort</th>
              <th>Personen</th>
            </tr>
          </thead>
          <tbody>
            {vacations.map((vacation) => {
              const startDate = new Date(vacation.start_date);
              const endDate = new Date(vacation.end_date);
              
              return (
                <tr key={vacation.id}>
                  <td>{startDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td>{endDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td>{vacation.location || '-'}</td>
                  <td>{vacation.people || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpcomingVacationsWidget;
