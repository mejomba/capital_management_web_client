// Single place that owns the JWT. Kept tiny and framework-free so both the
// fetch middleware and the auth context read the same source of truth.
const TOKEN_KEY = "wm.token";

let onUnauthorized: (() => void) | null = null;

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Register a callback invoked when the API returns 401 (token expired/invalid). */
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

export function notifyUnauthorized(): void {
  onUnauthorized?.();
}
