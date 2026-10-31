import { z } from 'zod';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const DATA_SERVICE_URL = import.meta.env.VITE_DATA_SERVICE_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('firezone_token');
}

/**
 * Universal fetch wrapper for FIREZONE Backend.
 * Automatically injects JWT Bearer token and JSON headers.
 */
export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const cleanToken = token ? token.trim().replace(/^["']|["']$/g, '') : null;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (cleanToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${cleanToken}`);
  }

  let url: string;
  if (path.startsWith('http')) {
    url = path;
  } else {
    // Seluruh rute (termasuk /hotspots/*) melalui Core Backend Gateway (port 3000)
    // agar data satelit terintegrasi langsung dengan database laporan warga PostgreSQL
    url = `${API_URL}${path}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = response.statusText || `HTTP ${response.status}`;
    let errorBody: any = null;

    try {
      const text = await response.text();
      try {
        errorBody = JSON.parse(text);
        if (Array.isArray(errorBody.message)) {
          errorMessage = errorBody.message.join(', ');
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Bukan response JSON (misal HTML 502 Bad Gateway dari proxy Vite)
        if (response.status === 502) {
          errorMessage =
            'Server backend (port 3000) sedang tidak aktif atau terputus (502 Bad Gateway). Pastikan server backend sedang berjalan.';
        } else if (text && text.length < 200 && !text.includes('<html')) {
          errorMessage = text;
        }
      }
    } catch {
      // Gagal membaca response body
    }

    throw new ApiError(response.status, errorMessage, errorBody);
  }

  // Handle empty 204 responses or empty body (mencegah error 'Unexpected end of JSON input')
  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/**
 * Schema-validated API call with Zod
 */
export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  const data = await apiRequest<any>(path, init);
  return schema.parse(data);
}
