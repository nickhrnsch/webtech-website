import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./SidebarStyle.css";
import { SidebarData } from "./SidebarData";
import SidebarProfile from "./SidebarProfile";
import Logo from "./SidebarIcons/Logo.png";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleColorMode } = useThemeMode();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="sidebar-logo" />
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
        <div className="sidebar-profile-inner">
          {user && (
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              size="medium"
              aria-label={mode === "dark" ? "Zu Hellmodus wechseln" : "Zu Dunkelmodus wechseln"}
              className="sidebar-theme-toggle"
            >
              {mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          )}
          <SidebarProfile />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;