/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

import '../Styles/UserList.css'
import '../Styles/Chat.css'
import { toast } from 'react-toastify';
import UserContext from '../contexts/UserContext.js'
import logoutFunc from '../helpers/logoutFunc.js';
import DangerButton from './Comps/DangerButton.jsx';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');
    const loggedInUser = UserContext.getUserDetails("username")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/chatUsers', {
                    withCredentials: true
                });
                if(response.status === 200){
                    setUsers(response.data.users);
                } else if (response.status === 401){
                    toast.error("Session timed out! Please login again")
                    setTimeout(()=>{
                        logoutFunc();
                        window.location = "/"
                    }, 1000);
                }

            } catch (error) {
                if (error.status === 401){
                    toast.error("Session timed out! Please login again")
                    setTimeout(()=>{
                        logoutFunc();
                        window.location = "/"
                    }, 1000);
                }
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [loggedInUser]);

    const handleSelectNewUser = async () => {
        if (!newUsername.trim()) {
            setError('Please enter a username.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/userByUsername', {
                params: { username: newUsername }, withCredentials: true
            });
            console.log(response)

            if (response.data.user) {
                console.log(response.data.user)
                setError('');
                UserContext.saveUserDetails('selectedUser', response.data.user.username)
                UserContext.saveUserDetails('selectedUserId', response.data.user.id)
                window.location = "/chat"
            } else {
                setError('User not found.');
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                toast.error("Server is down! Please try again")
            }
            console.error('Error fetching user:', error);
            if (error.request.status === 404)
                setError('User not found!');
            else
                setError('Error fetching user.');
        }
    };

    const chatWithExistingUser = async(username, id) => {
        UserContext.saveUserDetails('selectedUser', username)
        UserContext.saveUserDetails('selectedUserId', id)
        window.location = "/chat"
    }

    return (
        <div className='chat-container'>
        <DangerButton />
        <div className='user-list-container'>
            <div className='user-list-box'>
                <ul className="user-list">
                    <h2>{users && users.length > 0 ? "Select User" : "Search for users"}</h2>
                    {users ? (
                        <>
                        {users.map((user) => (
                            <li 
                                key={user.id} 
                                onClick={() => chatWithExistingUser(user.username, user.id)} 
                                className='user-item'>
                                {user.username}
                            </li>
                            ))}
                        </>
                    ) : (
                        // <h3 className="no-users">No users</h3>
                        <></>
                        )}
                </ul>
                <div className='user-input-container'>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                        className='username-input'
                        />
                    <button onClick={handleSelectNewUser} className='select-button'>Select</button>
                </div>
                {error && <p className='error-message'>{error}</p>}
            </div>
        </div>
        </div>
    );
};

export default UserList;
