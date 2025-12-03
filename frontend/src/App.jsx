import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Sidebar from "./Layout/Sidebar/Sidebar.jsx";
import Fenster from "./Layout/Fenster/Fenster";
import TextWidget from "./Layout/Widgets/TextWidget";

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <Fenster title="Dashboard">
        <TextWidget title="Meine Textwidget 1" text="Hier steht ein Text" />
        <TextWidget title="Meine Textwidget 2" text="Hier steht ein Text" />
        <TextWidget
          title="Meine Textwidget 2"
          text="Hier steht ein Textf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf as"
        />
        <TextWidget title="Meine Textwidget 2" text="Hier steht ein Text" />
        {/* oder andere Widgets */}
      </Fenster>
    </div>
  );
}

export default App;
