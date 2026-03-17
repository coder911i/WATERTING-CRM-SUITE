const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.error(
      '[Waterting] CRITICAL: NEXT_PUBLIC_API_URL is not set.\n' +
      'Go to Vercel Dashboard → Settings → Environment Variables and add:\n' +
      'NEXT_PUBLIC_API_URL = https://your-render-service.onrender.com'
    );
    return '';
  }
  return url.replace(/\/$/, ''); // strip trailing slash
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('waterting_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('waterting_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('waterting_token');
  localStorage.removeItem('waterting_user');
};

export const setUser = (user: AuthUser): void => {
  localStorage.setItem('waterting_user', JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('waterting_user');
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; }
  catch { return null; }
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'TenantAdmin' | 'SalesManager' | 'SalesAgent' | 'Accounts' | 'Broker';
  tenantId: string;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  requiresAuth = true,
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path}`;

  console.log(`[API] ${method} ${url}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('No auth token. Redirecting to login.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API] ${method} ${url}`, body ?? '');

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired. Redirecting to login.');
  }

  if (!res.ok) {
    let errorMessage = `API error ${res.status}`;
    try {
      const err = await res.json();
      errorMessage = err.message || err.error || errorMessage;
    } catch {
      errorMessage = await res.text() || errorMessage;
    }
    console.error(`[API] ${method} ${url} FAILED:`, res.status, errorMessage);
    throw new Error(errorMessage);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T = any>(path: string) => request<T>('DELETE', path),

  publicPost: <T = any>(path: string, body?: unknown) =>
    request<T>('POST', path, body, false),
  publicGet: <T = any>(path: string) =>
    request<T>('GET', path, undefined, false),
};
export default apiClient;
