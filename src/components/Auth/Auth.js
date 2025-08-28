// Auth.js
import React, { useState } from 'react';
import { FormControl, InputLabel, Input, Button, FormHelperText } from "@mui/material";
import { useNavigate } from 'react-router-dom'; // useNavigate import edin
import { logout as authLogout } from './../Services/AuthService';


function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // useNavigate'i tanımlayın

    const handleUsername = (value) => { setUsername(value); };
    const handlePassword = (value) => { setPassword(value); };

    const handleLogin = () => {
        const userRequest = { userName: username, password: password };

        fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userRequest),
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text || "Login failed") });
            }
            return res.json();
        })
        .then(result => {
            // Backend'den gelen tüm anahtarları saklayalım
            localStorage.setItem("tokenKey", result.accessToken); 
            localStorage.setItem("refreshToken", result.refreshToken); // YENİ: Refresh token'ı kaydediyoruz
            localStorage.setItem("currentUser", result.userId);
            localStorage.setItem("userName", result.userName); // Backend'den gelen userName'i kullanmak daha güvenilir
            
            // window.location.href yerine navigate kullanmak React'te daha doğrudur
            navigate("/");
        })
        .catch(err => {
            console.error("Login Error:", err);
            alert("Login Failed: " + err.message);
        });
    };

    const handleRegister = () => {
        const userRequest = { userName: username, password: password };

        fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userRequest),
        })
        .then(res => {
            if (!res.ok) {
                 return res.text().then(text => { throw new Error(text || "Registration failed") });
            }
            return res.json();
        })
        .then(result => {
            alert("Registration successful! You can now log in.");
        })
        .catch(err => {
            console.error("Register Error:", err);
            alert("Registration Failed: " + (err.message || "An error occurred."));
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 200px)' }}>
            <FormControl sx={{ marginBottom: 2 }}>
                <InputLabel>Username</InputLabel>
                <Input value={username} onChange={(e) => handleUsername(e.target.value)} /> 
            </FormControl>
            <FormControl sx={{ marginBottom: 2 }}>
                <InputLabel>Password</InputLabel>
                <Input type="password" value={password} onChange={(e) => handlePassword(e.target.value)} />
            </FormControl>
            <Button sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", marginBottom: 2 }} variant="contained" onClick={handleRegister}>
                Register
            </Button>
            <FormHelperText style={{ margin: 1 }}>Are you already registered?</FormHelperText>
            <Button sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }} variant="contained" onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}

// Auth ile ilgili fonksiyonları merkezi bir yerden (authService.js) almak daha iyi bir pratiktir.
// Ama mevcut yapıyı korumak adına buraya da ekliyoruz.
export const logout = () => {
    authLogout();
};

export const isLoggedIn = () => {
    return !!localStorage.getItem("tokenKey"); 
};

export default Auth;