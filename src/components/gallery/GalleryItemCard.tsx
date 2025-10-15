'use client';
import * as React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Box,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import type { GalleryItem, ImageRef } from '@/lib/types';
import { useNav } from '@/lib/nav';
import ImagePreviewDialog from './ImagePreviewDialog';

type Props = {
  item: GalleryItem;
  onToggleSelect?: (id: string, kind: 'image' | 'folder') => void;
  selected?: boolean;
};

function isImage(item: GalleryItem): item is ImageRef {
  return item.type === 'image';
}

/**
 * Standardized card sizing rules:
 * - Media is a 3:2 area (uniform height across all cards).
 * - Content area has fixed minHeight for alignment.
 * - Folders navigate on click; images open a full-size preview dialog.
 */
export default function GalleryItemCard({ item, onToggleSelect, selected }: Props) {
  const { goGallery } = useNav();
  const isFolder = item.type === 'folder';
  const [open, setOpen] = React.useState(false);

  const title = item.name;
  const mediaSrc = isFolder
    ? item.previewImageUrl
    : (item as ImageRef).thumbnailUrl;

  const originalHref = isFolder ? undefined : (item as ImageRef).originalUrl;

  const handleOpen = () => {
    if (isFolder) {
      goGallery(item.id);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(item.id, item.type);
  };

  return (
    <>
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
        <CardActionArea onClick={handleOpen} sx={{ alignItems: 'stretch' }}>
          {/* Media: 3:2 ratio via padding-top */}
          <Box sx={{ position: 'relative', pt: '66.666%' }}>
            {mediaSrc ? (
              <CardMedia
                component="img"
                src={mediaSrc}
                alt={title}
                loading="lazy"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // shows a cropped/cover thumbnail, as requested
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                {isFolder ? <FolderIcon fontSize="large" /> : <ImageIcon fontSize="large" />}
              </Box>
            )}

            {/* Type chip */}
            <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
              <Chip
                size="small"
                label={isFolder ? 'Folder' : 'Image'}
                color={isFolder ? 'default' : 'primary'}
                sx={{ bgcolor: (t) => (isFolder ? t.palette.background.paper : undefined) }}
              />
            </Box>

            {/* Select checkbox */}
            <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
              <Tooltip title={selected ? 'Deselect' : 'Select'}>
                <Checkbox
                  size="small"
                  checked={Boolean(selected)}
                  onClick={handleToggle}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.2)',
                    borderRadius: 1,
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                />
              </Tooltip>
            </Box>
          </Box>

          {/* Content: fixed height for uniform cards */}
          <CardContent
            sx={{
              py: 1.25,
              minHeight: 56,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} width="100%" overflow="hidden">
              <Typography
                variant="body2"
                title={title}
                sx={{
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Typography>

              {/* Folder counts, if provided */}
              {isFolder && item.counts?.images ? (
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {item.counts.images} img{item.counts.images === 1 ? '' : 's'}
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Image preview modal */}
      {!isFolder && (
        <ImagePreviewDialog
          open={open}
          onClose={handleClose}
          src={originalHref || (item as ImageRef).thumbnailUrl}
          title={title}
          originalHref={originalHref}
        />
      )}
    </>
  );
}
