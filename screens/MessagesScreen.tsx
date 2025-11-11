import React from 'react';
import { Conversation } from '../types';

interface MessagesScreenProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationPreview: React.FC<{ conversation: Conversation; onSelect: () => void; }> = ({ conversation, onSelect }) => (
  <button onClick={onSelect} className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
    <div className="relative">
      <img className="w-14 h-14 rounded-full object-cover" src={conversation.provider.avatarUrl} alt={conversation.provider.name} />
      {conversation.unread && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-teal-500 border-2 border-white" />}
    </div>
    <div className="flex-1 ml-4 border-b border-gray-200 pb-3">
      <div className="flex justify-between items-start">
        <div>
            <p className="text-md font-semibold text-gray-800">{conversation.provider.name}</p>
            <p className="text-sm text-gray-500 truncate max-w-[180px]">{conversation.messages[conversation.messages.length - 1].text}</p>
        </div>
        <span className="text-xs text-gray-400">{conversation.messages[conversation.messages.length - 1].timestamp}</span>
      </div>
    </div>
  </button>
);


const MessagesScreen: React.FC<MessagesScreenProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-4">Messages</h1>
      
      {conversations.length > 0 ? (
        <div className="space-y-1">
          {conversations.map(conv => (
            <ConversationPreview key={conv.id} conversation={conv} onSelect={() => onSelectConversation(conv)} />
          ))}
        </div>
      ) : (
        <div className="text-center pt-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mx-auto mb-4">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-700">Aucune conversation</h2>
          <p className="text-gray-500 mt-2">Lorsque vous contacterez un prestataire, vos messages apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};

export default MessagesScreen;