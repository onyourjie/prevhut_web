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
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let url: string;
  if (path.startsWith('http')) {
    url = path;
  } else if (path.startsWith('/hotspots/')) {
    // Rute mikroservis satelit FIRMS & Cuaca ke FastAPI (port 8000)
    url = `${DATA_SERVICE_URL}${path.replace(/^\/hotspots/, '')}`;
  } else {
    url = `${API_URL}${path}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    let errorBody: any = null;
    try {
      errorBody = await response.json();
      if (Array.isArray(errorBody.message)) {
        errorMessage = errorBody.message.join(', ');
      } else if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // response is not JSON
    }
    throw new ApiError(response.status, errorMessage, errorBody);
  }

  // Handle empty 204 responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
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
