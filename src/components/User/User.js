// User.js

import React from "react";
import { useParams } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import Post from "../Post/Post";
import "./User.scss";

import UserActivity from "../UserActivity/UserActivity";
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from "react";
import { Divider } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root:{
        display: "flex",
    },
}));

function User() {
    const { userId } = useParams();
    const classes = useStyles(); 
    const [user, setUser] = useState();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const getUser = () => {
        fetch("/users/" + userId, { // "http://localhost:8080" kısmını proxy'den dolayı kaldırmak daha iyidir
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("tokenKey"),
            },
        })
        .then(res => res.json())
        .then(
            (result) => setUser(result),
            (error) => console.log(error)
        );
    };

    const refreshPosts = () => {
        fetch("/posts?userId=" + userId)
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    };

    useEffect(() => {
        getUser();
        refreshPosts();
    }, [userId]); // userId değiştiğinde verileri yeniden çekmesi için dependency ekledik

    // ================= 1. DEĞİŞİKLİK: SİLME FONKSİYONU EKLENDİ =================
    const handlePostDeleted = (deletedPostId) => {
        // postList state'ini, silinen postu içermeyecek şekilde güncelle
        setPostList(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
    };
    // =========================================================================

    return (
        <div className="user-container" style={{ display: "flex", gap: "20px" }}>
            <div className="user-left-column">
                {user && (
                    <Avatar
                        avatarId={user.avatarId}
                        userId={userId}
                        userName={user.userName}
                        onAvatarChange={(newAvatarId) => setUser(prev => ({ ...prev, avatarId: newAvatarId }))}
                    />
                )}
            </div>

            <div className="user-right-column" style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                {/* ============= 2. DEĞİŞİKLİK: PROP EKLENDİ ============= */}
                {localStorage.getItem("currentUser") == userId && 
                    <UserActivity 
                        userId={userId} 
                        // UserActivity bileşenine hem post listesini hem de silme fonksiyonunu gönderiyoruz
                        posts={postList} 
                        onPostDeleted={handlePostDeleted}
                        refreshPosts={refreshPosts} // Post eklenince listeyi yenilemesi için bu prop'u da verelim
                    />
                }
                {/* ======================================================= */}
                {user && <h2>{user.userName}'s Posts</h2>}
                <Divider variant="middle" />
                {error ? "error" :
                    isLoaded ? postList.map(post => (
                        <Post
                            key={post.id}
                            // likes prop adı Post bileşeninde postLikes olarak geçiyor, onu düzeltelim
                            postLikes={post.postLikes} 
                            postId={post.id}
                            userId={post.userId}
                            userName={post.userName}
                            title={post.title}
                            text={post.text}
                            // ============= 3. DEĞİŞİKLİK: PROP EKLENDİ =============
                            onPostDeleted={handlePostDeleted}
                            // =======================================================
                        />
                    )) : "loading"
                }
            </div>
        </div>
    );
}

export default User;