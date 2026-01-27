import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SidebarStyle.css";
import { SidebarData } from "./SidebarData";
import SidebarProfile from "./SidebarProfile";
import CalenderIcon from "./SidebarIcons/CalenderIcon.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={CalenderIcon} alt="Kalender" className="sidebar-header-icon" />
        <h2>Urlaubsplaner</h2>
      </div>
      <ul>
        {SidebarData.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={index} 
              className={`sidebar-button ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.type === "image" ? (
                <img src={item.icon} alt={item.title} className="sidebar-icon" />
              ) : (
                <item.icon className="sidebar-icon" style={{ fontSize: 24 }} />
              )}
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