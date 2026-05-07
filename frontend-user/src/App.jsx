import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import FlagChecker from './pages/FlagChecker';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f59e0b' },
    background: { default: '#0f0f0f', paper: '#1c1c1c' },
  },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlagChecker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
