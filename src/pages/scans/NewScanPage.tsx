import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

const scanModes = [
  {
    value: 'common',
    label: 'Common',
    description: 'Fast scan for common vulnerabilities',
    duration: '~5 minutes',
  },
  {
    value: 'fast',
    label: 'Fast',
    description: 'Quick comprehensive scan',
    duration: '~15 minutes',
  },
  {
    value: 'full',
    label: 'Full',
    description: 'Deep comprehensive scan',
    duration: '~30-60 minutes',
  },
];

const NewScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [targetUrl, setTargetUrl] = useState('');
  const [scanMode, setScanMode] = useState('common');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetUrl) {
      setError('Please enter a target URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(targetUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const scan = await apiClient.createScan(targetUrl, scanMode);
      navigate(`/scans/${scan.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create scan');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMode = scanModes.find((m) => m.value === scanMode);

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/scans')}
        sx={{ mb: 2 }}
      >
        Back to Scans
      </Button>

      <Typography variant="h4" gutterBottom>
        Create New Scan
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Target URL"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                helperText="Enter the URL you want to scan for vulnerabilities"
                sx={{ mb: 3 }}
                required
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Scan Mode</InputLabel>
                <Select
                  value={scanMode}
                  onChange={(e) => setScanMode(e.target.value)}
                  label="Scan Mode"
                >
                  {scanModes.map((mode) => (
                    <MenuItem key={mode.value} value={mode.value}>
                      {mode.label} - {mode.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedMode && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedMode.label} Scan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedMode.description}
                    </Typography>
                    <Typography variant="body2">
                      Estimated duration: <strong>{selectedMode.duration}</strong>
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayArrowIcon />}
                disabled={submitting}
              >
                {submitting ? 'Creating Scan...' : 'Start Scan'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Plan
            </Typography>
            <Chip
              label={user?.tier?.toUpperCase()}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" paragraph>
              You are on the {user?.tier} plan.
            </Typography>
            {user?.tier === 'free' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Upgrade to Premium for faster scans and more features!
                <Button
                  size="small"
                  onClick={() => navigate('/billing')}
                  sx={{ mt: 1 }}
                >
                  Upgrade Now
                </Button>
              </Alert>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tips
            </Typography>
            <Typography variant="body2" paragraph>
              • Make sure you have permission to scan the target
            </Typography>
            <Typography variant="body2" paragraph>
              • Start with a Common scan for quick results
            </Typography>
            <Typography variant="body2">
              • Use Full scan for comprehensive security assessment
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewScanPage;
