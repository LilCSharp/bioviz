'use client';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import JobIndicator from './JobIndicator';
import AppNav from './AppNav';
import { useContext } from 'react';
import { ColorModeContext } from '@/styles/ColorModeContext';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function AppAppBar() {
  const { mode, toggle } = useContext(ColorModeContext);

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6">GS Tool</Typography>
        <Box sx={{ flexGrow: 1 }}><AppNav /></Box>
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={toggle} color="inherit">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
        <JobIndicator />
      </Toolbar>
    </AppBar>
  );
}
