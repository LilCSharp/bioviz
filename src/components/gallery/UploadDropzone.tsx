'use client';
import { Box, Paper, Typography } from '@mui/material';

export default function UploadDropzone() {
  // TODO: drag-and-drop & presigned upload flow
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">Drag & drop images here or click to upload — TODO</Typography>
      </Box>
    </Paper>
  );
}
