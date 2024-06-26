import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: userInput }
    ];

    setMessages(newMessages);
    setUserInput('');

    try {
      // const response = await axios.post('http://api.imediatonautica.com.br/chat', 
      const response = await axios.post('http://127.0.0.1:5000/chat', 
      { chat_history: newMessages }, 
      { withCredentials: false });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1 vh-100 overflow-hidden chat-container">
      <main className="flex-grow-1 d-flex flex-column bg-dark-blue text-white chat-main">
        <div className="flex-grow-1 d-flex flex-column-reverse overflow-auto p-4 chat-messages" style={{ maxHeight: '80vh' }}>
          <div ref={messagesEndRef} />
          {messages.slice(0).reverse().map((message, index) => (
            <div key={index} className={`p-2 ${message.role === 'user' ? 'text-end' : 'text-start'}`}>
              <span className={`d-inline-block p-2 rounded ${message.role === 'user' ? 'bg-main-blue text-white' : 'bg-light-blue text-white'}`}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="d-flex p-4 chat-input">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="form-control me-2"
            placeholder="Digite sua mensagem..."
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
