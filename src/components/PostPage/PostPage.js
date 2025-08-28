import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post/Post";
// Adım 1: Yeni oluşturduğumuz authFetch fonksiyonunu import ediyoruz
import { authFetch } from "../Services/AuthService";

function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Adım 2: Standart `fetch` yerine `authFetch` kullanıyoruz.
        // `authFetch` token'ı localStorage'dan kendisi okuyup header'a ekleyecektir.
        authFetch(`/posts/${postId}`)
            .then(res => {
                // Yanıtı işleme mantığı aynı kalıyor.
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPost(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }, [postId]); // postId değiştiğinde isteği tekrarla

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (post) {
        return (
            <Post 
                key={post.id} 
                postId={post.id} 
                userId={post.userId} 
                userName={post.userName} 
                title={post.title} 
                text={post.text} 
                postLikes={post.postLikes || []}
            />
        );
    } else {
        return <div>Post not found.</div>;
    }
}

export default PostPage;