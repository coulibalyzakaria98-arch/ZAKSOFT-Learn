import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import io from 'socket.io-client';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://zaksoft-learn-backend.onrender.com' // URL de votre backend de production
    : 'http://localhost:3001'; // URL de votre backend local

  useEffect(() => {
    // Initialise la connexion socket
    socketRef.current = io(apiUrl, {
      transports: ['websocket'] // Force le WebSocket pour éviter les erreurs CORS avec polling
    });

    // Réception des messages
    socketRef.current.on('chat message', (msg) => {
      setMessages(prev => [...prev, { text: msg, sender: 'other' }]);
    });
    
    // Message de bienvenue
    setMessages([{ 
      text: "Bonjour ! Comment puis-je vous aider à propos de nos formations ?", 
      sender: 'other',
      isBot: true
    }]);

    // Nettoyage à la déconnexion
    return () => socketRef.current.disconnect();
  }, [apiUrl]);

  useEffect(() => {
    // Auto-scroll vers le dernier message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const message = { text: input, sender: 'me' };
      setMessages(prev => [...prev, message]);
      socketRef.current.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-all transform hover:scale-110 focus:outline-none"
        >
          <MessageSquare size={32} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-[28rem] rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="bg-violet-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">Support ZAKSOFT</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-violet-700 p-1 rounded-full">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.isBot && <Bot className="w-8 h-8 mr-2 text-violet-500 flex-shrink-0"/>}
                <div className={`py-2 px-4 rounded-2xl max-w-xs ${msg.sender === 'me' ? 'bg-violet-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t flex items-center bg-white rounded-b-2xl">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="w-full px-4 py-2 bg-slate-100 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button type="submit" className="ml-3 text-violet-600 hover:text-violet-700 transition-colors p-2 rounded-full disabled:opacity-50" disabled={!input.trim()}>
              <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
