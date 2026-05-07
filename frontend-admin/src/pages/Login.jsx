import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin/login', form);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1117 0%, #0a2018 100%)',
      }}
    >
      <Card sx={{ width: 420, borderRadius: 3, border: '1px solid rgba(16,185,129,0.2)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '50%',
                bgcolor: 'primary.main', display: 'flex',
                alignItems: 'center', justifyContent: 'center', mb: 2,
              }}
            >
              <AdminPanelSettingsIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>Admin Login</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Organization Admin Portal
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              id="admin-email" label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              required fullWidth autoFocus
            />
            <TextField
              id="admin-password" label="Password" name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              required fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id="admin-login-btn" type="submit" variant="contained"
              size="large" disabled={loading} sx={{ mt: 1, py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
