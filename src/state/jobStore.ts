import { create } from 'zustand';
type Job = { id: string; status: 'queued'|'running'|'failed'|'completed'; pct?: number };
export const useJobStore = create<{ jobs: Record<string, Job> }>(() => ({ jobs: {} }));
