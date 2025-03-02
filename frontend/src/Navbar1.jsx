import React, { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import AuthContext from './utils/AuthContext';


export default function MenuAppBar({ darkMode, handleThemeChange, isCenterPage }) {
  const [anchorEl, setAnchorEl] = useState(null);
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position={isCenterPage ? "fixed" : "static"}
        color="transparent" style={{boxShadow:'0px 0px 0px 0px'}}
        // color="transparent" 
        // elevation={0}
        // sx={{
        //   backdropFilter: isCenterPage ? 'blur(10px)' : 'none',
        //   backgroundColor: isCenterPage ? 'rgba(255, 255, 255, 0.7)' : 'transparent'
        // }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme => theme.palette.text.primary }}>
            PROGEN
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
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
            <MenuItem>
              <Switch checked={darkMode} onChange={handleThemeChange} />
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}





// export default function MenuAppBar({ darkMode, handleThemeChange, isFixed = false }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     handleClose();
//   };

//   const handleLogin = () => {
//     navigate('/login');
//     handleClose();
//   };

//   const handleRegister = () => {
//     navigate('/');
//     handleClose();
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar 
//         position="fixed" 
//         sx={{ 
//           backgroundColor: 'transparent',
//           boxShadow: 'none',
//           backdropFilter: 'blur(10px)',
//           borderBottom: '1px solid',
//           borderColor: theme => theme.palette.divider,
//         }}
//         // position={isFixed ? "fixed" : "static"}
//         // color="transparent" style={{boxShadow:'0px 0px 0px 0px'}}
//       >
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme => theme.palette.text.primary }}>
//             PROGEN
//           </Typography>
//           <IconButton
//             size="large"
//             aria-label="account of current user"
//             aria-controls="menu-appbar"
//             aria-haspopup="true"
//             onClick={handleMenu}
//             color="inherit"
//           >
//             <AccountCircle />
//           </IconButton>
//           <Menu
//             id="menu-appbar"
//             anchorEl={anchorEl}
//             anchorOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             {user ? (
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             ) : (
//               [
//                 <MenuItem key="register" onClick={handleRegister}>Register</MenuItem>,
//                 <MenuItem key="login" onClick={handleLogin}>Login</MenuItem>
//               ]
//             )}
//             <MenuItem>
//               <Switch checked={darkMode} onChange={handleThemeChange} />
//               <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }





// export default function MenuAppBar({ darkMode, handleThemeChange }) {
//   const { user, logout } = useContext(AuthContext);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleRegister = () => {
//     navigate('/');
//     handleClose();
//   };

//   const handleLogin = () => {
//     navigate('/login');
//     handleClose();
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//           <AppBar 
//             position="static"
//             color="transparent"
//             sx={{ 
//               boxShadow: 'none', 
//               zIndex: 1000,
//               backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
//               backdropFilter: 'blur(10px)',
//             }}
//           >
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme => theme.palette.text.primary }}>
//             PROGEN
//           </Typography>
//           <IconButton
//             size="large"
//             aria-label="account of current user"
//             aria-controls="menu-appbar"
//             aria-haspopup="true"
//             onClick={handleMenu}
//             color="inherit"
//           >
//             <AccountCircle />
//           </IconButton>
//           <Menu
//             id="menu-appbar"
//             anchorEl={anchorEl}
//             anchorOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             {user ? (
//               <MenuItem onClick={logout}>Logout</MenuItem>
//             ) : (
//               [
//                 <MenuItem key="register" onClick={handleRegister}>Register</MenuItem>,
//                 <MenuItem key="login" onClick={handleLogin}>Login</MenuItem>
//               ]
//             )}
//             <MenuItem>
//               <Switch checked={darkMode} onChange={handleThemeChange} />
//               <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }






// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import Switch from '@mui/material/Switch';

// export default function MenuAppBar({ darkMode, handleThemeChange }) {
//   let user = useContext(AuthContext)

//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleRegister = () => {
//     navigate('/')
//     handleClose()
//   }

//   const handleLogin = () => {
//     navigate('/login');
//     handleClose();
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static" color="transparent" style={{boxShadow:'0px 0px 0px 0px'}}>
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             PROGEN
//           </Typography>
//           <IconButton
//             size="large"
//             aria-label="account of current user"
//             aria-controls="menu-appbar"
//             aria-haspopup="true"
//             onClick={handleMenu}
//             color="inherit"
//           >
//         <AccountCircle />
//           </IconButton>
//           <Menu
//             id="menu-appbar"
//             anchorEl={anchorEl}
//             anchorOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             {user ? 
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             :
//             <MenuItem onClick={handleRegister}>Register</MenuItem>
//             <MenuItem onClick={handleLogin}>Login</MenuItem> 
//             }
            
//             <MenuItem>
//               <Switch checked={darkMode} onChange={handleThemeChange} />
//               <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }
