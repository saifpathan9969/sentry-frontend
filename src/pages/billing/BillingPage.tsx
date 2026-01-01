import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { apiClient } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

const tiers = [
  {
    name: 'free',
    displayName: 'Free',
    price: 0,
    features: [
      '10 scans per day',
      '100 scans per month',
      'Basic vulnerability detection',
      'JSON/Text reports',
      'Community support',
    ],
  },
  {
    name: 'premium',
    displayName: 'Premium',
    price: 29,
    features: [
      '100 scans per day',
      '3,000 scans per month',
      'Advanced vulnerability detection',
      'Priority scanning',
      'PDF reports',
      'Email support',
      '1 year data retention',
    ],
    recommended: true,
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 299,
    features: [
      '1,000 scans per day',
      '30,000 scans per month',
      'All vulnerability detection features',
      'Highest priority scanning',
      'Custom reports',
      'Dedicated support',
      'Unlimited data retention',
      'API access',
      'Custom integrations',
    ],
  },
];

const BillingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSubscription();
      setSubscription(data);
    } catch (err: any) {
      // 404 means no subscription, which is fine for free tier users
      if (err.response?.status !== 404) {
        console.error('Failed to load subscription:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    try {
      setUpgrading(true);
      setError('');
      const { checkout_url } = await apiClient.createCheckoutSession(tier);
      window.location.href = checkout_url;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create checkout session');
      setUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    try {
      await apiClient.cancelSubscription();
      await refreshUser();
      loadSubscription();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to cancel subscription');
    }
  };

  if (loading) {
    return <Box><LinearProgress /></Box>;
  }

  const currentTier = user?.tier || 'free';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Billing & Subscription
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Current Plan */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Plan
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={currentTier.toUpperCase()}
            color="primary"
          />
          {subscription?.status && (
            <Chip
              label={subscription.status}
              color={subscription.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          )}
        </Box>
        {subscription?.current_period_end && (
          <Typography variant="body2" color="text.secondary">
            {subscription.cancel_at_period_end
              ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
              : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
            }
          </Typography>
        )}
        {currentTier !== 'free' && !subscription?.cancel_at_period_end && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelSubscription}
            sx={{ mt: 2 }}
          >
            Cancel Subscription
          </Button>
        )}
      </Paper>

      {/* Pricing Plans */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Available Plans
      </Typography>
      <Grid container spacing={3}>
        {tiers.map((tier) => (
          <Grid item xs={12} md={4} key={tier.name}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: tier.recommended ? 2 : 1,
                borderColor: tier.recommended ? 'primary.main' : 'divider',
              }}
            >
              {tier.recommended && (
                <Chip
                  label="Recommended"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {tier.displayName}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="span">
                    ${tier.price}
                  </Typography>
                  <Typography variant="body1" component="span" color="text.secondary">
                    /month
                  </Typography>
                </Box>
                <List dense>
                  {tier.features.map((feature, idx) => (
                    <ListItem key={idx} disableGutters>
                      <CheckIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 2 }}>
                {currentTier === tier.name ? (
                  <Button fullWidth variant="outlined" disabled>
                    Current Plan
                  </Button>
                ) : currentTier === 'free' || tier.price > (tiers.find(t => t.name === currentTier)?.price || 0) ? (
                  <Button
                    fullWidth
                    variant={tier.recommended ? 'contained' : 'outlined'}
                    onClick={() => handleUpgrade(tier.name)}
                    disabled={upgrading}
                  >
                    {upgrading ? 'Processing...' : 'Upgrade'}
                  </Button>
                ) : (
                  <Button fullWidth variant="outlined" disabled>
                    Downgrade (Contact Support)
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQ */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Can I cancel anytime?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            What payment methods do you accept?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            We accept all major credit cards through Stripe, our secure payment processor.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Can I upgrade or downgrade my plan?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You can upgrade at any time. For downgrades, please contact our support team.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Do you offer refunds?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            We offer a 30-day money-back guarantee for all paid plans.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default BillingPage;
