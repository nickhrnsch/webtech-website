import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";

function Contact() {
  return (
    <Fenster title="Kontakt">
      <Widget className="widget-fullspace">
        <div style={{ padding: '20px' }}>
          <h2>Kontaktieren Sie uns</h2>
          <p>
            Haben Sie Fragen, Anregungen oder benötigen Sie Unterstützung bei der Nutzung 
            des Urlaubsplaners? Wir freuen uns über Ihre Nachricht und helfen Ihnen gerne weiter!
          </p>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Kontaktinformationen</h3>
            <p>
              Unser Support-Team steht Ihnen bei technischen Fragen, Feature-Wünschen 
              oder allgemeinen Anliegen zur Verfügung.
            </p>
            <p><strong>Email:</strong> holilingo.kontakt@gmail.com</p>
            <p><strong>Adresse:</strong> Toulouser Allee 53, 40476 Düsseldorf</p>
          </div>
        </div>
      </Widget>
    </Fenster>
  );
}

export default Contact;
