'use client';
import * as React from 'react';
import { Breadcrumbs, Link as MLink, Typography, Skeleton } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

type Crumb = { id: string | null; name: string };

// Fetch the breadcrumb path for a folder id
async function fetchPath(folderId?: string): Promise<Crumb[]> {
  if (!folderId) return [{ id: null, name: 'Gallery' }];
  // IMPORTANT: encode the id so slashes are not treated as separators
  const encoded = encodeURIComponent(folderId);
  const data = await api<{ path: { id: string; name: string }[] }>(`/api/folder/${encoded}`);
  return [{ id: null, name: 'Gallery' }, ...data.path.slice(1)]; // ensure leading "Gallery" once
}

export default function BreadcrumbsNav({ compact }: { compact?: boolean }) {
  const sp = useSearchParams();
  const folderId = sp.get('folderId') ?? undefined;

  const { data, status } = useCrumbs(folderId);

  if (status === 'loading') return <Skeleton variant="text" width={240} />;

  const crumbs = data ?? [{ id: null, name: 'Gallery' }];
  const maxItems = compact ? 3 : 8;

  return (
    <Breadcrumbs maxItems={maxItems} itemsBeforeCollapse={1} itemsAfterCollapse={2} sx={{ mb: 2 }}>
      {crumbs.slice(0, -1).map((c, idx) =>
        c.id ? (
          <MLink
            key={c.id}
            component={Link}
            href={{ pathname: '/gallery', query: { folderId: c.id } }} // let Next encode properly
          >
            {c.name}
          </MLink>
        ) : (
          <MLink key={`root-${idx}`} component={Link} href="/gallery">
            Gallery
          </MLink>
        )
      )}
      <Typography color="text.primary">{crumbs[crumbs.length - 1].name}</Typography>
    </Breadcrumbs>
  );
}

function useCrumbs(folderId?: string) {
  const [data, setData] = React.useState<Crumb[] | undefined>(undefined);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  React.useEffect(() => {
    let alive = true;
    setStatus('loading');
    fetchPath(folderId)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setStatus('ready');
      })
      .catch(() => {
        if (!alive) return;
        setStatus('error');
      });
    return () => {
      alive = false;
    };
  }, [folderId]);

  return { data, status };
}
