import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Button, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress,
  Switch, Chip, Tooltip, Snackbar, Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ key: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchFlags = async () => {
    try {
      const { data } = await api.get('/flags');
      setFlags(data.flags);
    } catch {
      setError('Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFlags(); }, []);

  const handleCreate = async () => {
    if (!form.key.trim()) return;
    setCreating(true);
    setError('');
    try {
      await api.post('/flags', { key: form.key.trim(), description: form.description });
      setSnack('Feature flag created!');
      setDialogOpen(false);
      setForm({ key: '', description: '' });
      fetchFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flag');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (flag) => {
    try {
      await api.patch(`/flags/${flag._id}`, { isEnabled: !flag.isEnabled });
      setSnack(`"${flag.key}" ${!flag.isEnabled ? 'enabled' : 'disabled'}`);
      fetchFlags();
    } catch {
      setSnack('Failed to update flag');
    }
  };

  const handleDelete = async (id, key) => {
    setDeletingId(id);
    try {
      await api.delete(`/flags/${id}`);
      setSnack(`"${key}" deleted`);
      fetchFlags();
    } catch {
      setSnack('Failed to delete flag');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const enabledCount = flags.filter((f) => f.isEnabled).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(16,185,129,0.2)' }} elevation={0}>
        <Toolbar>
          <FlagIcon sx={{ color: 'primary.main', mr: 1.5 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700}>Feature Flags</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.organizationName || 'Your Organization'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {user.name}
          </Typography>
          <Tooltip title="Logout">
            <IconButton id="admin-logout-btn" onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 950, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Feature Flags</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {enabledCount} enabled / {flags.length} total — scoped to <strong>{user.organizationName}</strong>
            </Typography>
          </Box>
          <Button
            id="create-flag-btn" variant="contained" startIcon={<AddIcon />}
            onClick={() => { setError(''); setDialogOpen(true); }}
            sx={{ fontWeight: 600 }}
          >
            Add Flag
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ borderRadius: 2, border: '1px solid rgba(16,185,129,0.15)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Feature Key</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Toggle</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : flags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No feature flags yet. Click "Add Flag" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  flags.map((flag) => (
                    <TableRow key={flag._id} hover>
                      <TableCell>
                        <Typography fontFamily="monospace" fontWeight={600} color="primary.main">
                          {flag.key}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {flag.description || '—'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={flag.isEnabled ? 'ENABLED' : 'DISABLED'}
                          size="small"
                          color={flag.isEnabled ? 'success' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          id={`toggle-${flag._id}`}
                          checked={flag.isEnabled}
                          onChange={() => handleToggle(flag)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            id={`delete-flag-${flag._id}`}
                            size="small"
                            color="error"
                            onClick={() => handleDelete(flag._id, flag.key)}
                            disabled={deletingId === flag._id}
                          >
                            {deletingId === flag._id
                              ? <CircularProgress size={16} />
                              : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Create Flag Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Feature Flag</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            id="new-flag-key" placeholder="Feature Key" fullWidth autoFocus
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            helperText="Keys are stored in lowercase (e.g. dark_mode, new_checkout)"
          />
          <TextField
            id="new-flag-desc" label="Description (optional)" fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this flag control?"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            id="confirm-create-flag" variant="contained" onClick={handleCreate}
            disabled={creating || !form.key.trim()}
          >
            {creating ? <CircularProgress size={18} color="inherit" /> : 'Create Flag'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack} autoHideDuration={3000}
        onClose={() => setSnack('')} message={snack}
      />
    </Box>
  );
}
