'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import type { GalleryItem } from '@/lib/types';
import { useInfiniteGallery } from '@/hooks/useInfiniteGallery';
import { usePersistScroll } from '@/hooks/usePersistScroll';
import GalleryItemCard from './GalleryItemCard';

type Props = {
  initialItems: GalleryItem[];
  initialNextCursor?: string;
  folderId?: string;
};

/**
 * CSS Grid for layout consistency across MUI versions.
 * - Fixed gap
 * - Responsive column count
 * - Each cell stretches to equal heights because the card defines a standard media ratio + content minHeight.
 */
export default function GalleryGrid({ initialItems, initialNextCursor, folderId }: Props) {
  usePersistScroll(`gallery:${folderId ?? 'root'}`);

  const { items, loadMore, hasMore } = useInfiniteGallery({
    folderId,
    initialItems,
    initialNextCursor,
  });

  React.useEffect(() => {
    if (!hasMore) return;
    const el = document.querySelector('[data-loadmore-trigger]');
    if (!el) return;
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.isIntersecting && loadMore()),
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  return (
    <>
      <Box
        display="grid"
        gap={2}
        sx={{
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
            xl: 'repeat(6, minmax(0, 1fr))',
          },
        }}
      >
        {items.map((it) => (
          <Box key={it.id}>
            <GalleryItemCard
              item={it}
              selected={!!selected[it.id]}
              onToggleSelect={(id) => toggleSelect(id)}
            />
          </Box>
        ))}
      </Box>
      <div data-loadmore-trigger style={{ height: 32 }} />
    </>
  );
}
