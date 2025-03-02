import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CompactNavbar from './Navbar2';
import MenuAppBar from './Navbar1';

export default function ResponsiveNavbar({ darkMode, handleThemeChange }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
  
    const isCenterPage = location.pathname === '/center'; 
  
    if (isCenterPage && isSmallScreen) {
      return <CompactNavbar darkMode={darkMode} handleThemeChange={handleThemeChange} />;
    } else {
      return <MenuAppBar darkMode={darkMode} handleThemeChange={handleThemeChange} isCenterPage={isCenterPage} />;
    }
  }