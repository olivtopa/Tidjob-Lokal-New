import React, { useState, useMemo, useEffect } from 'react';
import { Screen, Service, User } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import SearchIcon from '../components/icons/SearchIcon';
import LocationAutocomplete from '../components/LocationAutocomplete';

interface FindServiceScreenProps {
  services: Service[];
  navigateTo: (screen: Screen) => void;
  onSelectService: (service: Service) => void;
  initialCategory?: string;
  user?: User | null;
}

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
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
        <div className="mt-2 text-gray-600 text-sm">
          <p className={isExpanded ? "whitespace-pre-line" : "line-clamp-2 whitespace-pre-line"}>{service.description}</p>
          {(service.description && service.description.length > 80) && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="text-teal-600 font-medium text-xs mt-1 hover:underline focus:outline-none"
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
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
};


const FindServiceScreen: React.FC<FindServiceScreenProps> = ({ services, navigateTo, onSelectService, initialCategory, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Tous');

  // Location Filter State
  const [filterLocation, setFilterLocation] = useState<{ city: string, zipCode: string, department: string } | null>(() => {
    if (user?.city && user?.zipCode && user?.department) {
      return { city: user.city, zipCode: user.zipCode, department: user.department };
    }
    return null;
  });

  useEffect(() => {
    setSelectedCategory(initialCategory || 'Tous');
  }, [initialCategory]);

  const categories = ['Tous', ...SERVICE_CATEGORIES.map(c => c.name)];

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

      <div className="my-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Ex: 'Tonte de pelouse'"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

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

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto pb-4 mb-2 scrollbar-hide -mx-4 px-4">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === category
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>

        {filteredServices.length > 0 ? (
          filteredServices.map(service => <ServiceCard key={service.id} service={service} onSelect={onSelectService} />)
        ) : (
          <p className="text-center text-gray-500 mt-8">Aucun service ne correspond à votre recherche.</p>
        )}
      </div>

      {/* Floating Action Button for Offering Service */}
      <button
        onClick={() => navigateTo(Screen.Offer)}
        className="fixed bottom-20 right-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center transition transform hover:scale-105 z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Proposer un service
      </button>
    </div>
  );
};

export default FindServiceScreen;
