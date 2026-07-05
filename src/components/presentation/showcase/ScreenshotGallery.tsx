import { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

interface Props {
  screenshots: string[];
}

export default function ScreenshotGallery({ screenshots }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpenIndex(null);
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        setOpenIndex((i) => (i === null ? i : (i - 1 + screenshots.length) % screenshots.length));
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        setOpenIndex((i) => (i === null ? i : (i + 1) % screenshots.length));
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [openIndex, screenshots.length]);

  if (screenshots.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Screenshots
      </Typography>
      <Grid container spacing={1.5}>
        {screenshots.map((src, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <Box
              component="img"
              src={src}
              alt={`Screenshot ${i + 1}`}
              onClick={() => setOpenIndex(i)}
              sx={{
                width: '100%',
                aspectRatio: '16/10',
                objectFit: 'cover',
                borderRadius: 1.5,
                cursor: 'zoom-in',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'transform .15s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } }}
      >
        {openIndex !== null && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setOpenIndex(null)}
              sx={{ position: 'absolute', top: -16, right: -16, bgcolor: 'background.paper' }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Box
              component="img"
              src={screenshots[openIndex]}
              alt={`Screenshot ${openIndex + 1}`}
              sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2 }}
            />
            {screenshots.length > 1 && (
              <>
                <IconButton
                  onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + screenshots.length) % screenshots.length))}
                  sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
                >
                  <ChevronLeftRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % screenshots.length))}
                  sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </Dialog>
    </Stack>
  );
}
