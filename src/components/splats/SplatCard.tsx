'use client';
import * as React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import type { SplatRef } from '@/lib/types';
import Link from 'next/link';

/**
 * Standardized splat tile:
 * - 3:2 media area for consistent height
 * - Fixed content minHeight to align cards
 * - Shows name and creation date; status chip when not "ready"
 */
export default function SplatCard({ splat }: { splat: SplatRef }) {
  const href = `/splats/${encodeURIComponent(splat.id)}`;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardActionArea component={Link} href={href} sx={{ alignItems: 'stretch' }}>
        {/* Media: 3:2 ratio */}
        <Box sx={{ position: 'relative', pt: '66.666%' }}>
          <CardMedia
            component="img"
            src={splat.previewImageUrl || '/globe.svg'}
            alt={splat.name}
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Status chip (only when not ready) */}
          {splat.status !== 'ready' && (
            <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
              <Chip
                size="small"
                label={splat.status}
                color={splat.status === 'failed' ? 'error' : 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          )}
        </Box>

        {/* Content block with fixed min height */}
        <CardContent
          sx={{
            py: 1.25,
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" width="100%" overflow="hidden">
            <Typography
              variant="body2"
              title={splat.name}
              sx={{
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {splat.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {new Date(splat.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
