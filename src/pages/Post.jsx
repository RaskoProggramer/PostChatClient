import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { authState } = useContext(AuthContext);

  // 🔹 Fetch post + comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get(
          `http://localhost:3001/posts/ById/${id}`
        );
        setPostObject(postRes.data);

        const commentsRes = await axios.get(
          `http://localhost:3001/comments/${id}`
        );
        setComments(commentsRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Add Comment
  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/comments",
        { PostId: id, comment: newComment },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      );

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      const commentToAdd = {
        id: response.data.id, // important!
        comment: newComment,
        username: response.data.username,
      };

      setComments((prev) => [...prev, commentToAdd]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Delete Comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:3001/comments/${commentId}`,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      );

      setComments((prev) =>
        prev.filter((val) => val.id !== commentId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Delete Post
  const deletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/posts/${id}`,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      );

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Edit Post
  const editPost = async (option) => {
    try {
      if (option === "title") {
        const newTitle = prompt("Enter New Title");

        if (!newTitle || !newTitle.trim()) return;

        await axios.put(
          "http://localhost:3001/posts/title",
          {
            title: newTitle,
            postId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );

        setPostObject((prev) => ({
          ...prev,
          title: newTitle,
        }));
      }

      if (option === "body") {
        const newPost = prompt("Enter New Text");

        if (!newPost || !newPost.trim()) return;

        await axios.put(
          "http://localhost:3001/posts/body",
          {
            postText: newPost,
            postId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );

        setPostObject((prev) => ({
          ...prev,
          postText: newPost,
        }));
      }
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to update post");
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
            {}
          <div
            className="title"
            onClick={authState.username === postObject.username ? () => editPost("title") : undefined}
          >
            {postObject.username ? postObject.username.charAt(0).toUpperCase() + postObject.username.slice(1) : ""}
          </div>

          <div
            className="body"
            onClick={authState.username === postObject.username ? () => editPost("body") : undefined}
          >
            {postObject.postText ? postObject.postText.charAt(0).toUpperCase() + postObject.postText.slice(1) : ""}
          </div>

          <div className="footer">
            {postObject.username ? postObject.username.charAt(0).toUpperCase() + postObject.username.slice(1) : ""}

            {authState.username === postObject.username && (
              <button onClick={deletePost}>Delete</button>
            )}
          </div>

        </div>
      </div>

      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>

        <div className="listOfComments">
          {comments.map((comment) => {
            return (
              <div key={comment.id} className="comment">
                {comment.comment.charAt(0).toUpperCase() + comment.username.slice(1)}
                <br />
                <label>Username: {comment.username.charAt(0).toUpperCase() + comment.username.slice(1)}</label>

                {authState.username === comment.username && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;