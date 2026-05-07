import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
      const { data } = await api.post('/auth/superadmin/login', form);
      localStorage.setItem('sa_token', data.token);
      localStorage.setItem('sa_user', JSON.stringify(data.user));
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
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 100%)',
      }}
    >
      <Card sx={{ width: 420, borderRadius: 3, border: '1px solid rgba(99,102,241,0.2)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '50%',
                bgcolor: 'primary.main', display: 'flex',
                alignItems: 'center', justifyContent: 'center', mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>Super Admin</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Feature Flag Management System
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              id="sa-email" label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              required fullWidth autoFocus
            />
            <TextField
              id="sa-password" label="Password" name="password"
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
              id="sa-login-btn" type="submit" variant="contained"
              size="large" disabled={loading} sx={{ mt: 1, py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
            Use configured super admin credentials
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
