import React, { useState } from 'react';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    abteilung: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validierung
    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);

    try {
      // Registrierung
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || null,
        abteilung: formData.abteilung || null,
      });

      // Automatisch einloggen nach Registrierung
      const loginResult = await login(formData.username, formData.password);
      if (!loginResult.success) {
        setError('Registrierung erfolgreich, aber Login fehlgeschlagen. Bitte melden Sie sich an.');
        onSwitchToLogin();
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Registrierung fehlgeschlagen');
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrieren</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Benutzername *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Passwort *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="abteilung">Abteilung</label>
            <input
              type="text"
              id="abteilung"
              name="abteilung"
              value={formData.abteilung}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Wird registriert...' : 'Registrieren'}
          </button>
        </form>
        <div className="switch-form">
          <p>
            Bereits ein Konto?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Anmelden
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
