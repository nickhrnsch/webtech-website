import React from 'react';
import './SidebarStyle.css';

function SidebarProfile() { 
    return (<button className="sidebar-user-profile">
        <div className="user-avatar">
          <img 
            src="https://ui-avatars.com/api/?name=Max+Mustermann&background=667eea&color=fff&size=48" 
            alt="User Avatar" 
          />
        </div>
        <div className="user-info">
          <span className="user-name">Max Mustermann</span>
          <span className="user-status">Online</span>
        </div>
    </button>);
}

export default SidebarProfile;