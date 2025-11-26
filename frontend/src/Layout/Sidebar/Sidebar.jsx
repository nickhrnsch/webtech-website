import React from "react";
import "./SidebarStyle.css";
import { SidebarData } from "./SidebarData";
import SidebarProfile from "./SidebarProfile";
import CalenderIcon from "./SidebarIcons/CalenderIcon.png";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={CalenderIcon} alt="Kalender" className="sidebar-header-icon" />
        <h2>Urlaubsplaner</h2>
      </div>
      <ul>
        {SidebarData.map((item, index) => {
          return (
            <button key={index} className="sidebar-button">
              {item.icon && <img src={item.icon} alt={item.title} className="sidebar-icon" />}
              {item.title}
            </button>
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