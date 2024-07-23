/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../Styles/Chat.css";

const Chat = ({ loggedInUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const messagesEndRef = useRef(null); // Create a ref to the end of the messages list

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/messages', {
          params: { senderId: loggedInUser.id, receiverId: selectedUser.id },
        });

        setMessages(response.data.messages);
        console.log(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [loggedInUser, selectedUser]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws');

    ws.onopen = () => {
      console.log('WebSocket connection established');
      const msgData = {
        sender_username: loggedInUser.username,
        content: ''
      };
      ws.send(JSON.stringify(msgData));
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log(messageData);
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
  }, [loggedInUser.username]);

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
        sender_username: loggedInUser.username,
        receiver_username: selectedUser.username,
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
      <h2 className="chat-header">Chat with {selectedUser.username}</h2>
      <ul className="chat-messages chat-message-list">
        {messages ? (
          messages.map((message, index) => (
            <li
              key={index}
              className={message.senderId === loggedInUser.id || message.sender_id === loggedInUser.id ? 'message-sent' : 'message-received'}
            >
              <div>
                {message.media && <img src={`data:image/jpeg;base64,${message.media}`} alt="media" />}
              </div>
              <strong>
                {message.senderId === loggedInUser.id || message.sender_id === loggedInUser.id ? 'You' : selectedUser.username}:
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
