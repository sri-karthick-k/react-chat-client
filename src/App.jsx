import { useState } from 'react';
import Login from './Components/Login';
import UserList from './Components/UserList';
import Chat from './Components/Chat';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!loggedInUser) {
    return <Login onLogin={setLoggedInUser} />;
  }

  if (!selectedUser) {
    return <UserList loggedInUser={loggedInUser} onSelectUser={setSelectedUser} />;
  }

  return <Chat loggedInUser={loggedInUser} selectedUser={selectedUser} />;
};

export default App;
