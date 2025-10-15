'use client';
import * as React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type Mode = 'light' | 'dark';
type Ctx = { mode: Mode; toggle: () => void; set: (m: Mode) => void };
export const ColorModeContext = React.createContext<Ctx>({
  mode: 'light',
  toggle: () => {},
  set: () => {},
});

const STORAGE_KEY = 'mui-color-mode';

function getInitialMode(): Mode {
  // 1) localStorage (if present)
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    // 2) system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  // 3) fallback
  return 'light';
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>(() => getInitialMode());
  const [mounted, setMounted] = React.useState(false);

  // keep up with OS-level change *after* mount
  React.useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => {
      // only auto-switch if the user hasn't explicitly chosen a mode
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== 'light' && stored !== 'dark') {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  // persist + hint UA color-schemes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
    // Advertise supported color schemes to the UA (helps form controls)
    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (meta) meta.content = 'light dark';
    // Set an attribute you can target in CSS if needed
    document.documentElement.setAttribute('data-color-scheme', mode);
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root': {
                colorScheme: mode, // respects OS for native widgets
              },
            },
          },
        },
      }),
    [mode],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
      set: (m) => setMode(m),
    }),
    [mode],
  );

  // Avoid a brief “flash” of wrong theme by not rendering until mounted
  // (the optional no-flash script below is even smoother)
  if (!mounted) return null;

  return (
    <ColorModeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
