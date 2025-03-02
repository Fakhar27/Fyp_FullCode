import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from './utils/AuthContext';


export default function CompactNavbar({ darkMode, handleThemeChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleLogin = () => {
    navigate('/login');
    handleClose();
  };

  const handleRegister = () => {
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: theme => theme.palette.background.paper,
        color: theme => theme.palette.text.primary,
        boxShadow: theme => `0 1px 3px ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: 56 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          PROGEN
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleThemeChange} color="inherit" sx={{ mr: 1 }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {user ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              [
                <MenuItem key="register" onClick={handleRegister}>Register</MenuItem>,
                <MenuItem key="login" onClick={handleLogin}>Login</MenuItem>
              ]
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}