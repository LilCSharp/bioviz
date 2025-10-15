'use client';
import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
  open: boolean;
  title?: string;
  src: string;          // full-size image URL
  onClose: () => void;
  originalHref?: string; // optional link to original asset
};

/**
 * Scrollable image preview dialog.
 * - Centers image, lets it grow up to 90vh.
 * - Allow vertical scroll when taller.
 */
export default function ImagePreviewDialog({ open, title, src, onClose, originalHref }: Props) {
  // accessibility: close on Escape is handled by Dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="image-preview-title"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle id="image-preview-title" sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" noWrap title={title}>
            {title || 'Preview'}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {originalHref ? (
              <Tooltip title="Open original">
                <IconButton
                  component="a"
                  href={originalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="open original"
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            {originalHref ? (
              <Tooltip title="Download">
                <IconButton component="a" href={originalHref} download aria-label="download">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title="Close">
              <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            maxHeight: '90vh',
            maxWidth: '100%',
            overflow: 'auto',
            // Provide a subtle backdrop for large transparent images
            backgroundImage:
              'linear-gradient(45deg, rgba(128,128,128,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(128,128,128,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.12) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            width: '100%',
          }}
        >
          <Box
            component="img"
            src={src}
            alt={title || 'image'}
            sx={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              margin: '0 auto',
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
