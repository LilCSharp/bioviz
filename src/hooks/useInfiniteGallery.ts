'use client';
import * as React from 'react';
import type { GalleryItem } from '@/lib/types';

type UseInfiniteGalleryArgs = {
  folderId?: string;
  initialItems: GalleryItem[];
  initialNextCursor?: string;
};

type State = {
  items: GalleryItem[];
  cursor?: string;
  loading: boolean;
  done: boolean;
};

async function fetchPage(folderId: string | undefined, cursor?: string) {
  const params = new URLSearchParams();
  if (folderId) params.set('parentId', folderId);
  if (cursor) params.set('cursor', cursor);
  params.set('limit', '40');
  params.set('sort', '-date');

  const res = await fetch(`/api/gallery?${params.toString()}`, {
    // client-side pagination; never cache
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { items: GalleryItem[]; nextCursor?: string | null };
}

export function useInfiniteGallery({ folderId, initialItems, initialNextCursor }: UseInfiniteGalleryArgs) {
  const [state, setState] = React.useState<State>({
    items: initialItems,
    cursor: initialNextCursor ?? undefined,
    loading: false,
    done: !initialNextCursor,
  });

  // Reset when folderId changes
  React.useEffect(() => {
    setState({
      items: initialItems,
      cursor: initialNextCursor ?? undefined,
      loading: false,
      done: !initialNextCursor,
    });
  }, [folderId, initialItems, initialNextCursor]);

  const loadMore = React.useCallback(async () => {
    if (state.loading || state.done) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const page = await fetchPage(folderId, state.cursor);
      setState((s) => ({
        items: [...s.items, ...page.items],
        cursor: page.nextCursor ?? undefined,
        loading: false,
        done: !page.nextCursor,
      }));
    } catch (e) {
      // On error, stop trying for now
      setState((s) => ({ ...s, loading: false, done: true }));
      // Optionally log e
    }
  }, [folderId, state.loading, state.done, state.cursor]);

  return {
    items: state.items,
    hasMore: !state.done,
    loading: state.loading,
    loadMore,
  };
}
