'use client';
import * as React from 'react';
import { Tabs, Tab } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const value = React.useMemo(() => {
    if (pathname?.startsWith('/splats')) return '/splats';
    if (pathname?.startsWith('/gallery')) return '/gallery';
    if (pathname?.startsWith('/jobs')) return '/jobs';
    return false;
  }, [pathname]);

  return (
    <Tabs value={value} onChange={(_, v) => router.push(v)} textColor="primary" indicatorColor="primary">
      <Tab value="/gallery" label="Gallery" />
      <Tab value="/splats" label="Splats" />
    </Tabs>
  );
}
