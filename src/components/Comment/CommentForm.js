// src/components/Comment/CommentForm.js

import React, { useState } from "react";
import { InputAdornment, OutlinedInput, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";

function CommentForm(props) {
    const { userId, postId, refreshComments } = props;
    const [text, setText] = useState("");

    const linkStyle = { textDecoration: "none", color: "inherit" };

    const handleSubmit = () => {
        if (!text.trim()) return;

        const commentRequest = {                                 
       // const commentRequest = { postId: postId,  esli hali böyleydi.
        // userId: userId,
        //  text: text,
            postId: postId,
            userId: localStorage.getItem("currentUser"),
            text: text,
        };

        fetch("http://localhost:8080/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey") || ""
            },
            body: JSON.stringify(commentRequest),
        })
        .then(res => {
            console.log("Sunucudan gelen yanıt:", res);
            if (!res.ok) {
                console.error("Sunucu hatası:", res.status, res.statusText);
            }
            return res.json();
        })
        .then(data => {
            console.log("Yeni yorum oluşturuldu:", data);
            setText("");
            if (refreshComments) {
                console.log("Yorum listesi yenileniyor...");
                refreshComments();
            }
        })
        .catch(err => {
            console.error("Fetch hatası:", err);
        });
    };

    return (
        <OutlinedInput
            id="outlined-adornment-amount"
            multiline
            fullWidth
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            startAdornment={
                <InputAdornment position="start">
                    <Link to={`/users/${userId}`} style={linkStyle}>
                        <Avatar aria-label="recipe" sx={{ width: 32, height: 32 }}>
                            U
                        </Avatar>                    
                    </Link>
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <Button 
                        variant="contained"
                        sx={{ background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", color: "white" }}
                        onClick={handleSubmit}
                    >
                        COMMENT
                    </Button>
                </InputAdornment>
            }
            sx={{ marginY: 2 }}
        />
    );
}

export default CommentForm;
