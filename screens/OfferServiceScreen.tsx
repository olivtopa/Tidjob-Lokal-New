import React from 'react';
import { Screen } from '../types';

interface OfferServiceScreenProps {
  navigateTo: (screen: Screen) => void;
}

const OfferServiceScreen: React.FC<OfferServiceScreenProps> = ({ navigateTo }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-6">Mes Services</h1>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-md">
        <div className="inline-block p-4 bg-teal-100 rounded-full mb-6">
            <div className="p-3 bg-teal-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Partagez vos talents</h2>
        <p className="text-gray-500 mt-2 mb-6">Vous n'avez pas encore de service à proposer. Ajoutez-en un pour que les clients puissent vous trouver !</p>
        <button className="w-full max-w-xs bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300">
          Ajouter un nouveau service
        </button>
      </div>

       <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
        <h3 className="font-bold">Astuce</h3>
        <p className="text-sm">Prenez de belles photos et rédigez une description claire pour attirer plus de clients.</p>
      </div>
    </div>
  );
};

export default OfferServiceScreen;