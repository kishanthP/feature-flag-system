import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#10b981' },
    background: { default: '#0f1117', paper: '#1a1f2e' },
  },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
});

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('admin_token') ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
