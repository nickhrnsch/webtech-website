import React, { useState, useEffect } from 'react';
import './SidebarStyle.css';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/userService';

function SidebarProfile() {
    const { user, logout } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });
    const [originalProfileData, setOriginalProfileData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Lade Profildaten beim Öffnen des Popups oder wenn User sich ändert
    useEffect(() => {
        if (user) {
            const initialData = {
                name: user.name || '',
                email: user.email || ''
            };
            setProfileData(initialData);
            setOriginalProfileData(initialData);
        }
    }, [user]);

    // Lade Profildaten vom Backend wenn Popup geöffnet wird
    useEffect(() => {
        if (showPopup && user) {
            loadProfile();
        }
    }, [showPopup, user]);

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const profile = await getProfile();
            const loadedData = {
                name: profile.name || '',
                email: profile.email || ''
            };
            setProfileData(loadedData);
            setOriginalProfileData(loadedData);
        } catch (err) {
            setError('Fehler beim Laden des Profils');
            console.error('Profile Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        return profileData.name !== originalProfileData.name ||
               profileData.email !== originalProfileData.email;
    };

    const handleClick = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setError('');
        setSuccess('');
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            await updateProfile(profileData);
            setSuccess('Profil erfolgreich gespeichert!');
            // Aktualisiere User im AuthContext durch erneutes Laden
            setTimeout(() => {
                loadProfile();
            }, 500);
        } catch (err) {
            setError(err.message || 'Fehler beim Speichern des Profils');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return null;
    }

    const displayName = profileData.name || user.username || 'User';
    const displayEmail = profileData.email || user.email || '';

    return (
        <div className={`sidebar-profile-container ${showPopup ? 'expanded' : ''}`}>
            {!showPopup ? (
                <button className="sidebar-user-profile" onClick={handleClick}>
                    <div className="user-avatar">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1976d2&color=fff&size=48`}
                            alt="User Avatar" 
                        />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{displayName}</span>
                        <span className="user-status">Online</span>
                    </div>
                </button>
            ) : (
                <div className="profile-popup-expanded">
                    <div className="profile-popup-header">
                        <h3>Mein Profil</h3>
                        <button className="profile-popup-close" onClick={closePopup}>×</button>
                    </div>
                    <div className="profile-popup-body">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Lädt...</div>
                        ) : (
                            <>
                                <div className="profile-avatar-large">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1976d2&color=fff&size=80`}
                                        alt="User Avatar" 
                                    />
                                </div>
                                <div className="profile-details">
                                    {error && (
                                        <div className="profile-error" style={{ 
                                            color: '#c62828', 
                                            backgroundColor: '#ffebee', 
                                            padding: '10px', 
                                            borderRadius: '8px', 
                                            marginBottom: '15px',
                                            fontSize: '14px'
                                        }}>
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="profile-success" style={{ 
                                            color: '#2e7d32', 
                                            backgroundColor: '#e8f5e9', 
                                            padding: '10px', 
                                            borderRadius: '8px', 
                                            marginBottom: '15px',
                                            fontSize: '14px'
                                        }}>
                                            {success}
                                        </div>
                                    )}
                                    <div className="profile-detail-item">
                                        <strong>Name:</strong>
                                        <input 
                                            type="text"
                                            value={profileData.name} 
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="profile-input"
                                            disabled={saving}
                                        />
                                    </div>
                                    <div className="profile-detail-item">
                                        <strong>E-Mail:</strong>
                                        <input 
                                            type="email"
                                            value={profileData.email} 
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="profile-input"
                                            disabled={saving}
                                        />
                                    </div>
                                    <div className="profile-detail-item">
                                        <strong>Status:</strong>
                                        <span className="status-online">Online</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={saving || !hasChanges()}
                                            style={{
                                                flex: 1,
                                                padding: '10px 20px',
                                                backgroundColor: (saving || !hasChanges()) ? '#cccccc' : '#1976d2',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: (saving || !hasChanges()) ? 'not-allowed' : 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                opacity: (saving || !hasChanges()) ? 0.6 : 1,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {saving ? 'Speichert...' : 'Speichern'}
                                        </button>

                                        <button 
                                            onClick={logout}
                                            style={{
                                                flex: 1,
                                                padding: '10px 20px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Abmelden
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SidebarProfile;