import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!response.ok) return false;
  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  return true;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const accessToken = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
  });

  if (response.status === 401 && (await refreshTokens())) {
    return apiFetch(path, options);
  }

  if (response.status === 401) {
    clearTokens();
  }

  return response;
}
