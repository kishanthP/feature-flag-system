import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, MenuItem, Alert, Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import FlagIcon from '@mui/icons-material/Flag';
import api from '../api/axios';

export default function FlagChecker() {
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ orgName: '', key: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/organizations/public').then(({ data }) => setOrgs(data.organizations));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError('');
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!form.orgName || !form.key.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.get('/flags/check', {
        params: { orgName: form.orgName, key: form.key.trim() },
      });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || 'Could not check feature flag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1200 100%)',
        p: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <FlagIcon sx={{ color: 'primary.main', fontSize: 36 }} />
        <Box>
          <Typography variant="h4" fontWeight={800}>Feature Flag Checker</Typography>
          <Typography variant="body2" color="text.secondary">
            Check if a feature is enabled for your organization
          </Typography>
        </Box>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 480, borderRadius: 3, border: '1px solid rgba(245,158,11,0.2)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleCheck} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              id="check-org" label="Select Organization" name="orgName"
              select value={form.orgName} onChange={handleChange}
              required fullWidth
            >
              {orgs.length === 0 ? (
                <MenuItem disabled value="">Loading organizations...</MenuItem>
              ) : (
                orgs.map((org) => (
                  <MenuItem key={org._id} value={org.name}>{org.name}</MenuItem>
                ))
              )}
            </TextField>

            <TextField
              id="check-key" label="Feature Key" name="key"
              value={form.key} onChange={handleChange}
              required fullWidth
              placeholder="e.g. dark_mode"
              helperText="Enter the exact feature key to check"
            />

            <Button
              id="check-flag-btn" type="submit" variant="contained"
              size="large" disabled={loading || !form.orgName || !form.key.trim()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}
            >
              {loading ? 'Checking...' : 'Check Feature'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert>
          )}

          {result && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 1.5, py: 2,
                  bgcolor: result.isEnabled ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  borderRadius: 2,
                  border: `1px solid ${result.isEnabled ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}
              >
                {result.isEnabled ? (
                  <CheckCircleIcon sx={{ fontSize: 56, color: '#10b981' }} />
                ) : (
                  <CancelIcon sx={{ fontSize: 56, color: '#ef4444' }} />
                )}
                <Typography variant="h5" fontWeight={800}
                  sx={{ color: result.isEnabled ? '#10b981' : '#ef4444' }}
                >
                  {result.status}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Feature <strong style={{ fontFamily: 'monospace' }}>{result.key}</strong>{' '}
                  is{' '}
                  <strong style={{ color: result.isEnabled ? '#10b981' : '#ef4444' }}>
                    {result.isEnabled ? 'enabled' : 'disabled'}
                  </strong>{' '}
                  for <strong>{result.organization}</strong>
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
