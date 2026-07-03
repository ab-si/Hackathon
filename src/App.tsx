import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getTheme } from './theme';
import { useLocalStorage } from './hooks/useLocalStorage';
import HackathonList from './pages/HackathonList';
import HackathonDetail from './pages/HackathonDetail';

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('hackathon-dark-mode', false);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
