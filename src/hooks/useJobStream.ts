'use client';
export function useJobStream(jobId: string) {
  // TODO: SSE/WebSocket or polling
  return { pct: 0, status: 'queued' as const };
}
