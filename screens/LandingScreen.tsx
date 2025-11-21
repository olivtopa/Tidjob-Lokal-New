import React from 'react';
import { Screen } from '../types';

interface LandingScreenProps {
  navigateTo: (screen: Screen) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col h-full text-center bg-gray-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10">
        <div className="w-24 h-24 bg-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
          Tidjob <span className="font-light">Lokal</span>
        </h1>
        <p className="max-w-md text-lg text-gray-300 mb-8">
          Tidjob-Lokal connecte voisins et prestataires locaux pour tous vos besoins du quotidien. Trouvez de l'aide ou proposez vos services en quelques clics, en toute confiance et simplicité.
        </p>
      </div>
      <div className="p-6 pb-12 z-10">
        <button
          onClick={() => navigateTo(Screen.SignUp)}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4"
        >
          Créer un compte
        </button>
        <button
          onClick={() => navigateTo(Screen.Login)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl text-lg transition duration-300"
        >
          Se connecter
        </button>
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://picsum.photos/seed/community/800/1200')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
    </div>
  );
};

export default LandingScreen;