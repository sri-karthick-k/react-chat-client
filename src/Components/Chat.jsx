/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ loggedInUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/messages', {
          params: { senderId: loggedInUser.id, receiverId: selectedUser.id },
        });

        setMessages(response.data.messages);
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
      const msgData1 = {
        sender_username: loggedInUser.username,
        content: ""
      }
      console.log(JSON.stringify({ msgData: msgData1 }))
      ws.send(JSON.stringify({
        sender_username: loggedInUser.username,
        content: ""
      }));
    };

    ws.onmessage = (event) => {
      console.log("Message received!")
      const messageData = JSON.parse(event.data);
      console.log(messageData)
      setMessages((prevMessages) => [...prevMessages, messageData]);
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !mediaFile) return;

    const reader = new FileReader();
    let mediaBase64 = '';

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
        mediaBase64 = reader.result.split(',')[1]; // Remove the "data:image/png;base64," prefix
        sendMessage(mediaBase64);
      };
    } else {
      sendMessage();
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser.username}</h2>
      <ul>
        {messages ?

          messages.map((message, index) => (
            <li key={index}>
              <strong>{message.senderId === loggedInUser.id ? 'You' : selectedUser.username}:</strong>
              {message.body}
              {message.media && <img src={`data:image/jpeg;base64,${message.media}`} alt="media" />}
            </li>
          ))
          :
          <h3>start messaging by sending a Hi!</h3>
        }
      </ul>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <input
          type="file"
          id="fileInput"
          onChange={(e) => setMediaFile(e.target.files[0])}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
