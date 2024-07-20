/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ loggedInUser, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/chatUsers', { params: { userId: loggedInUser.Id } });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  return (
    <div>
      <h2>Select User</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onSelectUser(user)}>
            {user.Username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
