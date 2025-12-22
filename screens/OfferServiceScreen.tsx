import React, { useState } from 'react';
import { Screen } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface OfferServiceScreenProps {
  navigateTo: (screen: Screen) => void;
  onPublishService: (title: string, description: string, category: string) => Promise<void>;
}

const OfferServiceScreen: React.FC<OfferServiceScreenProps> = ({ navigateTo, onPublishService }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onPublishService(title, description, category);
      // On success, maybe navigate to a "my services" screen or show a success message.
      // For now, we can navigate back to the provider dashboard.
      navigateTo(Screen.ProviderDashboard);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la publication du service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-200 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-6">Proposer un service</h1>

      <form className="space-y-6 bg-white p-4 rounded-xl shadow-md" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Titre du service</label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            placeholder="Ex: Cours de jardinage à domicile"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Catégorie</label>
          <select
            id="category"
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Sélectionnez une catégorie</option>
            {SERVICE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description détaillée</label>
          <textarea
            id="description"
            rows={5}
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            placeholder="Décrivez votre service, votre expérience, vos tarifs..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg text-center">{error}</div>}

        <div className="pt-2">
          <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 disabled:bg-teal-300">
            {isLoading ? 'Publication...' : 'Publier mon service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferServiceScreen;