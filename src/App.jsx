import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/home';
import Create from './pages/Createpost';
import Post from './pages/Post';
import Login from './pages/login';
import Register from './pages/Register';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './helpers/AuthContext';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/profile';
import ChangePassword from './pages/ChangePassword';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false});

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({...authState, status: false});
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username: "", id: 0, status: false});
  }

  return (
    <div className='App'>
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <div className="navbar">
            <div className="links">
              {authState.status ? (
              <>
              <Link to="/"> Home Page</Link>
              <Link to="/posts"> Create A Post</Link>
              </>
              ) : (
              <>
              <Link to="/login"> Login</Link>
              <Link to="/registration"> Registration</Link>
              </>
              )}
            </div>
            <div className="loggedInContainer">
              {authState.status && <h1>{authState.username.charAt(0).toUpperCase() + authState.username.slice(1)}</h1>}
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/posts' element={<Create/>}/>
          <Route path='/posts/:id' element={<Post/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile/:id' element={<Profile/>}/>
          <Route path='/registration' element={<Register/>}/>
          <Route path='*' element={<PageNotFound/>}/>
          <Route path='/changepassword' element={<ChangePassword/>}/>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  )
}

export default App