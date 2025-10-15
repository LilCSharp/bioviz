'use client';
import { Drawer, Box, Typography, Button } from '@mui/material';

export default function SelectionDrawer() {
  // TODO: open/close from store; list items; clear; convert CTA
  return (
    <Drawer anchor="right" open={false} onClose={() => {}}>
      <Box sx={{ width: 360, p: 2 }}>
        <Typography variant="h6">Selection (0)</Typography>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled>
          Convert to scene
        </Button>
      </Box>
    </Drawer>
  );
}
