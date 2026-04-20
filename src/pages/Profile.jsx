import React, { useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../helpers/AuthContext';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:3001/auth/basicInfo/${id}`
        );
        setUsername(userRes.data.username);

        const postsRes = await axios.get(
          `http://localhost:3001/posts/ByUserId/${id}`
        );
        setListOfPosts(postsRes.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username.charAt(0).toUpperCase() + username.slice(1)}</h1>

        {authState.id === parseInt(id) && (
          <button onClick={() => navigate("/changepassword")}>
            Change My Password
          </button>
        )}
      </div>

      <div className="listOfPost">
        {listOfPosts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          listOfPosts.map((value) => (
            <div className="post" key={value.id}>
              <div className="title">{value.title}</div>

              <div
                className="body"
                onClick={() => navigate(`/posts/${value.id}`)}
              >
                {value.postText.charAt(0).toUpperCase() + value.username.slice(1)}
              </div>

              <div className="footer">
                <div className="username">{value.username.charAt(0).toUpperCase() + value.username.slice(1)}</div>

                <div className="buttons">
                  <label>{value.Likes?.length || 0}</label>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;