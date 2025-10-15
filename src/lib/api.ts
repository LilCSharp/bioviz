type NextFetchHints = {
  next?: {
    revalidate?: number | false; // seconds or false to disable ISR
    tags?: string[];             // for revalidateTag()
  };
  cache?: RequestCache;          // 'force-cache' | 'no-store' | 'default' ...
};

const API = process.env.NEXT_PUBLIC_API_BASE || '';

type FetchOpts = RequestInit & NextFetchHints;

export async function api<T>(path: string, init?: FetchOpts): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...(init?.headers || {}), accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function apiNoStore<T>(path: string, init?: FetchOpts): Promise<T> {
  return api<T>(path, { ...(init || {}), cache: 'no-store' });
}

