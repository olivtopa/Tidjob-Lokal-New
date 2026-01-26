import React, { useState } from 'react';
import { Screen } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import LocationAutocomplete from '../components/LocationAutocomplete';

interface OfferServiceScreenProps {
  navigateTo: (screen: Screen) => void;
  onPublishService: (title: string, description: string, category: string, price: number, zipCode?: string, city?: string, department?: string) => void;
}

const OfferServiceScreen: React.FC<OfferServiceScreenProps> = ({ navigateTo, onPublishService }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0].name);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');

  // Location state
  const [location, setLocation] = useState<{ city: string, zipCode: string, department: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Veuillez sélectionner une localisation");
      return;
    }
    // Convert price string to number
    const numericPrice = parseFloat(price);
    onPublishService(title, description, category, numericPrice, location.zipCode, location.city, location.department);
    navigateTo(Screen.ProviderServices);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-full pb-20">
      <div className="flex items-center mb-6">
        <button onClick={() => navigateTo(Screen.ProviderHome)} className="text-gray-500 mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Proposer un service</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Ex: Tonte de pelouse"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {SERVICE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Location Field */}
        <div className="z-20 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (Ville)</label>
          <LocationAutocomplete
            onSelect={(loc) => setLocation(loc)}
            placeholder="Rechercher une commune..."
          />
          {location && (
            <p className="text-green-600 text-xs mt-1">
              Sélectionné: {location.city} ({location.zipCode}) - {location.department}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 h-32"
            placeholder="Décrivez vos compétences et ce que vous proposez..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarif indicatif (€)</label>
          <input
            type="number"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-200 transition-all transform hover:scale-[1.02]"
        >
          Publier l'annonce
        </button>
      </form>
    </div>
  );
};

export default OfferServiceScreen;