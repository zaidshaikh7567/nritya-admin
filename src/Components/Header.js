import React, { useState, useEffect, useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Import Link from react-router-dom
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {AuthContext} from '../context/AuthProvider';
import logo from './logo.png';
import { Switch, Box, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { 
  AdminPanelSettings, 
  Logout, 
  Brightness4, 
  Brightness7,
  Person 
} from '@mui/icons-material';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 58,
    height: 32,
    padding: 6,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(4px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#67569E',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#fff',
      width: 28,
      height: 28,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#000',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: '#333333',
      borderRadius: 16,
    },
  }));
  

function Header() {

    const { isAdmin,user,role,logout,darkMode, toggleDarkMode } = useContext(AuthContext);
    console.log(isAdmin,role,user)

    const handleLogout = () => {
        logout()
        window.location.reload();

    };

    return (
        <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                borderBottom: '1px solid #333333',
                backdropFilter: 'blur(10px)',
            }}
        >
            <Toolbar sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                minHeight: '64px',
                px: { xs: 2, sm: 3 }
            }}>
                {/* Logo and Brand Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Nritya Logo"
                        sx={{
                            height: 42,
                            width: 'auto',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(103, 86, 158, 0.3)',
                        }}
                    />
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AdminPanelSettings sx={{ color: '#67569E', fontSize: '1.8rem' }} />
                            <Typography 
                                variant="h5" 
                                component="div" 
                                sx={{ 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.5px',
                                    background: 'linear-gradient(45deg, #67569E 30%, #8B7AC8 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Nritya Admin
                            </Typography>
                        </Box>
                    </Link>
                </Box>

                {/* Right Section - Admin Controls */}
                {isAdmin && (
                    <Stack direction="row" spacing={2} alignItems="center">
                        {/* Dark Mode Toggle */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                                <IconButton
                                    onClick={toggleDarkMode}
                                    sx={{
                                        color: darkMode ? '#FFD700' : '#B0B0B0',
                                        '&:hover': {
                                            backgroundColor: 'rgba(103, 86, 158, 0.1)',
                                            color: '#67569E',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                            </Tooltip>
                            <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                                {darkMode ? 'Dark' : 'Light'}
                            </Typography>
                        </Box>

                        {/* Role Badge */}
                        <Chip
                            icon={<Person />}
                            label={role === "1" ? "Super Admin" : "Admin"}
                            variant="outlined"
                            sx={{
                                color: '#67569E',
                                borderColor: '#67569E',
                                backgroundColor: 'rgba(103, 86, 158, 0.1)',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'rgba(103, 86, 158, 0.2)',
                                },
                            }}
                        />

                        {/* Logout Button */}
                        <Tooltip title="Logout">
                            <Button
                                variant="contained"
                                onClick={handleLogout}
                                startIcon={<Logout />}
                                sx={{
                                    backgroundColor: '#67569E',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 3,
                                    py: 1,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 8px rgba(103, 86, 158, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#8B7AC8',
                                        boxShadow: '0 4px 12px rgba(103, 86, 158, 0.4)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Logout
                            </Button>
                        </Tooltip>
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
