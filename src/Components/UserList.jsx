/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

import '../Styles/UserList.css'

const UserList = ({ loggedInUser, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/chatUsers', {
                    params: { userId: loggedInUser.id },
                });
                setUsers(response.data.users);
            } catch (error) {
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
                params: { username: newUsername },
            });

            if (response.data.user) {
                onSelectUser(response.data.user);
                setNewUsername('');
                setError('');
            } else {
                setError('User not found.');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Error fetching user.');
        }
    };

    return (
        <div className='user-list-container'>
            <div className='user-list-box'>
                <h2>Select User</h2>
                <ul className="user-list">
                    {users ? (
                        users.map((user) => (
                            <li key={user.id} onClick={() => onSelectUser(user)} className='user-item'>
                                {user.username}
                            </li>
                        ))
                    ) : (
                        <h3 className="no-users">No users</h3>
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
    );
};

export default UserList;
