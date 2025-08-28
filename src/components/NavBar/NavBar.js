import YourLogo from '../../assets/logo.jpg';


import React from 'react';

import { Link, useNavigate } from "react-router-dom";
import { logout, isLoggedIn } from '../Auth/Auth';

// Material-UI bileşenleri
import { Avatar, Button, AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material'; 
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../Context/ThemeContext';



function NavBar() {
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const userId = localStorage.getItem("currentUser");
    const userName = localStorage.getItem("userName");

    const handleLogout = () => {
        logout();
        navigate(0);
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit'
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {/* SOL BÖLÜM */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <Typography variant="h6" component="div">
                            <Link to="/" style={linkStyle}>
                                Home
                            </Link>
                        </Typography>
                               
                    </Box>

                    {/* ORTA BÖLÜM (FOTOĞRAF) */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img 
    src={YourLogo} 
    alt="Logo" 
    style={{ height: '40px', marginRight: '8px' }} 
/>
<Typography 
    variant="h6" 
    sx={{ 
        fontWeight: 'bold', 
        color: 'white'
    }}
>
    TatTouch
</Typography>
        
    </Link>
</Box>

                    {/* SAĞ BÖLÜM */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* Tema değiştirme butonu */}
                        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>

                        <div>
                            {isLoggedIn() ? (
                                <>
                                    <Button 
                                        component={Link} 
                                        to={`/users/${userId}`} 
                                        color="inherit" 
                                        startIcon={<AccountCircleIcon />}
                                    >
                                        My Profile
                                    </Button>
                                    <IconButton onClick={handleLogout} color="inherit" aria-label="logout">
                                        <LogoutIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/auth"
                                    startIcon={<LockOpenIcon />}
                                >
                                    Login/Register
                                </Button>
                            )}
                        </div>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;