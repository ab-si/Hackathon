import { Box, Button, Stack, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import type { Project } from '../../../types';
import { usePresentationStyle } from '../presentationTheme';

interface ActionDef {
  key: keyof Project['links'];
  label: string;
  icon: React.ReactNode;
  qr?: boolean;
}

const ACTIONS: ActionDef[] = [
  { key: 'liveDemo', label: 'Live Demo', icon: <PlayCircleRoundedIcon />, qr: true },
  { key: 'figma', label: 'Figma', icon: <DesignServicesRoundedIcon /> },
  { key: 'hosted', label: 'Hosted App', icon: <CloudRoundedIcon />, qr: true },
  { key: 'github', label: 'GitHub', icon: <GitHubIcon /> },
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { key: 'documentation', label: 'Documentation', icon: <DescriptionRoundedIcon /> },
];

interface Props {
  links: Project['links'];
}

export default function QuickActions({ links }: Props) {
  const { glassCardSx } = usePresentationStyle();
  const visible = ACTIONS.filter((a) => links[a.key]);
  if (visible.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" color="text.secondary">
        Quick Actions
      </Typography>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2}>
        {visible.map((action) => {
          const url = links[action.key]!;
          return (
            <Stack key={action.key} spacing={1} alignItems="center" sx={{ ...glassCardSx, p: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={action.icon}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: 180 }}
              >
                {action.label}
              </Button>
              {action.qr && (
                <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1.5 }}>
                  <QRCodeSVG value={url} size={88} />
                </Box>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
