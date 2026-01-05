import React from "react";
import "../Fenster/FensterStyle.css";

function Widget({ title, children, className }) {
  return (
    <div className={`widget-card ${className || ""}`}>
      <div className="widget-body">{children}</div>
    </div>
  );
}

export default Widget;
