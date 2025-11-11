import React from 'react';
import { Screen } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface RequestServiceScreenProps {
  navigateTo: (screen: Screen) => void;
}

const RequestServiceScreen: React.FC<RequestServiceScreenProps> = ({ navigateTo }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-6">Demander un service</h1>
      
      <form className="space-y-6 bg-white p-4 rounded-xl shadow-md">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Titre de votre demande</label>
          <input type="text" id="title" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Ex: Tondre ma pelouse" />
        </div>

        <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Catégorie</label>
            <select id="category" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none">
                <option value="">Sélectionnez une catégorie</option>
                {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={5}
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            placeholder="Décrivez votre besoin en détail. Ex: J'ai un jardin de 50m², je n'ai pas de tondeuse..."
          ></textarea>
        </div>
        
        <div className="pt-2">
            <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300">
              Publier ma demande
            </button>
        </div>
      </form>
    </div>
  );
};

export default RequestServiceScreen;