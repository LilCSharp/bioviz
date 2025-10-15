'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: { mode: 'light' },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { minHeight: '100vh' } } }
  }
});
