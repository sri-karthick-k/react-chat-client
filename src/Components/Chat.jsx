  // /* eslint-disable react/prop-types */
  // import { useState, useEffect } from 'react';
  // import axios from 'axios';

  // const Chat = ({ loggedInUser, selectedUser }) => {
  //   const [messages, setMessages] = useState([]);
  //   const [newMessage, setNewMessage] = useState('');

  //   useEffect(() => {
  //     const fetchMessages = async () => {
  //       try {
  //         const response = await axios.get('http://localhost:5000/messages', { 
  //           params: { senderId: loggedInUser.Id, receiverId: selectedUser.Id } 
  //         });
  //         setMessages(response.data.messages);
  //       } catch (error) {
  //         console.error('Error fetching messages:', error);
  //       }
  //     };

  //     fetchMessages();
  //   }, [loggedInUser, selectedUser]);

  //   const handleSendMessage = async () => {
  //     if (!newMessage.trim()) return;

  //     const messageData = {
  //       senderUsername: loggedInUser.Username,
  //       receiverUsername: selectedUser.Username,
  //       content: newMessage,
  //     };

  //     try {
  //       await axios.post('http://localhost:5000/sendMessage', messageData);
  //       setMessages([...messages, { ...messageData, senderId: loggedInUser.Id, receiverId: selectedUser.Id, body: newMessage }]);
  //       setNewMessage('');
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //     }
  //   };

  //   return (
  //     <div>
  //       <h2>Chat with {selectedUser.Username}</h2>
  //       <ul>
  //         {messages.map(message => (
  //           <li key={message.id}>
  //             <strong>{message.senderId === loggedInUser.Id ? 'You' : selectedUser.Username}:</strong> {message.body}
  //           </li>
  //         ))}
  //       </ul>
  //       <div>
  //         <input 
  //           type="text" 
  //           value={newMessage} 
  //           onChange={(e) => setNewMessage(e.target.value)} 
  //           placeholder="Type your message" 
  //         />
  //         <button onClick={handleSendMessage}>Send</button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default Chat;

  /* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ loggedInUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/messages', {
          params: { senderId: loggedInUser.Id, receiverId: selectedUser.Id },
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
      ws.send(JSON.stringify({ username: loggedInUser.Username }));
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
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
  }, [loggedInUser.Username]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      sender_username: loggedInUser.Username,
      receiver_username: selectedUser.Username,
      content: newMessage,
    };

    try {
      await axios.post('http://localhost:5000/sendMessage', msgData);
      socket.send(JSON.stringify(msgData));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser.Username}</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.senderId === loggedInUser.Id ? 'You' : selectedUser.Username}:</strong> {message.body}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
