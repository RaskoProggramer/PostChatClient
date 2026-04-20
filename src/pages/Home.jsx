import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import ToggleButton from '@mui/material/ToggleButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const likedPostsSet = new Set(likedPosts);

  // 🔹 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!localStorage.getItem('accessToken')) {
          navigate('/login');
        } else {
          const response = await axios.get("http://localhost:3001/posts", {
            headers: {
              accessToken: localStorage.getItem('accessToken'),
            },
          });

          setListOfPosts(response.data.allPosts);

          setLikedPosts(
            response.data.liked.map((like) => Number(like.PostId)));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [navigate]);

  // 🔹 Like / Unlike Post
  const likeAPost = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      );

      // Update posts safely
      setListOfPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const likes = post.Likes || [];

            return {
              ...post,
              Likes: response.data.liked
                ? [...likes, {}] // add dummy like
                : likes.slice(0, -1), // remove one like
            };
          }
          return post;
        })
      );

      // Update likedPosts safely
      setLikedPosts((prevLiked) =>
        prevLiked.includes(postId)
          ? prevLiked.filter((id) => id !== postId)
          : [...prevLiked, postId]
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {listOfPosts.map((value) => {
        const isLiked = likedPostsSet.has(value.id);

        return (
          <div className="post" key={value.id}>
            <div className="title">{value.title.charAt(0).toUpperCase() + value.username.slice(1)}</div>

            <div
              className="body"
              onClick={() => navigate(`/posts/${value.id}`)}
            >
              {value.postText.charAt(0).toUpperCase() + value.username.slice(1)}
            </div>

            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`} 
                style={{ color: "white", textDecoration: "none" }}>
                  {value.username.charAt(0).toUpperCase() + value.username.slice(1)}
                </Link>
              </div>

              <div className="buttons">
                <ToggleButton
                value="like"
                selected={isLiked}
                onChange={() => likeAPost(value.id)}
                >
                  <ThumbUpIcon
                  sx={{color: isLiked ? "red" : "gray", fontSize: "20px"}}/>
                </ToggleButton>
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;