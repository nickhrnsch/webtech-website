import React from "react";
import "../Fenster/FensterStyle.css";

function Widget({ title, children }) {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default Widget;
