'use client';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function ViewerSidePanel({ splatId }: { splatId: string }) {
  // TODO: react-hook-form + zod validation for camera fields
  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1">Camera (x,y,z,θ,φ)</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
        {['x','y','z','theta','phi'].map((k) => (
          <TextField key={k} size="small" label={k} placeholder="0" />
        ))}
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" fullWidth disabled>Apply — TODO</Button>
      <Button sx={{ mt: 1 }} variant="text" fullWidth disabled>Copy current — TODO</Button>
    </Box>
  );
}
