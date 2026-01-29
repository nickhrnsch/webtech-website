import { apiRequest } from './api';

/**
 * Holt alle Urlaube des aktuellen Users
 */
export async function listVacations() {
  return await apiRequest('/api/vacations', {
    method: 'GET',
  });
}

/**
 * Erstellt einen neuen Urlaub
 */
export async function createVacation(payload) {
  return await apiRequest('/api/vacations', {
    method: 'POST',
    body: JSON.stringify({
      start_date: payload.start_date,
      end_date: payload.end_date,
      location: payload.location || null,
      people: payload.people || null,
      title: payload.title ?? null,
      notes: payload.notes ?? null,
      accommodation: payload.accommodation ?? null,
      vacation_type: payload.vacation_type ?? null,
      link: payload.link ?? null,
    }),
  });
}

/**
 * Aktualisiert einen Urlaub. Nur übergebene Felder werden aktualisiert.
 */
export async function updateVacation(id, payload) {
  const keys = ['start_date', 'end_date', 'location', 'people', 'title', 'notes', 'accommodation', 'vacation_type', 'link'];
  const body = {};
  for (const k of keys) {
    if (payload[k] !== undefined) body[k] = payload[k] || null;
  }
  return await apiRequest(`/api/vacations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Löscht einen Urlaub
 */
export async function deleteVacation(id) {
  return await apiRequest(`/api/vacations/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Erstellt einen Share-Link für einen Urlaub
 */
export async function createShareLink(id) {
  return await apiRequest(`/api/vacations/${id}/share`, {
    method: 'POST',
  });
}

/**
 * Akzeptiert einen Share-Code und fügt User zum Urlaub hinzu
 */
export async function acceptShareCode(share_code) {
  return await apiRequest('/api/vacations/share/accept', {
    method: 'POST',
    body: JSON.stringify({ share_code }),
  });
}
