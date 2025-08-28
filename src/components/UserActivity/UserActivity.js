import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import { Link, useParams } from "react-router-dom";
import "./UserActivity.scss";

// Fonksiyon artık User.js'ten `posts` ve `onPostDeleted` prop'larını alıyor
function UserActivity({ posts, onPostDeleted }) {
    const { userId } = useParams();

    // Bu bileşen, yorumlar ve beğeniler için kendi state'lerini tutmaya devam edecek
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");

    // BU useEffect, SADECE YORUMLARI VE BEĞENİLERİ ÇEKMEK İÇİN KULLANILACAK.
    useEffect(() => {
        setIsLoaded(false); // Sekmeler için veri çekilirken yükleniyor durumunu ayarla
        const token = localStorage.getItem("tokenKey");
        
        // Promise.all ile hem yorumları hem de beğenileri aynı anda çekiyoruz
        Promise.all([
            fetch(`/comments?userId=${userId}`, { headers: { "Authorization": token } }).then(res => res.json()),
            fetch(`/likes?userId=${userId}`, { headers: { "Authorization": token } }).then(res => res.json())
        ]).then(([commentsData, likesData]) => {
            setComments(commentsData || []);
            setLikes(likesData || []);
            setIsLoaded(true); // Veri çekme tamamlandı
        }).catch(error => {
            console.error("Failed to fetch user activities (comments/likes)", error);
            setError(error);
            setIsLoaded(true);
        });
    }, [userId]); // Sadece userId değiştiğinde yeniden çalışacak

    const renderContent = () => {
        if (activeTab === "posts") {
            // "My Posts" sekmesi, ÜST BİLEŞENDEN (User.js) GELEN `posts` prop'unu kullanır.
            if (!posts || posts.length === 0) return <div>No posts to display.</div>;
            return posts.map(post => (
                <Post 
                    key={post.id} 
                    postId={post.id} 
                    userId={post.userId} 
                    userName={post.userName} 
                    title={post.title} 
                    text={post.text} 
                    postLikes={post.postLikes}
                    // Silme fonksiyonunu da üst bileşenden aldığı gibi alt bileşene aktarır.
                    onPostDeleted={onPostDeleted}
                />
            ));
        } else if (activeTab === "comments") {
            // "My Comments" sekmesi, BU BİLEŞENİN KENDİ `comments` state'ini kullanır.
            if (!isLoaded) return <div>Loading comments...</div>;
            if (error) return <div>Error loading comments.</div>;
            if (comments.length === 0) return <div>No comments to display.</div>;
            return comments.map(comment => (
                <div key={comment.id} className="comment-activity">
                    <p>
                        Yorum yaptınız <Link to={`/posts/${comment.postId}`}>Bu post.</Link>: "{comment.text}"
                    </p>
                </div>
            ));
        } else if (activeTab === "likes") {
            // "My Likes" sekmesi, BU BİLEŞENİN KENDİ `likes` state'ini kullanır.
            if (!isLoaded) return <div>Loading likes...</div>;
            if (error) return <div>Error loading likes.</div>;
            if (likes.length === 0) return <div>No likes to display.</div>;
            return likes.map(like => (
                <div key={like.id} className="like-activity">
                    <p>
                        Beğendiniz <Link to={`/posts/${like.postId}`}>Bu post.</Link>.
                    </p>
                </div>
            ));
        }
        return null;
    };

    return (
        <div className="user-activity-container">
            <h2 className="activity-header">User Activities</h2>
            <div className="activity-tabs">
                <button onClick={() => setActiveTab("posts")} className={activeTab === "posts" ? "active" : ""}>My Posts</button>
                <button onClick={() => setActiveTab("comments")} className={activeTab === "comments" ? "active" : ""}>My Comments</button>
                <button onClick={() => setActiveTab("likes")} className={activeTab === "likes" ? "active" : ""}>My Likes</button>
            </div>
            <div className="activity-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default UserActivity;