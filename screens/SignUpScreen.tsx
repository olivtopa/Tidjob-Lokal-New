import React, { useState } from 'react';
import { Screen } from '../types';
import EyeIcon from '../components/icons/EyeIcon';
import EyeOffIcon from '../components/icons/EyeOffIcon';

interface SignUpScreenProps {
  navigateTo: (screen: Screen) => void;
  onSignUp: (name: string, email: string, password: string, role: 'user' | 'provider') => void;
  error?: string | null;
  isLoading?: boolean;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigateTo, onSignUp, error, isLoading }) => {
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <div className="min-h-full flex flex-col justify-center items-center p-6 bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-24 h-24 bg-white rounded-full mb-4 shadow-md overflow-hidden">
            <img src="/logo.jpg" alt="Tidjob Lokal Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Rejoignez la communauté</h1>
          <p className="text-gray-500 mt-2">Créez votre compte en quelques secondes.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          setLocalError(null);
          if (password !== confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
          }
          onSignUp(name, email, password, role);
        }}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Je souhaite :</label>
            <div className="flex rounded-lg shadow-sm border border-gray-200">
              <button type="button" onClick={() => setRole('client')} className={`w-full px-4 py-3 text-sm font-semibold rounded-l-lg transition-colors ${role === 'client' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                Je cherche un service
              </button>
              <button type="button" onClick={() => setRole('provider')} className={`w-full px-4 py-3 text-sm font-semibold rounded-r-lg transition-colors ${role === 'provider' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                Je propose un service
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</label>
            <input type="text" id="name" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Alex Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse e-mail</label>
            <input type="email" id="email" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 pr-10"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 pr-10"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            {(localError || error) && <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">{localError || error}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 disabled:bg-teal-300 disabled:cursor-not-allowed flex items-center justify-center">
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Créer mon compte'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          En vous inscrivant, vous acceptez nos{' '}
          <button onClick={() => navigateTo(Screen.Legal)} className="font-medium text-teal-600 hover:text-teal-500">
            Termes et Conditions
          </button>.
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button onClick={() => navigateTo(Screen.Login)} className="font-medium text-teal-600 hover:text-teal-500">
            Connectez-vous
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;