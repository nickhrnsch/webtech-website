import React from "react";
import "../Fenster/FensterStyle.css";

function Widget({ title, children }) {
  return (
    <div className="widget-card">
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default Widget;
