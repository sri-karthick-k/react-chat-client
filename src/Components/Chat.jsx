/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../Styles/Chat.css";
import { toast } from 'react-toastify';
import UserContext from '../contexts/UserContext.js'
import DangerButton from './Comps/DangerButton.jsx';
import logoutFunc from '../helpers/logoutFunc.js';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const messagesEndRef = useRef(null); // Create a ref to the end of the messages list

  const loggedInUser = UserContext.getUserDetails('username')
  const selectedUser = UserContext.getUserDetails('selectedUser')
  const selectedUserId = parseInt(UserContext.getUserDetails('selectedUserId'))

  useEffect(() => {
    console.log(loggedInUser)
    console.log(selectedUser)
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/messages', {
          params: { receiverId: selectedUserId },
          withCredentials: true
        });

        if(response.status === 200){
          setMessages(response.data.messages);
        } else if (response.status === 401){
          toast.error("Session timed out! Please login again")
          setTimeout(()=>{
              logoutFunc();
              window.location = "/"
          }, 1000);
        }
      } catch (error) {
        if(error.code === 'ERR_NETWORK'){
          toast.error("Server is down! Please try again")
          return;
        }if (error.status === 401){
          toast.error("Session timed out! Please login again")
          setTimeout(()=>{
              logoutFunc();
              window.location = "/"
          }, 1000);
        } else {
          toast.error(error)
        }
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws');

    ws.onopen = () => {
      console.log('WebSocket connection established');
      const msgData = {
        sender_username: loggedInUser,
        content: ''
      };
      ws.send(JSON.stringify(msgData));
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (Array.isArray(messageData)) {
        setMessages((prevMessages) => [...prevMessages, ...messageData]);
      } else {
        setMessages((prevMessages) => Array.isArray(prevMessages) ? [...prevMessages, messageData] : [messageData]);
      }    
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Scroll to the bottom when messages are updated

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !mediaFile) return;

    const reader = new FileReader();

    const sendMessage = (mediaBase64 = '') => {
      const msgData = {
        sender_username: loggedInUser,
        receiver_username: selectedUser,
        content: newMessage,
        media_base64: mediaBase64,
      };

      try {
        socket.send(JSON.stringify(msgData));
        setNewMessage('');
        setMediaFile(null);
        document.getElementById('fileInput').value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    if (mediaFile) {
      reader.readAsDataURL(mediaFile);
      reader.onloadend = () => {
        const mediaBase64 = reader.result.split(',')[1];
        sendMessage(mediaBase64);
      };
    } else {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 60 * 1024) { // Check if file size is greater than 60KB
      alert('File size exceeds 60KB. Please choose a smaller file.');
      setMediaFile(null);
      document.getElementById('fileInput').value = ''; // Clear file input
    } else {
      setMediaFile(file);
    }
  };

  return (
    <div className="chat-container">
      <span className="chat-header flex-container">
        <h2>Chat with {selectedUser} </h2>
        <DangerButton />
      </span>
      <ul className="chat-messages chat-message-list">
        {messages ? (
          messages.map((message, index) => (
            <li
              key={index}
              className=
              {
                message.receiver_id == selectedUserId 
                || 
                message.receiverId == selectedUserId 
                ? 
                'message-sent' : 'message-received'
              }
            >
              <div>
                {message.media && <img src={`data:image/jpeg;base64,${message.media}`} alt="media" />}
              </div>
              <strong>
              {message.receiver_id == selectedUserId 
                || 
                message.receiverId == selectedUserId 
                ? 
                'You' : selectedUser
              }:
              </strong>
              {message.body}
            </li>
          ))
        ) : (
          <h3>Start messaging by sending a Hi!</h3>
        )}
        <div ref={messagesEndRef} /> {/* Element to scroll into view */}
      </ul>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="fileInput">{mediaFile === null ? "Choose File" : mediaFile.name}</label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
