import * as React from 'react';
import JobProgressPanel from '@/components/jobs/JobProgressPanel';
import { apiNoStore } from '@/lib/api';
import { routes } from '@/lib/routes';
import type { JobRef } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function JobPage({ params }: { params: { jobId: string } }) {
  const job = await apiNoStore<JobRef>(routes.jobs.status(params.jobId));
  return <JobProgressPanel jobId={params.jobId} initial={job} />;
}
