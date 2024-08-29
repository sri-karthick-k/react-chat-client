/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { validateEmail } from '../helpers/validateEmail';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if(username.length < 3){
      toast.warn("Username must be minimum of 3 characters")
      return;
    }
    if(password.length < 8){
      toast.warn("password must be minimum of 8 characters")
      return;
    }
    if(!validateEmail(email)){
      alert("Invalid email")
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      },{
        withCredentials: true
      });
      // setUser(response.data.user);
      toast.success(response.data.message)
    } catch (error) {
      if(error.code === 'ERR_NETWORK'){
        toast.error("Server is down! Please try again")
      }
      toast.error(error.response.data.error)
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-box">

      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
