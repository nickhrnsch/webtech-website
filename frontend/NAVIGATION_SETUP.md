# Navigation Setup - Anleitung

## Option 1: Mit React Router (Empfohlen)

### 1. React Router installieren
Führen Sie im Terminal im frontend-Ordner aus:
```bash
npm install react-router-dom
```

### 2. App.jsx aktualisieren
Die App.jsx wurde vorbereitet und verwendet React Router für die Navigation.

### 3. Sidebar.jsx aktualisieren
Die Sidebar wurde angepasst um mit React Router zu arbeiten.

### 4. SidebarData.jsx aktualisieren
Die Routing-Pfade wurden zu den Sidebar-Einträgen hinzugefügt.

## Struktur

```
src/
├── pages/
│   ├── Home.jsx      (Dashboard mit Kalender)
│   ├── About.jsx     (Über uns Seite)
│   └── Contact.jsx   (Kontakt Seite)
├── Layout/
│   └── Sidebar/
│       ├── Sidebar.jsx
│       └── SidebarData.jsx
└── App.jsx
```

## Verwendung

Nach der Installation von React Router:
1. Klicken Sie auf einen Button in der Sidebar
2. Die Sidebar bleibt sichtbar
3. Der Hauptinhalt wechselt zur entsprechenden Seite
4. Die URL ändert sich entsprechend (/home, /about, /contact)

## Vorteile von React Router

- ✅ Professioneller Standard in React-Apps
- ✅ Browser-Navigation (Zurück/Vorwärts-Buttons funktionieren)
- ✅ Direkte Links zu Seiten möglich
- ✅ Einfach erweiterbar für neue Seiten
- ✅ URL-Parameter und Query-Strings möglich
