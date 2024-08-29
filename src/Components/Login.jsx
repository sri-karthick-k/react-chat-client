/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import '../Styles/Login.css';
import Register from './Register';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext.js'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {username, password}, {withCredentials: true});
      if (response.status === 200) {
        toast.success("Login Successful")
        // setUser(response.data.user)
        UserContext.saveUserDetails("username", response.data.user.username);
        // console.log(response)
        navigate("/user-list")
      }
    } catch (error) {
      if(error.code === 'ERR_NETWORK'){
        toast.error("Server is down! Please try again")
      }
      console.error('Login error:', error);
      if (error.response.status === 401) {
        toast.error(error.response.data.error)
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="register-container">
        <Register />
      </div>
    </div>
  );
};

export default Login;
