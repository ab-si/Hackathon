import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getTheme } from './theme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import HackathonList from './pages/HackathonList';
import HackathonDetail from './pages/HackathonDetail';
import PresentationRoot from './components/presentation/PresentationRoot';
import PresentationOverview from './components/presentation/PresentationOverview';
import ProjectShowcase from './components/presentation/ProjectShowcase';
import PresentationSummary from './components/presentation/PresentationSummary';
import VersionBadge from './components/VersionBadge';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  if (status === 'checking') return null;
  if (status === 'unauthenticated') return <LoginScreen />;
  return <>{children}</>;
}

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('hackathon-dark-mode', false);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthGate>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<HackathonList darkMode={darkMode} onToggleDarkMode={() => setDarkMode((p) => !p)} />}
              />
              <Route
                path="/hackathons/:hackathonId"
                element={<HackathonDetail darkMode={darkMode} onToggleDarkMode={() => setDarkMode((p) => !p)} />}
              />
              <Route
                path="/hackathons/:hackathonId/present"
                element={<PresentationRoot darkMode={darkMode} onToggleDarkMode={() => setDarkMode((p) => !p)} />}
              >
                <Route index element={<PresentationOverview />} />
                <Route path="summary" element={<PresentationSummary />} />
                <Route path=":projectId" element={<ProjectShowcase />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthGate>
      </AuthProvider>
      <VersionBadge />
    </ThemeProvider>
  );
}
