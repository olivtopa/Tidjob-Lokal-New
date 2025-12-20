
import React, { useState } from 'react';
import { Screen, User } from '../types';
import QRCode from 'react-qr-code';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, navigateTo }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  console.log('ProfileScreen: Rendering');

  const menuItems = [
    {
      label: 'Paramètres du compte',
      action: () => {
        console.log('ProfileScreen: Clicked AccountSettings');
        console.log('ProfileScreen: Target Screen ID:', Screen.AccountSettings);
        navigateTo(Screen.AccountSettings);
      },
      icon: '⚙️'
    },
    { label: 'Historique des services', icon: '📜' },
    { label: 'Centre d\'aide', icon: '❓' },
    { label: 'Mentions légales', action: () => navigateTo(Screen.Legal), icon: '⚖️' },
    { label: 'Partager l\'application', action: () => setShowQRCode(true), icon: '🔗' },
  ];

  return (
    <div className="bg-gray-50 min-h-full pb-10">
      <div className="p-4 pt-8 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
          <p className="text-md text-gray-500">{user.email}</p>
          <p className="text-sm text-teal-600 font-semibold mt-1">{user.role === 'client' ? 'Je cherche' : 'Je propose'}</p>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-white rounded-xl shadow-md">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                console.log(`ProfileScreen: Clicked item index ${index}: ${item.label}`);
                if (item.action) {
                  console.log('ProfileScreen: Executing action for', item.label);
                  item.action();
                } else {
                  console.log('ProfileScreen: No action for', item.label);
                }
              }}
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

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowQRCode(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Partager Tidjob Lokal</h3>
            <div className="bg-white p-2 rounded-lg">
              <QRCode value={window.location.origin} size={200} />
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">Scannez ce code pour ouvrir l'application</p>
            <button
              onClick={() => setShowQRCode(false)}
              className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
