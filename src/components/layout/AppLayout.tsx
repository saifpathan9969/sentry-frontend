import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Scanner as ScannerIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Scans', icon: <ScannerIcon />, path: '/scans' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Billing', icon: <PaymentIcon />, path: '/billing' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#0d0d0d' }}>
      <Toolbar sx={{ 
        borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 700,
          color: '#b388ff',
        }}>
          🛡️ Sentry
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(179, 136, 255, 0.15)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(179, 136, 255, 0.1)',
                  borderLeft: '3px solid #b388ff',
                },
                '&:hover': {
                  bgcolor: 'rgba(179, 136, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#b388ff' }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#0d0d0d',
          borderBottom: '1px solid rgba(179, 136, 255, 0.2)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            color: '#e1bee7',
          }}>
            {menuItems.find((item) => location.pathname.startsWith(item.path))?.text || 'Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'rgba(179, 136, 255, 0.2)',
              border: '2px solid #b388ff',
              color: '#b388ff',
              fontWeight: 600,
            }}>
              {user?.email?.[0].toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: '#0d0d0d',
                border: '1px solid rgba(179, 136, 255, 0.2)',
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ color: '#b388ff' }}>
                {user?.email}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                {user?.tier} Tier
              </Typography>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(179, 136, 255, 0.15)' }} />
            <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
              <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: '#b388ff' }} /></ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ea80fc' }} /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#0d0d0d',
              borderRight: '1px solid rgba(179, 136, 255, 0.2)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#0d0d0d',
              borderRight: '1px solid rgba(179, 136, 255, 0.2)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
