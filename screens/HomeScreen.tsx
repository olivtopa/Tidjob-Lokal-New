import React from 'react';
import { Screen, User, ServiceCategory, Provider } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import SearchIcon from '../components/icons/SearchIcon';

interface HomeScreenProps {
  user: User;
  providers: Provider[];
  navigateTo: (screen: Screen) => void;
}

const CategoryCard: React.FC<{ category: ServiceCategory }> = ({ category }) => (
  <div className="relative rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
    <img src={category.imageUrl} alt={category.name} className="w-full h-24 object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-3">
      <category.icon className="w-6 h-6 text-white mb-1" />
      <h3 className="font-bold text-white text-md">{category.name}</h3>
    </div>
  </div>
);

const ProviderCard: React.FC<{ provider: Provider }> = ({ provider }) => (
    <div className="flex items-center p-3 bg-white rounded-xl shadow-md space-x-4">
        <img className="w-16 h-16 rounded-full object-cover" src={provider.avatarUrl} alt={provider.name} />
        <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800">{provider.name}</p>
            <p className="text-sm text-teal-600">{provider.job}</p>
            <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-600 text-sm font-bold ml-1">{provider.rating}</span>
                <span className="text-gray-400 text-sm ml-2">({provider.reviews} avis)</span>
            </div>
        </div>
    </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ user, providers, navigateTo }) => {
  return (
    <div className="bg-gray-50 min-h-full">
      <header className="p-4 pt-6">
        <h1 className="text-2xl font-light text-gray-600">Bonjour,</h1>
        <p className="text-3xl font-bold text-gray-900">{user.name.split(' ')[0]} !</p>
      </header>

      <div className="px-4 mt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Que cherchez-vous aujourd'hui ?"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
            onFocus={() => navigateTo(Screen.Find)}
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>
      </div>

      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Catégories</h2>
        <div className="grid grid-cols-2 gap-4">
          {SERVICE_CATEGORIES.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      </section>

      <section className="mt-8 px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prestataires à la une</h2>
        <div className="space-y-3">
          {providers.slice(0, 3).map(prov => <ProviderCard key={prov.id} provider={prov} />)}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
