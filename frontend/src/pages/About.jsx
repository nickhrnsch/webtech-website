import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";

function About() {
  return (
    <Fenster title="Über uns">
      <Widget>
        <div style={{ padding: '20px' }}>
          <h2>Über den Urlaubsplaner</h2>
          <p>
            Willkommen beim Urlaubsplaner! Diese Anwendung hilft Ihnen dabei, 
            Ihre Urlaube und Events zu planen und zu organisieren.
          </p>
          <h3>Features:</h3>
          <ul>
            <li>📅 Interaktiver Kalender</li>
            <li>🏖️ Urlaubsplanung mit Wettervorhersage</li>
            <li>📝 Notizen für jeden Tag</li>
            <li>🎉 Übersicht der nächsten Events</li>
            <li>💱 Währungsrechner</li>
          </ul>
        </div>
      </Widget>
    </Fenster>
  );
}

export default About;
