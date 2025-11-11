
import React from 'react';
import { Screen, User } from '../types';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, navigateTo }) => {
  const menuItems = [
    { label: 'Paramètres du compte', icon: '⚙️' },
    { label: 'Historique des services', icon: '📜' },
    { label: 'Centre d\'aide', icon: '❓' },
    { label: 'Mentions légales', action: () => navigateTo(Screen.Legal) , icon: '⚖️' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="p-4 pt-8 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
          <p className="text-md text-gray-500">{user.email}</p>
          <p className="text-sm text-teal-600 font-semibold mt-1">{user.role === 'client' ? 'Client' : 'Prestataire'}</p>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-white rounded-xl shadow-md">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              onClick={item.action}
              className={`w-full flex items-center p-4 text-left ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
              <span className="text-xl mr-4">{item.icon}</span>
              <span className="flex-1 text-gray-700 font-medium">{item.label}</span>
              <span className="text-gray-400">&gt;</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
