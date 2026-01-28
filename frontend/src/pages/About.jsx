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
          <h3>Wie lege ich Urlaube an?</h3>
          <ol>
            <li>Öffne das Dashboard (Startseite) und nutze den MUI-Kalender.</li>
            <li>Klicke auf das Startdatum im Kalender und wähle „Urlaub erstellen“.</li>
            <li>Trage Zeitraum, Ort und Personen ein und speichere den Urlaub.</li>
            <li>Der Urlaub erscheint anschließend im kleinen Kalender auf dem Dashboard und im großen Kalender unter „Kalender“.</li>
          </ol>
          <h3>Wie teile ich einen Urlaub?</h3>
          <ol>
            <li>Öffne das Dashboard und klicke auf einen Tag, an dem bereits ein Urlaub eingetragen ist.</li>
            <li>Wähle in der Urlaub-Detailansicht das Teilen-Symbol (↗).</li>
            <li>Der Share-Link wird automatisch in die Zwischenablage kopiert.</li>
            <li>Sende diesen Link an andere Benutzer, die im Urlaubsplaner eingeloggt sind.</li>
            <li>Empfänger können den Link direkt öffnen oder den Code/Link auf der „Kalender“-Seite im Feld „Urlaub hinzufügen“ einfügen.</li>
            <li>Nach dem Bestätigen wird der Urlaub für den Empfänger übernommen und im Kalender angezeigt.</li>
          </ol>
        </div>
      </Widget>
    </Fenster>
  );
}

export default About;
