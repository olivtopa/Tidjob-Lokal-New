
import React, { useState } from 'react';
import { Screen, User } from '../types';
import QRCode from 'react-qr-code';


interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  navigateTo: (screen: Screen) => void;
  unreadCount?: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, navigateTo, unreadCount = 0 }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };


  const menuItems = [
    {
      label: 'Paramètres du compte',
      action: () => {
        navigateTo(Screen.AccountSettings);
      },
      icon: '⚙️' // Gear
    },
    {
      label: 'Messagerie',
      action: () => navigateTo(Screen.Messages),
      icon: '💬',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      label: 'Mes Services pro',
      action: () => navigateTo(Screen.ProviderServices),
      icon: '🛠️'
    },
    {
      label: 'Mes Besoins',
      action: () => navigateTo(Screen.ServiceHistory),
      icon: '📋'
    },
    { label: 'Centre d\'aide', action: () => navigateTo(Screen.HelpCenter), icon: '❓' },
    { label: 'Mentions légales', action: () => navigateTo(Screen.Legal), icon: '⚖️' },
    ...(isInstallable ? [{
      label: 'Installer l\'application',
      action: handleInstallClick,
      icon: '📲'
    }] : []),
    { label: 'Partager l\'application', action: () => setShowQRCode(true), icon: '🔗' },
  ];

  return (
    <div className="bg-gray-100 min-h-full pb-10">
      <div className="p-4 pt-8 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>
          <p className="text-md text-gray-500">{user.email}</p>
          <p className="text-sm text-teal-600 font-semibold mt-1">Membre de la communauté</p>
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
              <span className="flex-1 text-gray-700 font-medium flex items-center justify-between">
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2">
                    {item.badge}
                  </span>
                )}
              </span>
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
              <QRCode value="https://tidjob.com" size={200} />
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
