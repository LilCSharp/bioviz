'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export function useNav() {
  const router = useRouter();
  const sp = useSearchParams();

  return {
    goGallery: (folderId?: string) => {
      const qs = new URLSearchParams(sp?.toString() || '');
      if (folderId) qs.set('folderId', folderId); else qs.delete('folderId');
      router.push(`/gallery${qs.toString() ? `?${qs}` : ''}`);
    },
    goSplats: () => router.push('/splats'),
    goJob: (jobId: string) => router.push(`/jobs/${encodeURIComponent(jobId)}`),
    replaceQuery: (next: Record<string, string | undefined>) => {
      const qs = new URLSearchParams(sp.toString());
      Object.entries(next).forEach(([k, v]) => (v == null ? qs.delete(k) : qs.set(k, v)));
      router.replace(`?${qs.toString()}`);
    },
    back: () => router.back(),
  };
}
