import React from 'react';
import { Screen, Service } from '../types';
import SearchIcon from '../components/icons/SearchIcon';

interface FindServiceScreenProps {
  services: Service[];
  navigateTo: (screen: Screen) => void;
  onSelectService: (service: Service) => void;
}

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
        <img src={service.imageUrl} alt={service.title} className="w-full h-40 object-cover"/>
        <div className="p-4">
            <p className="text-sm font-semibold text-teal-600">{service.category}</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <img src={service.provider.avatarUrl} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover"/>
                    <span className="ml-2 text-sm font-medium text-gray-700">{service.provider.name}</span>
                </div>
                <button 
                  onClick={() => onSelect(service)}
                  className="bg-teal-500 text-white font-bold py-2 px-5 rounded-lg transition-colors hover:bg-teal-600 text-sm"
                >
                  Contacter
                </button>
            </div>
        </div>
    </div>
);


const FindServiceScreen: React.FC<FindServiceScreenProps> = ({ services, navigateTo, onSelectService }) => {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4">Trouver un service</h1>
      
      <div className="relative my-4">
        <input
          type="text"
          placeholder="Ex: 'Tonte de pelouse'"
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
      </div>

      <div className="flex space-x-2 my-4 overflow-x-auto pb-2 -mx-4 px-4">
          <button className="px-4 py-2 text-sm font-semibold bg-teal-500 text-white rounded-full shadow-md whitespace-nowrap">Tous</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Jardinage</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Ménage</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Déménagement</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Bricolage</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Garde d'enfant</button>
          <button className="px-4 py-2 text-sm font-semibold bg-white text-gray-700 rounded-full shadow-md whitespace-nowrap">Covoiturage</button>
      </div>
      
      <div>
        {services.map(service => <ServiceCard key={service.id} service={service} onSelect={onSelectService} />)}
      </div>
    </div>
  );
};

export default FindServiceScreen;
