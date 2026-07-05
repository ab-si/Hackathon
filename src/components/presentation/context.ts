import type { Hackathon, Project } from '../../types';

export interface PresentationOutletContext {
  hackathon: Hackathon;
  projects: Project[];
  apiConnected: boolean;
  demoChecklist: Record<string, boolean>;
  toggleDemoChecked: (projectId: string) => void;
}
