import React, { useState } from 'react';
import './SidebarStyle.css';

function SidebarProfile() {
// Zustand für die Anzeige des Popups
    const [showPopup, setShowPopup] = useState(false);
// Profildaten änderbar machen und Defaultwerte setzen
    const [profileData, setProfileData] = useState({
        name: 'Max Mustermann',
        email: 'max.m@example.com',
        abteilung: 'IT'
    });
  
// Funktionen zum Öffnen und Schließen des Popups
    const handleClick = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

// Funktion zum Aktualisieren der Profildaten
    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
      // Sidebar Profilbereich mit Popup für detaillierte Ansicht und Bearbeitung
        <div className={`sidebar-profile-container ${showPopup ? 'expanded' : ''}`}>
            {!showPopup ? (
                <button className="sidebar-user-profile" onClick={handleClick}>
                    <div className="user-avatar">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=1976d2&color=fff&size=48`}
                            alt="User Avatar" 
                        />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{profileData.name}</span>
                        <span className="user-status">Online</span>
                    </div>
                </button>
            ) : (
              // Erweiterte Profilansicht mit Bearbeitungsmöglichkeiten
                <div className="profile-popup-expanded">
                    <div className="profile-popup-header">
                        <h3>Mein Profil</h3>
                        <button className="profile-popup-close" onClick={closePopup}>×</button>
                    </div>
                    <div className="profile-popup-body">
                        <div className="profile-avatar-large">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=1976d2&color=fff&size=100`}
                                alt="User Avatar" 
                            />
                        </div>
                        <div className="profile-details">
                            <div className="profile-detail-item">
                                <strong>Name:</strong>
                                <input 
                                    type="text"
                                    value={profileData.name} 
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="profile-input"
                                />
                            </div>
                            <div className="profile-detail-item">
                                <strong>E-Mail:</strong>
                                <input 
                                    type="email"
                                    value={profileData.email} 
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="profile-input"
                                />
                            </div>
                            <div className="profile-detail-item">
                                <strong>Abteilung:</strong>
                                <input 
                                    type="text"
                                    value={profileData.abteilung} 
                                    onChange={(e) => handleInputChange('abteilung', e.target.value)}
                                    className="profile-input"
                                />
                            </div>
                            <div className="profile-detail-item">
                                <strong>Status:</strong>
                                <span className="status-online">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SidebarProfile;