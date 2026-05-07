import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Button, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress, Chip,
  Tooltip, Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('sa_user') || '{}');

  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [snack, setSnack] = useState('');

  const fetchOrgs = async () => {
    try {
      const { data } = await api.get('/organizations');
      setOrgs(data.organizations);
    } catch {
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleCreate = async () => {
    if (!orgName.trim()) return;
    setCreating(true);
    try {
      await api.post('/organizations', { name: orgName.trim() });
      setSnack('Organization created successfully!');
      setDialogOpen(false);
      setOrgName('');
      fetchOrgs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(99,102,241,0.2)' }} elevation={0}>
        <Toolbar>
          <BusinessIcon sx={{ color: 'primary.main', mr: 1.5 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Feature Flag System — Super Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {user.email}
          </Typography>
          <Tooltip title="Logout">
            <IconButton id="sa-logout-btn" onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>Organizations</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {orgs.length} organization{orgs.length !== 1 ? 's' : ''} registered
            </Typography>
          </Box>
          <Button
            id="create-org-btn" variant="contained" startIcon={<AddIcon />}
            onClick={() => { setError(''); setDialogOpen(true); }}
            sx={{ fontWeight: 600 }}
          >
            New Organization
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ borderRadius: 2, border: '1px solid rgba(99,102,241,0.15)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Organization Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : orgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No organizations yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  orgs.map((org, i) => (
                    <TableRow key={org._id} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{org.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={org.slug} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.15)', color: 'primary.main' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {new Date(org.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Create Org Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Create Organization</DialogTitle>
        <DialogContent>
          <TextField
            id="new-org-name" label="Organization Name" fullWidth autoFocus
            value={orgName} onChange={(e) => setOrgName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            sx={{ mt: 1 }} placeholder="e.g. ABC Company"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            id="confirm-create-org" variant="contained" onClick={handleCreate}
            disabled={creating || !orgName.trim()}
          >
            {creating ? <CircularProgress size={18} color="inherit" /> : 'Create'}
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
