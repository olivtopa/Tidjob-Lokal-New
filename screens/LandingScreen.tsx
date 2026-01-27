import React from 'react';
import { Screen } from '../types';

interface LandingScreenProps {
  navigateTo: (screen: Screen) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col h-full text-center bg-gray-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10">
        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg overflow-hidden">
          <img src="/logo.jpg" alt="Tidjob Lokal Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
          Tidjob <span className="font-light">Lokal</span>
        </h1>
        <p className="text-xl font-medium text-teal-400 mb-6 italic">
          Trouvez de l'aide ou proposez vos services près de chez vous
        </p>
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