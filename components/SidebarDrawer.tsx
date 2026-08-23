import React from 'react';
import { Screen, User } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
  onLogout: () => void;
  hasUnreadMessages?: boolean;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  user,
  currentScreen,
  navigateTo,
  onLogout,
  hasUnreadMessages = false
}) => {
  if (!isOpen) return null;

  const handleNav = (screen: Screen) => {
    navigateTo(screen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-[300px] w-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-left">
        {/* Top User Header */}
        <div>
          <div className="bg-[#0E5A3F] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              ✕
            </button>

            {user ? (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={user.avatarUrl || 'https://picsum.photos/seed/person/200'}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400/50 shadow-md"
                />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base truncate">{user.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block px-2 py-0.5 bg-emerald-700/80 rounded-full text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">
                      {user.role === 'admin' ? 'Admin' : 'Membre'}
                    </span>
                    {user.city && (
                      <span className="text-xs text-emerald-200 truncate">
                        📍 {user.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <h3 className="font-bold text-lg">Bienvenue sur Tidjob</h3>
                <p className="text-xs text-emerald-200 mt-1">Plateforme d'entraide et services</p>
                <button
                  onClick={() => handleNav(Screen.Login)}
                  className="mt-4 w-full py-2 bg-white text-[#0E5A3F] font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  Se connecter / S'inscrire
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Services & Entraide
            </div>

            <button
              onClick={() => handleNav(Screen.Find)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === Screen.Find ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">🔍</span>
              <span>Trouver un service</span>
            </button>

            <button
              onClick={() => handleNav(Screen.ProviderDashboard)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === Screen.ProviderDashboard ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">🆘</span>
              <span>Demandes de service</span>
            </button>

            <button
              onClick={() => handleNav(Screen.Offer)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === Screen.Offer ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">➕</span>
              <span>Proposer une prestation</span>
            </button>

            <button
              onClick={() => handleNav(Screen.RequestService)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === Screen.RequestService ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">📢</span>
              <span>Publier une demande</span>
            </button>

            <button
              onClick={() => handleNav(Screen.Messages)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentScreen === Screen.Messages ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">💬</span>
                <span>Messagerie</span>
              </div>
              {hasUnreadMessages && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100" />
              )}
            </button>

            <div className="pt-4 mt-2 border-t border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Mon Compte
            </div>

            {user && (
              <>
                <button
                  onClick={() => handleNav(Screen.Profile)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentScreen === Screen.Profile ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span>Mon Profil</span>
                </button>

                <button
                  onClick={() => handleNav(Screen.AccountSettings)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentScreen === Screen.AccountSettings ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">⚙️</span>
                  <span>Paramètres du compte</span>
                </button>

                <button
                  onClick={() => handleNav(Screen.ServiceHistory)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentScreen === Screen.ServiceHistory ? 'bg-emerald-50 text-[#0E5A3F] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">📋</span>
                  <span>Mes annonces & historique</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNav(Screen.Dashboard)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <span className="text-lg">👑</span>
                    <span>Administration</span>
                  </button>
                )}
              </>
            )}

            <div className="pt-4 mt-2 border-t border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Assistance & Info
            </div>

            <button
              onClick={() => handleNav(Screen.HelpCenter)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">❓</span>
              <span>Centre d'aide & FAQ</span>
            </button>

            <button
              onClick={() => handleNav(Screen.Legal)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">📄</span>
              <span>Mentions légales</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions (WhatsApp & Logout) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <a
            href="https://wa.me/596696000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
          >
            <span>💬</span>
            <span>Contacter sur WhatsApp</span>
          </a>

          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition-colors"
            >
              <span>🚪</span>
              <span>Se déconnecter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarDrawer;
