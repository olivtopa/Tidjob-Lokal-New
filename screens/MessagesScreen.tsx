import React from 'react';
import { Conversation, User } from '../types';

interface MessagesScreenProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  currentUser: User;
}

const ConversationPreview: React.FC<{ conversation: Conversation; onSelect: () => void; currentUser: User }> = ({ conversation, onSelect, currentUser }) => {
  // Determine who defines the "correspondent" (the other person)
  // If I am the provider, the correspondent is the client.
  // If I am the client, the correspondent is the provider.
  // Using ID check is safer.
  const isMeProvider = currentUser.id === conversation.provider.id;

  // However, data might be tricky. Let's look at types.ts: provider is Provider, client is User.
  // Provider interface has {id, name, avatarUrl...}. User has {id, name...}.

  let otherName = '';
  let otherAvatar = '';

  if (isMeProvider) {
    // I am the provider -> Show Client
    otherName = conversation.client?.name || 'Client inconnu';
    otherAvatar = conversation.client?.avatarUrl || 'https://via.placeholder.com/150';
  } else {
    // I am the client -> Show Provider
    otherName = conversation.provider?.name || 'Prestataire inconnu';
    otherAvatar = conversation.provider?.avatarUrl || 'https://via.placeholder.com/150';
  }

  return (
    <button onClick={onSelect} className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
      <div className="relative">
        <img className="w-14 h-14 rounded-full object-cover" src={otherAvatar} alt={otherName} />
        {conversation.unread && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-teal-500 border-2 border-white" />}
      </div>
      <div className="flex-1 ml-4 border-b border-gray-200 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-md font-semibold text-gray-800">{otherName}</p>
            <p className="text-xs text-teal-600 font-medium mb-0.5">
              {conversation.service?.title || conversation.serviceRequest?.title || 'Service inconnu'}
            </p>
            <p className="text-sm text-gray-500 truncate max-w-[180px]">
              {conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : 'Aucun message'}
            </p>
          </div>
          {conversation.messages.length > 0 && (
            <span className="text-xs text-gray-400">{conversation.messages[conversation.messages.length - 1].timestamp}</span>
          )}
        </div>
      </div>
    </button>
  );
};


const MessagesScreen: React.FC<MessagesScreenProps> = ({ conversations, onSelectConversation, currentUser }) => {
  return (
    <div className="p-4 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-4">Messages</h1>

      {conversations.length > 0 ? (
        <div className="space-y-1">
          {conversations.map(conv => (
            <ConversationPreview key={conv.id} conversation={conv} onSelect={() => onSelectConversation(conv)} currentUser={currentUser} />
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