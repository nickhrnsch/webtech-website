import { apiRequest } from './api';

/**
 * Holt das Profil des aktuellen Users
 */
export async function getProfile() {
  return await apiRequest('/api/users/profile', {
    method: 'GET',
  });
}

/**
 * Aktualisiert das Profil des aktuellen Users
 */
export async function updateProfile(profileData) {
  return await apiRequest('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify({
      name: profileData.name || null,
      email: profileData.email || null,
      abteilung: profileData.abteilung || null,
    }),
  });
}

/**
 * Holt die Währungs-Favoriten des aktuellen Users
 */
export async function getCurrencyFavorites() {
  return await apiRequest('/api/users/favorites/currency', {
    method: 'GET',
  });
}

/**
 * Speichert die Währungs-Favoriten des aktuellen Users
 */
export async function updateCurrencyFavorites(favorites) {
  return await apiRequest('/api/users/favorites/currency', {
    method: 'PUT',
    body: JSON.stringify({ favorites }),
  });
}
