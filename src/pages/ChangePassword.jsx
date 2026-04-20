import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const changePassword = async () => {
        try {
            const response = await axios.put(
                "http://localhost:3001/auth/changepassword",
                { currentPassword: currentPassword,  newPassword: newPassword },
                {
                    headers: {
                        accessToken: localStorage.getItem('accessToken'),
                    },
                }
            );
            if (response.data.error) {
                alert(response.data.error);
            } else {
                alert("Password changed successfully!");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }   
    };


  return (
    <div>
      <h1>Change Password</h1>
      <input type="password" placeholder='Current Password' onChange={(event) => setCurrentPassword(event.target.value)}/>
      <input type="password" placeholder='New Password' onChange={(event) => setNewPassword(event.target.value)}/>
      <button onClick={changePassword}> Change Password</button>
    </div>
  )
}

export default ChangePassword;
