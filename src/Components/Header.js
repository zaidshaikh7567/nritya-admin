import React, { useState, useEffect, useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Import Link from react-router-dom
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {AuthContext} from '../context/AuthProvider';
import logo from './logo.png';

function Header() {

    const { isAdmin,user,role,logout } = useContext(AuthContext);
    console.log(isAdmin,role,user)

    const handleLogout = () => {
        logout()
        window.location.reload();

    };

    return (
        <AppBar position="static" elevation={1} style={{ background: 'black', boxShadow: '5px 5px 5px rgba(30,30,30,0.5)', backdropFilter: 'blur(10px)' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Company Logo" style={{ height: 40, marginRight: 10 }} />
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                            Nritya Admin
                        </Typography>
                    </Link>
                </div>
                {isAdmin && (
                    <>
                    <p>{isAdmin ? (role === "1" ? "SuperAdmin" : "Admin") : ""}</p>
                    <Button variant="contained" onClick={handleLogout}>
                        Logout
                    </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>

    );
}

export default Header;
