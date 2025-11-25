import React from "react";
import { SidebarData } from "./SidebarData";
import "./SidebarStyle.css";
import SidebarProfile from "./SidebarProfile";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
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