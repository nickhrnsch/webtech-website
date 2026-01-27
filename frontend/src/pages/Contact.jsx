import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";

function Contact() {
  return (
    <Fenster title="Kontakt">
      <Widget>
        <div style={{ padding: '20px' }}>
          <h2>Kontaktieren Sie uns</h2>
          <p>Haben Sie Fragen oder Anregungen? Wir freuen uns über Ihre Nachricht!</p>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Kontaktinformationen</h3>
            <p><strong>Email:</strong> info@urlaubsplaner.de</p>
            <p><strong>Telefon:</strong> +49 123 456789</p>
            <p><strong>Adresse:</strong> Musterstraße 123, 12345 Musterstadt</p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>Öffnungszeiten</h3>
            <p>Montag - Freitag: 9:00 - 17:00 Uhr</p>
            <p>Samstag - Sonntag: Geschlossen</p>
          </div>
        </div>
      </Widget>
    </Fenster>
  );
}

export default Contact;
