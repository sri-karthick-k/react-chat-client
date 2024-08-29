import { useState } from 'react';
import Login from './Components/Login';
import UserList from './Components/UserList';
import Chat from './Components/Chat';

const App = () => {

  // if (!loggedInUser) {
    return <Login />;
  // }

  // if (!selectedUser) {
  //   return <UserList loggedInUser={loggedInUser} onSelectUser={setSelectedUser} />;
  // }

  // return <Chat loggedInUser={loggedInUser} selectedUser={selectedUser} />;
};

export default App;
