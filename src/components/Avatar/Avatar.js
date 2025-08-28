import React, { useState, useEffect } from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Modal, Box, Radio, Avatar } from "@mui/material";
import { pink } from "@mui/material/colors";

function AvatarComponent({ userName, avatarId, userId, onAvatarChange }) {
    const [open, setOpen] = useState(false);
    const avatars = [
        { id: 0, path: "/avatars/avatar1.png" },
        { id: 1, path: "/avatars/avatar2.png" },
        { id: 2, path: "/avatars/avatar3.png" },
        { id: 3, path: "/avatars/avatar4.png" },
        { id: 4, path: "/avatars/avatar5.png" },
        { id: 5, path: "/avatars/avatar6.png" },
    ];
    const [selectedValue, setSelectedValue] = useState(
        avatars.find(a => a.id === avatarId)?.path || avatars[0].path
    );

    useEffect(() => {
        const avatarPath = avatars.find(a => a.id === avatarId)?.path || avatars[0].path;
        setSelectedValue(avatarPath);
    }, [avatarId]);

    const handleSave = () => {
        const token = localStorage.getItem("tokenKey");
        if (!token) {
            alert("Token bulunamadı. Lütfen tekrar giriş yapın.");
            return;
        }

        // ====> 1. KRİTİK DÜZELTME: AKILLI TOKEN KONTROLÜ <====
        let authHeader = token;
        if (token && !token.startsWith("Bearer ")) {
            authHeader = "Bearer " + token;
        }

        const selectedAvatar = avatars.find(a => a.path === selectedValue);
        if (!selectedAvatar) return;
        
        // ====> 2. KRİTİK ADIM: "CASUS" LOG <====
        // Fetch isteğini göndermeden önce, başlığın son halini konsola yazdır.
        console.log("SUNUCUYA GÖNDERİLEN AUTHORIZATION BAŞLIĞI:", authHeader);

        fetch(`http://localhost:8080/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader, // Akıllı başlığı kullan
            },
            body: JSON.stringify({ userName: userName, avatar: selectedAvatar.id }),
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(`Sunucu hatası (${res.status}): ${text || 'Yetki reddedildi'}`) });
            }
            return res.json();
        })
        .then(updatedUser => {
            setOpen(false);
            if (onAvatarChange) onAvatarChange(updatedUser.avatar);
        })
        .catch(err => {
            console.error("Avatar güncelleme hatası:", err);
            alert("Avatar güncellenemedi: " + err.message);
        });
    };

    return (
        <Card sx={{ maxWidth: 250, margin: 1 }}>
            <CardMedia component="img" alt="User Avatar" image={selectedValue} />
            <CardContent>
                <Typography variant="h5">{userName}</Typography>
            </CardContent>
            {localStorage.getItem("currentUser") == userId && (
                <CardActions>
                    <Button onClick={() => setOpen(true)}>Avatarı Değiştir</Button>
                </CardActions>
            )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:400, bgcolor:'background.paper', p:4, boxShadow:24 }}>
                    <Typography variant="h6">Avatar Seç</Typography>
                    {avatars.map(a => (
                        <Box key={a.id} sx={{ display:'flex', alignItems:'center', mt:2 }}>
                            <Radio checked={selectedValue === a.path} onChange={() => setSelectedValue(a.path)} sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                            <Avatar src={a.path} sx={{ ml:1 }} />
                        </Box>
                    ))}
                    <Button variant="contained" fullWidth sx={{ mt:2 }} onClick={handleSave}>Kaydet</Button>
                </Box>
            </Modal>
        </Card>
    );
}

export default AvatarComponent;