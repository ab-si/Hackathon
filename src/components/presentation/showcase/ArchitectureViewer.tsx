import { Box, Stack, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import type { ProjectArchitecture } from '../../../types';
import { usePresentationStyle } from '../presentationTheme';

interface Props {
  architecture?: ProjectArchitecture;
}

export default function ArchitectureViewer({ architecture }: Props) {
  const { glassCardSx, hoverBg } = usePresentationStyle();
  if (!architecture || !architecture.content) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Architecture
      </Typography>
      <Box sx={{ ...glassCardSx, p: 2.5 }}>
        {architecture.type === 'image' && (
          <Box
            component="img"
            src={architecture.content}
            alt="Architecture diagram"
            sx={{ maxWidth: '100%', borderRadius: 1.5, display: 'block', mx: 'auto' }}
          />
        )}
        {architecture.type === 'markdown' && (
          <Box
            sx={{
              '& pre': { overflowX: 'auto', bgcolor: hoverBg, p: 1.5, borderRadius: 1 },
              '& code': { fontFamily: 'monospace' },
            }}
          >
            <Markdown>{architecture.content}</Markdown>
          </Box>
        )}
        {(architecture.type === 'mermaid' || architecture.type === 'iframe') && (
          <Box
            component="pre"
            sx={{
              m: 0,
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              bgcolor: hoverBg,
              p: 2,
              borderRadius: 1,
            }}
          >
            {architecture.content}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
