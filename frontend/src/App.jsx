import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuAppBar from './Navbar1';
import Center from './Center';
import Register from './Register';
import ContentGenerator from './test';
import Login from './Login';
import ResponsiveNavbar from './NavbarWrapper';
import './App.css'
import './index.css'
import PrivateRoute from './utils/Private';
import AuthProvider from './utils/ContextAPI';
import Audios from './Audios';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const isCenter = location.pathname === '/center';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ResponsiveNavbar darkMode={darkMode} handleThemeChange={handleThemeChange} />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/center" element={<PrivateRoute><Center /></PrivateRoute>} />
          <Route path="/test" element={<PrivateRoute><ContentGenerator /></PrivateRoute>} />
          <Route path='/audio' element={<PrivateRoute><Audios/></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}


// function AppContent() {
//   const [darkMode, setDarkMode] = useState(false);
//   const location = useLocation();

//   // Create theme with dark mode toggle
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: darkMode ? 'dark' : 'light',
//         },
//       }),
//     [darkMode]
//   );

//   // Toggle dark mode
//   const handleThemeChange = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         {/* Use the ResponsiveNavbar here */}
//         <ResponsiveNavbar darkMode={darkMode} handleThemeChange={handleThemeChange} />
//         <Routes>
//           <Route path="/" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/center" element={<PrivateRoute><Center /></PrivateRoute>} />
//         </Routes>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;








// function AppContent() {
//   const [darkMode, setDarkMode] = useState(false);
//   const location = useLocation();

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: darkMode ? 'dark' : 'light',
//         },
//       }),
//     [darkMode]
//   );

//   const handleThemeChange = () => {
//     setDarkMode(!darkMode);
//   };

//   const isCenter = location.pathname === '/center';

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <MenuAppBar darkMode={darkMode} handleThemeChange={handleThemeChange} isFixed={isCenter} />
//         <Routes>
//           <Route path="/" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/center" element={<PrivateRoute><Center /></PrivateRoute>} />
//         </Routes>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;









// import { useState } from 'react'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { Box } from '@mui/material';
// import MenuAppBar from './Navbar';
// import Center from './Center';
// import Register from './Register';
// import Login from './Login';
// import './App.css'
// import './index.css'
// import PrivateRoute from './utils/Private';
// import AuthContext from './utils/AuthContext';
// import AuthProvider from './utils/ContextAPI';

// function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? 'dark' : 'light',
//     },
//   });

//   const handleThemeChange = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <AuthProvider>
//         {/* <Box sx={{ position: 'relative', zIndex: 1 }}> */}
//             <MenuAppBar darkMode={darkMode} handleThemeChange={handleThemeChange} />
//             <Routes>
//               <Route path="/" element={<Register />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/center" element={<PrivateRoute><Center /></PrivateRoute>} />
//             </Routes>
//           {/* </Box> */}
//         </AuthProvider>
//       </Router>
//     </ThemeProvider>
//   )
// }

// export default App