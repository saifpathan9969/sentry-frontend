import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import { CheckCircle as CheckIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const tiers = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out the platform',
    features: [
      '10 scans per day',
      '100 scans per month',
      'Basic vulnerability detection',
      'JSON/Text reports',
      'Community support',
      '30 days data retention',
    ],
  },
  {
    name: 'Premium',
    price: 29,
    description: 'For professional developers and small teams',
    features: [
      '100 scans per day',
      '3,000 scans per month',
      'Advanced vulnerability detection',
      'Priority scanning',
      'PDF reports',
      'Email support',
      '1 year data retention',
      'API access',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 299,
    description: 'For large teams and organizations',
    features: [
      '1,000 scans per day',
      '30,000 scans per month',
      'All vulnerability detection features',
      'Highest priority scanning',
      'Custom reports',
      'Dedicated support',
      'Unlimited data retention',
      'Full API access',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar position="static" sx={{ bgcolor: '#0d0d0d', borderBottom: '1px solid rgba(179, 136, 255, 0.2)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ color: '#b388ff', mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer', color: '#b388ff' }} onClick={() => navigate('/')}>
            🛡️ Sentry
          </Typography>
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} sx={{ color: '#e1bee7' }}>Dashboard</Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} sx={{ color: '#e1bee7' }}>Login</Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #b388ff 0%, #805acb 100%)',
                  color: '#000',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a0a2e 100%)', 
        color: '#e1bee7', 
        py: 8, 
        textAlign: 'center',
        borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" sx={{ color: '#9e9e9e' }}>
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </Typography>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="stretch">
          {tiers.map((tier) => (
            <Grid item xs={12} md={4} key={tier.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  bgcolor: '#0d0d0d',
                  border: tier.recommended ? '2px solid #b388ff' : '1px solid rgba(179, 136, 255, 0.2)',
                }}
              >
                {tier.recommended && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: '#b388ff',
                      color: '#000',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#e1bee7' }}>
                    {tier.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9e9e9e' }} paragraph>
                    {tier.description}
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h2" component="span" fontWeight="bold" sx={{ color: '#b388ff' }}>
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" component="span" sx={{ color: '#9e9e9e' }}>
                      /month
                    </Typography>
                  </Box>
                  <List dense>
                    {tier.features.map((feature, idx) => (
                      <ListItem key={idx} disableGutters>
                        <CheckIcon sx={{ mr: 1, fontSize: 20, color: '#b388ff' }} />
                        <ListItemText primary={feature} sx={{ '& .MuiListItemText-primary': { color: '#e1bee7' } }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <Box sx={{ p: 3 }}>
                  <Button
                    fullWidth
                    variant={tier.recommended ? 'contained' : 'outlined'}
                    size="large"
                    onClick={() => navigate(isAuthenticated ? '/billing' : '/register')}
                    sx={tier.recommended ? {
                      background: 'linear-gradient(135deg, #b388ff 0%, #805acb 100%)',
                      color: '#000',
                    } : {
                      borderColor: '#b388ff',
                      color: '#b388ff',
                    }}
                  >
                    {tier.price === 0 ? 'Get Started' : 'Subscribe'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#e1bee7' }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Can I change plans later?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Yes! You can upgrade your plan at any time. For downgrades, please contact our support team.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Is there a free trial?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Yes! Our Free plan is available forever with no credit card required. You can upgrade to a paid plan anytime.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Do you offer refunds?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                What happens if I exceed my scan limit?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Your scans will be queued until your limit resets. You can upgrade your plan for higher limits.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#b388ff' }}>
                Need a custom plan?
              </Typography>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Contact our sales team for custom Enterprise plans with tailored features and pricing.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingPage;
