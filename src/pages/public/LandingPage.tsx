import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  CloudDone as CloudIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: <SecurityIcon sx={{ fontSize: 48 }} color="primary" />,
    title: 'Comprehensive Security Scanning',
    description: 'Detect SQL injection, XSS, CSRF, and 50+ other vulnerability types with AI-powered analysis.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 48 }} color="primary" />,
    title: 'Fast & Efficient',
    description: 'Get results in minutes with our optimized scanning engine and intelligent prioritization.',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 48 }} color="primary" />,
    title: 'Detailed Reports',
    description: 'Receive actionable insights with severity ratings, fix recommendations, and CVE references.',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 48 }} color="primary" />,
    title: 'Cloud-Based Platform',
    description: 'Access from anywhere, no installation required. Scale with your needs.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" sx={{ 
        bgcolor: '#0d0d0d', 
        borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
      }}>
        <Toolbar>
          <Typography variant="h6" sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            color: '#b388ff',
          }}>
            🛡️ Sentry
          </Typography>
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} sx={{ color: '#b388ff' }}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/pricing')} sx={{ color: '#e1bee7' }}>
                Pricing
              </Button>
              <Button onClick={() => navigate('/login')} sx={{ color: '#e1bee7' }}>
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #b388ff 0%, #805acb 100%)',
                  color: '#000000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e7b9ff 0%, #b388ff 100%)',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#000000',
          background: 'linear-gradient(135deg, #000000 0%, #1a0a2e 100%)',
          color: '#e1bee7',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(179, 136, 255, 0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: '#e1bee7',
              mb: 2,
            }}
          >
            🛡️ Sentry
          </Typography>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 500,
              color: '#b388ff',
              mb: 2,
            }}
          >
            AI-Powered Security Scanner
          </Typography>
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              mb: 4,
              color: '#9e9e9e',
            }}
          >
            Protect your web applications with automated vulnerability scanning
            and intelligent threat detection
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(135deg, #b388ff 0%, #805acb 100%)',
                color: '#000000',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e7b9ff 0%, #b388ff 100%)',
                },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/pricing')}
              sx={{ 
                color: '#b388ff', 
                borderColor: '#b388ff',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#e7b9ff',
                  bgcolor: 'rgba(179, 136, 255, 0.1)',
                },
              }}
            >
              View Pricing
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#000000' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#e1bee7' }}>
          Why Choose Sentry?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 6, color: '#9e9e9e' }}
        >
          Enterprise-grade security testing made accessible
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center',
                bgcolor: '#0d0d0d',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}>
                <CardContent>
                  <Box sx={{ mb: 2, color: '#b388ff' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#e1bee7' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: '#0d0d0d', py: 8, borderTop: '1px solid rgba(179, 136, 255, 0.2)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ color: '#e1bee7' }}>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#b388ff' }}>
                  1
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: '#e1bee7' }}>
                  Enter Your Target URL
                </Typography>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  Provide the URL of the web application you want to test
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#b388ff' }}>
                  2
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: '#e1bee7' }}>
                  AI Analyzes Your Site
                </Typography>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  Our AI engine scans for vulnerabilities using advanced techniques
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#b388ff' }}>
                  3
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: '#e1bee7' }}>
                  Get Actionable Results
                </Typography>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  Receive detailed reports with fix recommendations
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#000000' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ color: '#e1bee7' }}>
            Ready to Secure Your Applications?
          </Typography>
          <Typography variant="h6" sx={{ color: '#9e9e9e', mb: 4 }}>
            Start your free trial today. No credit card required.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #b388ff 0%, #805acb 100%)',
              color: '#000000',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #e7b9ff 0%, #b388ff 100%)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0d0d0d', color: '#e1bee7', py: 4, borderTop: '1px solid rgba(179, 136, 255, 0.2)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                🛡️ Sentry
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Enterprise-grade security testing powered by artificial intelligence
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Product
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                Pricing
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                Documentation
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                About
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e', cursor: 'pointer', '&:hover': { color: '#b388ff' } }}>
                Privacy Policy
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ color: '#9e9e9e', textAlign: 'center', mt: 4 }}>
            © 2026 Sentry Security. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
