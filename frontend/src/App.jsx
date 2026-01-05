import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import Sidebar from "./Layout/Sidebar/Sidebar.jsx";
import Fenster from "./Layout/Fenster/Fenster";
import TextWidget from "./Layout/Widgets/TextWidget";
import Widget from "./Layout/Widgets/Widget";
// import Kalender from "./Features/Kalender/Kalender";
import MUICalender from "./Features/MUICalendar/Calendar.jsx";

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <Fenster title="Dashboard">

        <Widget className="calendar-widget">
          <MUICalender />
        </Widget>

        <Widget title="Meine Textwidget 2" text="Hier steht ein Text" />

        <Widget
          title="Meine Textwidget 2"
          text="Hier steht ein Textf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf as"
        />

        {/* oder andere Widgets */}
      </Fenster>
    </div>
  );
}

export default App;
