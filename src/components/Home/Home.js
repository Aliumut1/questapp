import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import PostForm from '../Post/PostForm';

function Home() {
    const [error, setError]         = useState(null);
    const [isLoaded, setIsLoaded]   = useState(false);
    const [postList, setPostList]   = useState([]);

    // 1. Veri çeken mantığı ayrı, yeniden kullanılabilir bir fonksiyona taşıdık.
    const fetchPosts = () => {
        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(Array.isArray(result) ? result : result.content);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    };

    // 2. useEffect, SADECE BİR KERE, bileşen ilk yüklendiğinde bu fonksiyonu çağırır.
    useEffect(() => {
        fetchPosts();
    }, []); // Boş dizi, bunun sadece bir kez çalışmasını sağlar.

    if (error) {
        return <div>Error !!!</div>;
    } else if (!isLoaded) {
        return <div> Loading...</div>;
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* 3. PostForm'a, listeyi yenilemesi için 'fetchPosts' fonksiyonunu gönderiyoruz. */}
                <PostForm userId={1} refreshPosts={fetchPosts} />

                {postList.map(post => (
                    <Post 
                        key={post.id}
                        postId={post.id}
                        title={post.title} 
                        text={post.text} 
                        userId={post.userId} 
                        userName={post.userName}
                        postLikes={post.postLikes}
                    />
                ))}
            </div>
        );
    }
}

export default Home;