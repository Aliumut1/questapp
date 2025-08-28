// 1. Gereksiz import'ları temizledik
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function PostForm(props) {
    const { userId, refreshPosts } = props;
    
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false); // Snackbar için state

    const handlePostSubmit = () => {
    if (!title.trim() || !text.trim()) {
        alert("Title ve Text boş bırakılamaz!");
        return;
    }

    const postRequest = {
        title: title,
        text: text,
        userId: parseInt(userId) // 🔑 Long olarak gönder
    };

        console.log("Backend'e gönderilen post isteği:", postRequest);
fetch("http://localhost:8080/posts", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization":localStorage.getItem("tokenKey")
    },
    body: JSON.stringify(postRequest),
})


    .then(res => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text || "Post creation failed") });
        }
        return res.json();
    })
    .then(data => {
        console.log("Yeni post oluşturuldu:", data);
        setTitle("");
        setText("");
        if (refreshPosts) refreshPosts();
        setOpen(true);
    })
    .catch(err => {
        console.error("Post gönderme hatası:", err);
        alert("Post gönderilemedi: " + err.message);
    });
};

    // Snackbar'ı kapatacak olan ayrı ve temiz bir fonksiyon
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div className='postFormContainer'> 
             <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  Post has been created successfully!
                </Alert>
            </Snackbar>
            <Card sx={{ maxWidth: 800, width: 800, margin: 10, padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ 
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            marginRight: 2,
                            width: 60,
                            height: 60 
                        }}>
                        </Avatar>
                        
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <OutlinedInput
                                multiline
                                placeholder="Title"
                                inputProps={{ maxLength: 50 }} 
                                fullWidth
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                sx={{ marginBottom: 2 }} 
                            />
                            <OutlinedInput
                                multiline
                                placeholder="Text"
                                inputProps={{ maxLength: 250 }}
                                fullWidth
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={2} 
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button
                                           variant="contained"
                                           sx={{background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", 
                                            color:"white"}}
                                           onClick={handlePostSubmit}
                                        >
                                            Post
                                        </Button>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default PostForm;