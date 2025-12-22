import React, { useState } from 'react';
import { Screen } from '../types';

interface LoginScreenProps {
  navigateTo: (screen: Screen) => void;
  onLogin: (email: string, password: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigateTo, onLogin, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-full flex flex-col justify-center items-center p-6 bg-slate-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-24 h-24 bg-white rounded-full mb-4 shadow-md overflow-hidden">
            <img src="/logo.jpg" alt="Tidjob Lokal Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Content de vous revoir !</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour continuer.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</div>}

          <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 disabled:bg-teal-300 disabled:cursor-not-allowed flex items-center justify-center">
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Connexion'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button onClick={() => navigateTo(Screen.SignUp)} className="font-medium text-teal-600 hover:text-teal-500">
            Inscrivez-vous
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;