// /* eslint-disable react/prop-types */
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const UserList = ({ loggedInUser, onSelectUser }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/chatUsers', { params: { userId: loggedInUser.id } });
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, [loggedInUser]);

//   return (
//     <div>
//       <h2>Select User</h2>
//       <ul>
//         {users.map(user => (
//           <li key={user.id} onClick={() => onSelectUser(user)}>
//             {user.username}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserList;


/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Select User</h2>
            <ul>
                {
                    users ?
                        users.map((user) => (
                            <li key={user.id} onClick={() => onSelectUser(user)}>
                                {user.username}
                            </li>
                        ))
                        : <h1>No users</h1>
                }
            </ul>
            <div>
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                />
                <button onClick={handleSelectNewUser}>Select</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UserList;
