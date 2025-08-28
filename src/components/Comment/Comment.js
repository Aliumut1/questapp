import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Typography, Box } from "@mui/material"; // Gerekli bileşenleri import ediyoruz

function Comment(props) {
    const { text, userId, userName } = props;

    const linkStyle = {
        textDecoration: "none",
        color: "inherit"
    };

    return (
        // OutlinedInput yerine, daha basit ve esnek olan Box + Typography kullandık
        <Box 
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: 2 // Yorumlar arasına boşluk koyalım
            }}
        >
            <Link to={`/users/${userId}`} style={linkStyle}>
                <Avatar 
                    sx={{
                        width: 32,
                        height: 32,
                        marginRight: 2,
                        // İsteğe bağlı: Avatar rengini belirleyebilirsiniz
                        // bgcolor: 'orange' 
                    }}
                >
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
            </Link>
            
            <Typography variant="body2">
                {text}
            </Typography>
        </Box>
    );
}

export default Comment;