import React from 'react';
import { Screen, User, ServiceCategory, Provider, Service } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import SearchIcon from '../components/icons/SearchIcon';
import PlusCircleIcon from '../components/icons/PlusCircleIcon';

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
    className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-100/50 aspect-square"
  >
    <div className="p-3 mb-3 rounded-2xl bg-teal-50 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-300">
      <category.icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
    </div>
    <h3 className="font-semibold text-gray-700 text-sm text-center group-hover:text-teal-700 transition-colors duration-300">{category.name}</h3>
  </div>
);

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">

    <div className="p-4">
      <p className="text-sm font-semibold text-teal-600">{service.category}</p>
      <h3 className="text-lg font-bold text-gray-900 mt-1">{service.title}</h3>
      {(service.city || service.department) && (
        <div className="flex items-center mt-1 text-xs text-teal-600 font-medium">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {service.city ? `${service.city} (${service.zipCode})` : service.department}
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <img src={service.provider.avatarUrl} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover" />
          <span className="ml-2 text-sm font-medium text-gray-700">{service.provider.name}</span>
        </div>
        {service.price !== undefined && (
          <span className="text-lg font-bold text-gray-900">{service.price} €</span>
        )}
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
    <div className="bg-gray-100 min-h-full pb-20">
      {/* Header Section with Greeting */}
      <header className="bg-white p-6 rounded-b-[30px] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bonjour, <span className="text-teal-600">{user.name.split(' ')[0]}</span></h1>
            <p className="text-gray-500 mt-1">Vous recherchez un service ?</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
            <img src={user.avatarUrl || 'https://via.placeholder.com/150'} alt="Profile" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
          </div>
        </div>

        {/* Main CTA - Demander un service (Green Box) */}
        <button
          onClick={() => navigateTo(Screen.RequestService)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl shadow-lg shadow-teal-200 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <PlusCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Demander un service</p>
              <p className="text-teal-100 text-sm">Trouvez de l'aide rapidement</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-full p-2">
            <svg className="w-5 h-5 text-white transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
        </button>

        {/* Improved Search Bar (Optional, fitting below or integrated) */}
        <div className="relative mt-6">
          <input
            type="text"
            placeholder="Que cherchez-vous aujourd'hui ?"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-400"
            onFocus={() => navigateTo(Screen.Find)}
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>
      </header>

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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Prestations populaires</h2>
        <div className="space-y-3">
          {services.slice(0, 4).map(service => <ServiceCard key={service.id} service={service} onSelect={onSelectService} />)}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
