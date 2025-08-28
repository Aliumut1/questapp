import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import PostForm from '../Post/PostForm';
import Box from '@mui/material/Box';
// import Post from './Post' // Bu satır fazladan olduğu için kaldırıldı

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    // Kullanıcı bilgilerini localStorage'dan al
    const currentUserId = localStorage.getItem("currentUser");
    const currentUserName = localStorage.getItem("userName");
    // const [posts, setPosts] = useState([]); // Bu state postList ile aynı işi yaptığı için kaldırıldı

    const fetchPosts = () => {
        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    // Gelen verinin bir dizi olduğundan emin olalım
                    setPostList(Array.isArray(result) ? result : []);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setIsLoaded(true);
                setError(error);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // ======================= 1. ADIM: SİLME İŞLEMİNİ YÖNETEN FONKSİYONU EKLE =======================
    // Bu fonksiyon, Post bileşeninden bir postun silindiği haberini aldığında çalışacak
    const handlePostDeleted = (deletedPostId) => {
        // setPostList'i kullanarak mevcut post listesini güncelliyoruz.
        // Silinen post dışındaki tüm postları içeren yeni bir liste oluşturuyoruz.
        setPostList(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
    };
    // ===========================================================================================

    if (error) {
        return <h2>Error: Could not load data.</h2>;
    } else if (!isLoaded) {
        return <h2>Loading...</h2>;
    } else {
        return (
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)', 
            padding: 2,                       
            }}>
                {currentUserId && 
                    <PostForm 
                        userId={currentUserId} 
                        userName={currentUserName} 
                        refreshPosts={fetchPosts} 
                    />
                }

                {postList.map(post => (
                    <Post 
                        key={post.id}
                        postId={post.id}
                        title={post.title} 
                        text={post.text} 
                        userId={post.userId} 
                        userName={post.userName}
                        postLikes={post.postLikes}
                        // ======================= 2. ADIM: FONKSİYONU PROP OLARAK POST BİLEŞENİNE GEÇ =======================
                        onPostDeleted={handlePostDeleted}
                        // ==============================================================================================
                    />
                ))}
            </Box>
        );
    }
}

export default Home;