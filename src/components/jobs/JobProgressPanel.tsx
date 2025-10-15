'use client';
import { LinearProgress, Paper, Typography } from '@mui/material';
import * as React from 'react';
import type { JobRef } from '@/lib/types';

export default function JobProgressPanel({ jobId, initial }: { jobId: string; initial: JobRef }) {
  const [job, setJob] = React.useState<JobRef>(initial);
  // TODO: polling/SSE to update `job`

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6">Job {jobId}</Typography>
      <LinearProgress variant={job.progress?.pct ? 'determinate' : 'indeterminate'} value={job.progress?.pct} sx={{ mt: 2 }} />
      <Typography variant="body2" sx={{ mt: 1 }}>
        {job.status}{job.progress?.detail ? ` — ${job.progress.detail}` : ''}
      </Typography>
    </Paper>
  );
}
