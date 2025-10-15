'use client';
import { IconButton, Badge } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

export default function JobIndicator() {
  // TODO: connect to job store
  return (
    <IconButton aria-label="jobs">
      <Badge badgeContent={0} color="primary">
        <WorkOutlineIcon />
      </Badge>
    </IconButton>
  );
}
