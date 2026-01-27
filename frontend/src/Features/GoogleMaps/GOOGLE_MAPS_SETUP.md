# Google Maps API Einrichtung

## 1. Google Maps API-Schlüssel erhalten

### Schritte:
1. Besuchen Sie [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus
3. Aktivieren Sie folgende APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

4. Erstellen Sie einen API-Schlüssel:
   - Gehen Sie zu "APIs & Dienste" > "Anmeldedaten"
   - Klicken Sie auf "Anmeldedaten erstellen" > "API-Schlüssel"
   - Kopieren Sie den generierten Schlüssel

5. (Optional) Beschränken Sie den API-Schlüssel:
   - Klicken Sie auf den Schlüssel
   - Unter "API-Beschränkungen" wählen Sie die aktivierten APIs aus
   - Unter "Anwendungsbeschränkungen" können Sie HTTP-Referrer hinzufügen

## 2. API-Schlüssel in die Anwendung einfügen

Öffnen Sie `src/Features/GoogleMaps/GoogleMaps.jsx` und ersetzen Sie:

```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```

mit Ihrem echten API-Schlüssel:

```javascript
const GOOGLE_MAPS_API_KEY = 'AIzaSyD...Ihr_echter_Schlüssel...';
```

## 3. Komponente in die App integrieren

### Neue Seite erstellen (z.B. für Maps):

Erstellen Sie `src/pages/Maps.jsx`:

```jsx
import Fenster from "../Layout/Fenster/Fenster";
import Widget from "../Layout/Widgets/Widget";
import GoogleMaps from "../Features/GoogleMaps/GoogleMaps";

function Maps() {
  return (
    <Fenster title="Orte in der Nähe">
      <Widget>
        <GoogleMaps />
      </Widget>
    </Fenster>
  );
}

export default Maps;
```

### Route hinzufügen in App.jsx:

```jsx
import Maps from "./pages/Maps.jsx";

// In den Routes:
<Route path="/maps" element={<Maps />} />
```

### Sidebar-Button hinzufügen in SidebarData.jsx:

```jsx
{
  title: "Maps",
  icon: new URL('./SidebarIcons/MapIcon.png', import.meta.url).href,
  type: "image",
  path: "/maps"
}
```

## 4. Features der Komponente

### ✅ Funktionen:
- 🗺️ **Interaktive Google Maps Karte**
- 📍 **Automatische Standorterkennung** (verwendet GPS wenn verfügbar)
- 🔍 **Ortssuche** (z.B. "Berlin", "München")
- 🍽️ **Restaurant-Suche** mit Bewertungen
- 🏨 **Hotel-Suche** mit Öffnungszeiten
- 🎭 **Sehenswürdigkeiten** in der Umgebung
- ⭐ **Bewertungen und Rezensionen** von Google
- 📌 **Marker auf der Karte** für alle Ergebnisse
- 🎯 **Klick auf Eintrag** zoomt zur Location

### 🎨 UI-Elemente:
- Material-UI Komponenten
- Responsive Design
- Liste mit detaillierten Informationen
- Bewertungssterne
- Öffnungsstatus-Chips
- Ladeanimationen

## 5. Wichtige Hinweise

⚠️ **Kosten:**
- Google Maps API ist kostenpflichtig nach Überschreitung des Gratiskontingents
- Erste $200 pro Monat sind kostenlos
- Setzen Sie Limits in der Google Cloud Console

⚠️ **Sicherheit:**
- Beschränken Sie Ihren API-Schlüssel auf Ihre Domain
- Committen Sie den Schlüssel NICHT in ein öffentliches Repository
- Verwenden Sie Umgebungsvariablen für Produktion

## 6. Erweiterte Konfiguration

### Radius ändern (Standard: 5km):
```javascript
const request = {
  location: location,
  radius: 10000, // 10km
  type: [selectedType]
};
```

### Mehr Ergebnisse anzeigen (Standard: 10):
```javascript
const topResults = results.slice(0, 20); // Zeige 20 Ergebnisse
```

### Weitere Typen hinzufügen:
Mögliche `type` Werte:
- `cafe`, `bar`, `night_club`
- `park`, `museum`, `art_gallery`
- `shopping_mall`, `store`
- `hospital`, `pharmacy`
- [Vollständige Liste](https://developers.google.com/maps/documentation/places/web-service/supported_types)
