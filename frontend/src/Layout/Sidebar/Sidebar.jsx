import React from "react";
import { SidebarData } from "./SidebarData";
import "./SidebarStyle.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        {SidebarData.map((item, index) => {
          return (
            <li key={index}>{item.title}</li>
          );
        })}
      </ul>

    </div>
  );
}

export default Sidebar;