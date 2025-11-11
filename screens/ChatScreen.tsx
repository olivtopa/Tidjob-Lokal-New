import React, { useState, useRef, useEffect } from 'react';
import { Screen, Conversation, User, Message } from '../types';

interface ChatScreenProps {
  conversation: Conversation;
  currentUser: User;
  navigateTo: (screen: Screen) => void;
  onSendMessage: (conversationId: string, messageText: string) => void;
}

const MessageBubble: React.FC<{ message: Message; isOwnMessage: boolean }> = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex items-end ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, currentUser, navigateTo, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(conversation.id, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button onClick={() => navigateTo(Screen.Messages)} className="text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <img src={conversation.provider.avatarUrl} alt={conversation.provider.name} className="w-10 h-10 rounded-full object-cover ml-2"/>
        <div className="ml-3">
            <h1 className="text-md font-bold text-gray-900">{conversation.provider.name}</h1>
            <p className="text-xs text-gray-500">{conversation.service.title}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-2 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="w-full p-3 border-none rounded-lg focus:ring-0 bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <button type="submit" className="ml-2 p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;