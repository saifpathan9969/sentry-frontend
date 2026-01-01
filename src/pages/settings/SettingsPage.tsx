import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [apiKeyInfo, setApiKeyInfo] = useState<any>(null);
  const [newApiKey, setNewApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadApiKeyInfo();
  }, []);

  const loadApiKeyInfo = async () => {
    try {
      const info = await apiClient.getAPIKeyInfo();
      setApiKeyInfo(info);
    } catch (err) {
      console.error('Failed to load API key info:', err);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      setError('');
      const response = await apiClient.generateAPIKey();
      setNewApiKey(response.api_key);
      setShowApiKey(true);
      setMessage('API key generated successfully! Make sure to copy it now.');
      loadApiKeyInfo();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate API key');
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Are you sure? This will invalidate your current API key.')) return;
    
    try {
      setError('');
      const response = await apiClient.regenerateAPIKey();
      setNewApiKey(response.api_key);
      setShowApiKey(true);
      setMessage('API key regenerated successfully! Make sure to copy it now.');
      loadApiKeyInfo();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to regenerate API key');
    }
  };

  const handleRevokeApiKey = async () => {
    if (!confirm('Are you sure you want to revoke your API key?')) return;
    
    try {
      setError('');
      await apiClient.revokeAPIKey();
      setMessage('API key revoked successfully');
      setApiKeyInfo(null);
      setShowApiKey(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to revoke API key');
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(newApiKey);
    setMessage('API key copied to clipboard!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setMessage('Password change functionality coming soon!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="API Keys" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={user?.email || ''}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="User ID"
            value={user?.id || ''}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tier"
            value={user?.tier || ''}
            disabled
            sx={{ mb: 2 }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <form onSubmit={handleChangePassword}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              Change Password
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            API Key Management
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          {showApiKey && newApiKey && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Your API Key (copy it now, it won't be shown again):</strong>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  value={newApiKey}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton onClick={handleCopyApiKey} size="small">
                  <CopyIcon />
                </IconButton>
              </Box>
            </Alert>
          )}

          {apiKeyInfo?.has_api_key ? (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Current API Key
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Status: Active
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Created: {apiKeyInfo.created_at ? new Date(apiKeyInfo.created_at).toLocaleString() : 'N/A'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRegenerateApiKey}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRevokeApiKey}
                  >
                    Revoke
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                You don't have an API key yet. Generate one to use the API programmatically.
              </Typography>
              <Button variant="contained" onClick={handleGenerateApiKey}>
                Generate API Key
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            API Documentation
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Use your API key to authenticate requests to the API:
          </Typography>
          <Box
            component="pre"
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
            }}
          >
{`curl -X POST https://api.pentestbrain.ai/v1/scans \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"target_url": "https://example.com", "scan_mode": "common"}'`}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
