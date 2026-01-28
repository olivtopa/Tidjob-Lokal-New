import React, { useState, useMemo, useEffect } from 'react';
import { Screen, Service } from '../types';
import SearchIcon from '../components/icons/SearchIcon';
import LocationAutocomplete from '../components/LocationAutocomplete';

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
      {(service.city || service.department) && (
        <div className="flex items-center mt-1 text-xs text-teal-600 font-medium mb-1">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {service.city ? `${service.city} (${service.zipCode})` : service.department}
        </div>
      )}
      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
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
          Contacter
        </button>
      </div>
    </div>
  </div>
);


const FindServiceScreen: React.FC<FindServiceScreenProps> = ({ services, navigateTo, onSelectService, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Tous');

  // Location Filter State
  const [filterLocation, setFilterLocation] = useState<{ city: string, zipCode: string, department: string } | null>(null);

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

      let matchesLocation = true;
      if (filterLocation) {
        // Filter logic: Match City OR Department
        // If a city is selected, we ideally match exact city OR zip. 
        // If only department is used (rare in this autocomplete but possible if we handled it), we match department.
        // Let's implement robust matching:
        // 1. If service has no location, it might be hidden or shown depending on preference. Let's show it or hide it? 
        //    For now, if filtering by location, hide services without location OR mismatch.
        if (service.city) {
          matchesLocation = service.city.toLowerCase() === filterLocation.city.toLowerCase();
        } else if (service.department) {
          // Fallback to department match if service has no city
          matchesLocation = service.department.includes(filterLocation.department) || filterLocation.department.includes(service.department);
        } else {
          // Service has no location data -> exclude if filter is active
          matchesLocation = false;
        }
      }

      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [services, searchTerm, selectedCategory, filterLocation]);

  return (
    <div className="p-4 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4">Trouver une prestation</h1>

      <div className="relative my-4 space-y-3">
        <input
          type="text"
          placeholder="Ex: 'Tonte de pelouse'"
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon className="absolute left-4 top-4 w-6 h-6 text-gray-400" />

        {/* Location Filter */}
        <div className="relative z-20">
          <LocationAutocomplete
            onSelect={(loc) => setFilterLocation(loc)}
            placeholder="Filtrer par ville..."
          />
          {filterLocation && (
            <button
              onClick={() => setFilterLocation(null)}
              className="text-xs text-red-500 mt-1 hover:underline"
            >
              Effacer le filtre lieu ({filterLocation.city})
            </button>
          )}
        </div>
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
