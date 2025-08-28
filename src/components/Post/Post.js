import React, { useState, useEffect, useRef } from 'react'; 
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
import ShareIcon from '@mui/icons-material/Share';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';
// Yorumlar için gerekli bileşenleri import ettiğimizi varsayıyorum
// import Comment from '../Comment/Comment';
// import CommentForm from '../Comment/CommentForm';

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
    const { title, text, userName, userId, postId, postLikes } = props;
    
    // --- POST İÇİN MEVCUT STATE'LER ---
    const [expanded, setExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false); 
    const [likeId, setLikeId] = useState(null);
    
    // --- YORUMLAR İÇİN GEREKLİ STATE'LER ---
    const [error, setError] = useState(null);
    const [commentList, setCommentList] = useState([]);

    const currentUser = 1;

    // --- YORUMLARI ÇEKEN VE YENİLEYEN FONKSİYON ---
    const fetchComments = () => {
        fetch(`/comments?postId=${postId}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCommentList(result);
                },
                (error) => {
                    setError(error);
                }
            );
    };

    // --- BEĞENME FONKSİYONU ---
    const handleLike = () => {
        setIsLiked(!isLiked);
        // ... (fetch isteği kodu aynı kalıyor) ...
        const likeRequest = { postId: postId, userId: currentUser };
        const url = isLiked ? `/likes/${likeId}` : "/likes";
        const method = isLiked ? "DELETE" : "POST";

        fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: method === "POST" ? JSON.stringify(likeRequest) : undefined })
            .then(res => { if (method === "POST") return res.json(); })
            .then(data => { if (method === "POST") { setLikeId(data.id); } else { setLikeId(null); } })
            .catch(err => { console.log(err); setIsLiked(isLiked); });
    };

    // --- GENİŞLETME BUTONU TIKLAMA FONKSİYONU ---
    const handleExpandClick = () => {
      // Yorumları sadece genişletme alanını ilk açarken çekelim
      if (!expanded) {
          fetchComments();
      }
      setExpanded(!expanded);
    };

    // --- LIKE'LARI KONTROL EDEN useEffect ---
    useEffect(() => {
        if (postLikes) {
            const userLike = postLikes.find(like => like.userId === currentUser);
            if (userLike) {
                setIsLiked(true);
                setLikeId(userLike.id);
            }
        }
    }, [postLikes, currentUser]);

    const linkStyle = {
        textDecoration: "none",
        color: "inherit"
    };

    return (
        <div className='postContainer'> 
            <Card sx={{ maxWidth: 800, width: 800, margin: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Link to={`/users/${userId}`} style={linkStyle}>
                            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', marginRight: 2 }}>
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                        </Link>
                        <Typography variant="h6">{title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{text}</Typography>
                </CardContent>

                <CardActions disableSpacing>
                    <IconButton onClick={handleLike} aria-label="add to favorites">
                        <FavoriteIcon color={isLiked ? "error" : "default"} />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show comments">
                        <CommentIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent> 
                        {error ? "Error!" :
                        <div>
                            {commentList.map(comment => (
                                // <Comment key={comment.id} text={comment.text} userName={comment.userName} />
                                <div key={comment.id}>{comment.userName}: {comment.text}</div> // Şimdilik basit bir div
                            ))}
                            {/* Yorum formunu buraya ekleyeceğiz */}
                            {/* <CommentForm userId={currentUser} postId={postId} refreshComments={fetchComments} /> */}
                        </div>
                        }
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;