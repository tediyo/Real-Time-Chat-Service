import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('messages', (messagesList) => {
      setMessages(messagesList);
    });

    newSocket.on('users', (usersList) => {
      setUsers(usersList);
    });

    newSocket.on('userJoined', (data) => {
      console.log(`${data.username} joined the chat`);
      // You could add a system message here if desired
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUsername(username.trim());
      socket.emit('join', { username: username.trim() });
      setIsLoading(true);
      
      // Load initial data
      socket.emit('getMessages');
      socket.emit('getUsers');
      
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        content: newMessage.trim(),
        username: currentUsername,
      };
      
      socket.emit('message', messageData);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!currentUsername) {
    return (
      <div className="username-input">
        <h2>Enter your username to join the chat</h2>
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            maxLength={20}
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="connection-status" className={isConnected ? 'connected' : 'disconnected'}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <div className="chat-header">
        Real-time Chat App
      </div>

      <div className="users-online">
        <strong>Online Users:</strong>
        {users.map(user => (
          <span key={user.id} className="user-item">
            {user.username}
          </span>
        ))}
      </div>

      <div className="chat-messages">
        {isLoading ? (
          <div className="loading">Loading messages....</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.username === currentUsername ? 'own' : 'other'
              }`}
            >
              <div className="message-header">
                {message.username}
              </div>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {formatTime(message.createdAt)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default App;

