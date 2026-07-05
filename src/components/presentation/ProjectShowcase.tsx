import { useState } from 'react';
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { usePresentationShortcuts } from '../../hooks/usePresentationShortcuts';
import type { PresentationOutletContext } from './context';
import ShowcaseHero from './showcase/ShowcaseHero';
import ProblemSolutionSection from './showcase/ProblemSolutionSection';
import QuickActions from './showcase/QuickActions';
import DemoChecklistToggle from './showcase/DemoChecklistToggle';
import HighlightsGrid from './showcase/HighlightsGrid';
import ArchitectureViewer from './showcase/ArchitectureViewer';
import ScreenshotGallery from './showcase/ScreenshotGallery';
import TeamSection from './showcase/TeamSection';
import ImpactGrid from './showcase/ImpactGrid';
import DashboardLinksSection from './showcase/DashboardLinksSection';
import NextStepsSection from './showcase/NextStepsSection';
import SpeakerNotesPanel from './showcase/SpeakerNotesPanel';

export default function ProjectShowcase() {
  const { projectId } = useParams<{ projectId: string }>();
  const { hackathon, projects, demoChecklist, toggleDemoChecked } = useOutletContext<PresentationOutletContext>();
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  const index = projects.findIndex((p) => p.id === projectId);
  const project = index >= 0 ? projects[index] : undefined;

  usePresentationShortcuts({
    onPrev: () => {
      if (projects.length === 0) return;
      const prev = projects[(index - 1 + projects.length) % projects.length];
      navigate(`/hackathons/${hackathon.id}/present/${prev.id}`);
    },
    onNext: () => {
      if (projects.length === 0) return;
      const next = projects[(index + 1) % projects.length];
      navigate(`/hackathons/${hackathon.id}/present/${next.id}`);
    },
    onDemo: () => {
      if (project?.links.liveDemo) window.open(project.links.liveDemo, '_blank', 'noopener,noreferrer');
    },
    onGithub: () => {
      if (project?.links.github) window.open(project.links.github, '_blank', 'noopener,noreferrer');
    },
    onToggleNotes: () => setNotesOpen((o) => !o),
  });

  if (!project) {
    return <Navigate to={`/hackathons/${hackathon.id}/present`} replace />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <Stack spacing={4}>
            <ShowcaseHero project={project} />
            <Stack direction="row" justifyContent="flex-end">
              <DemoChecklistToggle checked={Boolean(demoChecklist[project.id])} onToggle={() => toggleDemoChecked(project.id)} />
            </Stack>
            <SpeakerNotesPanel notes={project.speakerNotes} open={notesOpen} />
            <ProblemSolutionSection problem={project.problem} solution={project.solution} />
            <QuickActions links={project.links} />
            <HighlightsGrid title="Key Highlights" highlights={project.highlights} oneColumn />
            <ArchitectureViewer architecture={project.architecture} />
            <ScreenshotGallery screenshots={project.screenshots} />
            <TeamSection team={project.team} />
            <ImpactGrid impact={project.impact} />
            <HighlightsGrid
              title="Technical Highlights"
              icon={<CodeRoundedIcon fontSize="small" sx={{ color: 'info.main' }} />}
              highlights={project.technicalHighlights}
            />
            <HighlightsGrid
              title="Challenges"
              icon={<WarningAmberRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />}
              highlights={project.challenges}
            />
            <DashboardLinksSection currentProjectId={project.id} allProjects={projects} />
            <NextStepsSection nextSteps={project.nextSteps} />
          </Stack>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
