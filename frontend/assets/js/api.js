/**
 * Cliente HTTP mínimo para consumir la API de Nexora.
 * Al servirse el front-end desde el mismo servidor Express, la base
 * queda vacía (mismas origin) y basta con rutas relativas "/api/...".
 */
const API_BASE = '/api';

/**
 * Escapa texto proveniente de usuarios (comentarios, nombres) antes de
 * insertarlo vía innerHTML, para evitar inyección de HTML/XSS.
 */
function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

class ApiClientError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  return localStorage.getItem('nexora_token');
}

function setToken(token) {
  localStorage.setItem('nexora_token', token);
}

function clearToken() {
  localStorage.removeItem('nexora_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || 'Ocurrió un error inesperado';
    throw new ApiClientError(message, response.status, payload?.error?.details);
  }

  return payload;
}

const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
