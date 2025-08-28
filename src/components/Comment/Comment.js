import { Link } from "react-router-dom";
import { Avatar, Typography, Box } from "@mui/material";

function Comment(props) {
    const { text, userId, userName } = props;

    const linkStyle = {
        textDecoration: "none",
        color: "inherit"
    };

    return (
        <Box 
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: 2
            }}
        >
            <Link to={`/users/${userId}`} style={linkStyle}>
                <Avatar 
                    sx={{
                        width: 32,
                        height: 32,
                        marginRight: 2
                    }}
                >
                    {/* Bu yapının doğru olduğundan emin olun */}
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
            </Link>
            
            <Typography variant="body2">
                {text}
            </Typography>
        </Box>
    );
}

export default Comment;