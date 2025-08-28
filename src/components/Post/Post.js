import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { authFetch } from '../Services/AuthService'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Post(props) {
    const { title, text, userName, userId, postId, postLikes = [], onPostDeleted } = props;
    
    const [expanded, setExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false); 
    const [likeId, setLikeId] = useState(null);
    const [error, setError] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [likeCount, setLikeCount] = useState(postLikes ? postLikes.length : 0);

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedText, setEditedText] = useState(text);
    const [displayTitle, setDisplayTitle] = useState(title);
    const [displayText, setDisplayText] = useState(text);

    const currentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("tokenKey");
    useEffect(() => {
  setDisplayTitle(title);
  setDisplayText(text);
}, [title, text]);

    const fetchComments = () => {
        fetch(`/comments?postId=${postId}`, {
            headers: { "Authorization": token },
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(
            (result) => { setCommentList(result); },
            (error) => { console.error("Yorumları çekerken hata oluştu:", error); setError(error); }
        );
    };

    const handleLike = () => {
        if (!currentUser || !token) return;
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        const likeRequest = { postId: postId, userId: currentUser };
        const url = isLiked ? `/likes/${likeId}` : "/likes";
        const method = isLiked ? "DELETE" : "POST";
        fetch(url, { 
            method: method, 
            headers: { "Content-Type": "application/json", "Authorization": token }, 
            body: method === "POST" ? JSON.stringify(likeRequest) : undefined 
        })
        .then(res => { 
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            if (method === "POST") return res.json(); 
        })
        .then(data => { 
            if (method === "POST") { setLikeId(data.id); } 
            else { setLikeId(null); } 
        })
        .catch(err => { 
            console.log("Like isteği hata:", err); 
            setIsLiked(isLiked); 
            setLikeCount(likeCount);
        });
    };

    const handleDelete = () => {
        if (window.confirm("Bu postu silmek istediğinizden emin misiniz?")) {
            authFetch(`/posts/${postId}`, {
                method: 'DELETE',
            })
            .then(res => {
                if (res.ok) {
                    console.log("Post başarıyla silindi.");
                    if (onPostDeleted) onPostDeleted(postId);
                } else {
                    alert("Post silinemedi. Bu postu silme yetkiniz olmayabilir.");
                }
            })
            .catch(err => console.error("Silme işlemi sırasında hata:", err));
        }
    };

    // --- Edit kaydetme ---
    const handleUpdate = async () => {
  try {
    const updateRequest = { title: editedTitle, text: editedText };
    const res = await authFetch(`/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateRequest),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(msg || `HTTP ${res.status}`);
    }

    // Backend 204 dönebilir -> json parse etme
    setDisplayTitle(editedTitle);
    setDisplayText(editedText);
    setIsEditing(false);
  } catch (err) {
    console.error("Update error:", err);
    alert("Post güncellenemedi");
  }
};

    const handleExpandClick = () => {
        if (!expanded) {
            if (currentUser && token) fetchComments();
            else console.log("Yorumları görmek için giriş yapmalısınız.");
        }
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (postLikes && currentUser) {
            const userLike = postLikes.find(like => like.userId === parseInt(currentUser));
            if (userLike) {
                setIsLiked(true);
                setLikeId(userLike.id);
            }
        }
    }, [postLikes, currentUser]);

    const linkStyle = { textDecoration: "none", color: "inherit" };

    return (
        <div className='postContainer'> 
            <Card sx={{ maxWidth: 800, width: 800, margin: 2 }}>
                {isEditing ? (
                    <CardContent>
           <TextField fullWidth label="Title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth multiline rows={4} label="Text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsEditing(false)}>İptal</Button>
                            <Button variant="contained" onClick={handleUpdate}>Kaydet</Button>
                        </Box>
                    </CardContent>
                ) : (
                    <>
                        <CardContent>
                               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <Link to={`/users/${userId}`} style={linkStyle}>
                <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', marginRight: 2 }}>
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                           </Avatar>
               </Link>
                 <Typography variant="h6">{displayTitle}</Typography>
                    </Box>

            {currentUser && parseInt(currentUser) === userId && (
             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                           <IconButton onClick={handleDelete} aria-label="delete">
                     <DeleteIcon />
                   </IconButton>
                   <IconButton onClick={() => setIsEditing(true)} aria-label="edit">
                     <EditIcon />
                   </IconButton>
                     </Box>
                       )}
                        </Box>
                            <Typography variant="body2" color="text.secondary">{displayText}</Typography>
                        </CardContent>

                        <CardActions disableSpacing>
                            <IconButton 
                                onClick={currentUser ? handleLike : null} 
                                aria-label="add to favorites"
                                disabled={!currentUser}
                            >
                                <FavoriteIcon color={isLiked ? "error" : "default"} />
                            </IconButton>
                            <Typography variant="body2">{likeCount}</Typography>

                            <ExpandMore 
                                expand={expanded} 
                                onClick={handleExpandClick} 
                                aria-expanded={expanded} 
                                aria-label="show comments"
                            >
                                <CommentIcon />
                            </ExpandMore>
                        </CardActions>

                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent> 
                                {error ? "Error!" :
                                <div>
                                    {commentList.map(comment => (
                                        <Comment key={comment.id} text={comment.text} userId={comment.userId} userName={comment.userName} />
                                    ))}
                                    {currentUser && <CommentForm userId={currentUser} postId={postId} refreshComments={fetchComments} />}
                                </div>
                                }
                            </CardContent>
                        </Collapse>
                    </>
                )}
            </Card>
        </div>
    );
}

export default Post;
