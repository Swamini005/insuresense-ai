// Central API client for the InsureSense backend.
// Base URL comes from VITE_API_URL.
// In local dev with Vite proxy, an empty string works (relative /api paths).
// In production, set VITE_API_URL to the backend's full origin.

export const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

const TOKEN_KEY = "insuresense_token";
const USER_KEY = "insuresense_user";

export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
    preferences?: Record<string, unknown>;
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function setStoredUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

interface ApiOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    /** Attach the stored JWT as a Bearer token. */
    auth?: boolean;
}

/**
 * Thin fetch wrapper. Returns parsed JSON, throws an Error with the backend's
 * message on a non-2xx response.
 */
export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, auth = false } = options;

    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: any = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const message =
            (data && (data.error || data.message)) || `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data as T;
}
