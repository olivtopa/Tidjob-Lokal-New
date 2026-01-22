import React, { useState, useMemo, useEffect } from 'react';
import { Screen, Service } from '../types';
import SearchIcon from '../components/icons/SearchIcon';

interface FindServiceScreenProps {
  services: Service[];
  navigateTo: (screen: Screen) => void;
  onSelectService: (service: Service) => void;
  initialCategory?: string;
}

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">

    <div className="p-4">
      <p className="text-sm font-semibold text-teal-600">{service.category}</p>
      <h3 className="text-lg font-bold text-gray-900 mt-1">{service.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <img src={service.provider.avatarUrl} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover" />
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


const FindServiceScreen: React.FC<FindServiceScreenProps> = ({ services, navigateTo, onSelectService, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Tous');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = useMemo(() => ['Tous', ...Array.from(new Set(services.map(s => s.category)))], [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = selectedCategory === 'Tous' || service.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <div className="p-4 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4">Trouver une prestation</h1>

      <div className="relative my-4">
        <input
          type="text"
          placeholder="Ex: 'Tonte de pelouse'"
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
      </div>

      <div className="flex space-x-2 my-4 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-semibold rounded-full shadow-md whitespace-nowrap transition-colors ${selectedCategory === category
              ? 'bg-teal-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div>
        {filteredServices.length > 0 ? (
          filteredServices.map(service => <ServiceCard key={service.id} service={service} onSelect={onSelectService} />)
        ) : (
          <p className="text-center text-gray-500 mt-8">Aucun service ne correspond à votre recherche.</p>
        )}
      </div>
    </div>
  );
};

export default FindServiceScreen;
