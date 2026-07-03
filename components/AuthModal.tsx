import React from 'react';
import { Screen } from '../types';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'signup';
  onClose: () => void;
  setType: (type: 'login' | 'signup') => void;
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string, role: 'user' | 'provider', city?: string, zipCode?: string, department?: string) => void;
  error?: string | null;
  isLoading?: boolean;
  appNavigateTo: (screen: Screen) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  type,
  onClose,
  setType,
  onLogin,
  onSignUp,
  error,
  isLoading,
  appNavigateTo
}) => {
  if (!isOpen) return null;

  const handleNavigate = (screen: Screen) => {
    if (screen === Screen.Login) {
      setType('login');
    } else if (screen === Screen.SignUp) {
      setType('signup');
    } else {
      onClose();
      appNavigateTo(screen);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all focus:outline-none"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pt-8">
          {type === 'login' ? (
            <LoginScreen 
              navigateTo={handleNavigate} 
              onLogin={onLogin} 
              error={error} 
              isLoading={isLoading} 
            />
          ) : (
            <SignUpScreen 
              navigateTo={handleNavigate} 
              onSignUp={onSignUp} 
              error={error} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
