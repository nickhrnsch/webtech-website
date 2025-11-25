import React from "react";
import "./SidebarStyle.css";
import { SidebarData } from "./SidebarData";
import SidebarProfile from "./SidebarProfile";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Urlaubsplaner</h2>
      <ul>
        {SidebarData.map((item, index) => {
          return (
            <button key={index} className="sidebar-button">{item.title}</button>
          );
        })}
      </ul>
      <div className="sidebar-profile-section">
      <SidebarProfile />
      </div>
    </div>
  );
}

export default Sidebar;