import React from "react";
import "./FensterStyle.css";

function Fenster({ title, children }) {
  return (
    <div className="fenster-container">
      <h1>{title}</h1>

      {/* Hier erscheinen alle Widgets */}
      <div className="fenster-widget-area">{children}</div>
    </div>
  );
}

export default Fenster;
