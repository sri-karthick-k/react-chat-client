import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import UserList from './Components/UserList.jsx';
import Chat from './Components/Chat.jsx';
import Login from './Components/Login.jsx';
import { UserProvider } from './contexts/UserContext.jsx';


export const Main = () => {
  return (
    <React.StrictMode>
      <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <ToastContainer theme='dark' />
      </Router>
      </UserProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
