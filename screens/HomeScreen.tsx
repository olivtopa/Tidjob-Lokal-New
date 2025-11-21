import React from 'react';
import { Screen, User, ServiceCategory, Provider, Service } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import SearchIcon from '../components/icons/SearchIcon';

interface HomeScreenProps {
  user: User;
  providers: Provider[];
  services: Service[];
  navigateTo: (screen: Screen) => void;
  onSelectService: (service: Service) => void;
  onSelectCategory: (category: string) => void;
}

const CategoryCard: React.FC<{ category: ServiceCategory; onClick: () => void }> = ({ category, onClick }) => (
  <div
    onClick={onClick}
    className="relative rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
  >
    <img src={category.imageUrl} alt="" className="w-full h-24 object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-3">
      <category.icon className="w-6 h-6 text-white mb-1" />
      <h3 className="font-bold text-white text-md">{category.name}</h3>
    </div>
  </div>
);

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
    <img src={service.imageUrl} alt={service.title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <p className="text-sm font-semibold text-teal-600">{service.category}</p>
      <h3 className="text-lg font-bold text-gray-900 mt-1">{service.title}</h3>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <img src={service.provider.avatarUrl} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover" />
          <span className="ml-2 text-sm font-medium text-gray-700">{service.provider.name}</span>
        </div>
        <button
          onClick={() => onSelect(service)}
          className="bg-teal-500 text-white font-bold py-2 px-5 rounded-lg transition-colors hover:bg-teal-600 text-sm"
        >
          Voir
        </button>
      </div>
    </div>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ user, services, navigateTo, onSelectService, onSelectCategory }) => {
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
          {SERVICE_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => onSelectCategory(cat.name)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Services populaires</h2>
        <div className="space-y-3">
          {services.slice(0, 4).map(service => <ServiceCard key={service.id} service={service} onSelect={onSelectService} />)}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
