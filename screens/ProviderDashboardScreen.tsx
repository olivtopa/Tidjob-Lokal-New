import React, { useState, useEffect } from 'react';
import { Screen, ServiceRequest } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import LocationAutocomplete from '../components/LocationAutocomplete';

interface ProviderDashboardScreenProps {
  serviceRequests: ServiceRequest[];
  navigateTo: (screen: Screen) => void;
  onRespond: (request: ServiceRequest, initialMessage: string) => void;
  initialCategory?: string;
}

const RequestCard: React.FC<{ request: ServiceRequest; onRespond: (request: ServiceRequest, initialMessage: string) => void }> = ({ request, onRespond }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 p-4">
    <p className="text-sm font-semibold text-teal-600">{request.category}</p>
    <h3 className="text-lg font-bold text-gray-900 mt-1">{request.title}</h3>
    {(request.city || request.department) && (
      <div className="flex items-center mt-1 text-xs text-teal-600 font-medium mb-1">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {request.city ? `${request.city} (${request.zipCode})` : request.department}
      </div>
    )}
    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{request.description}</p>
    <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
      <div className="flex items-center">
        <img src={request.client.avatarUrl} alt={request.client.name} className="w-8 h-8 rounded-full object-cover" />
        <span className="ml-2 text-sm font-medium text-gray-700">{request.client.name}</span>
      </div>
      <span className="text-xs text-gray-400">{request.createdAt}</span>
    </div>
    <button
      onClick={() => onRespond(request, "Bonjour, je suis intéressé par votre demande.")}
      className="w-full mt-3 bg-teal-500 text-white font-bold py-2 px-5 rounded-lg transition-colors hover:bg-teal-600 text-sm">
      Répondre à la demande
    </button>
  </div>
);

const ProviderDashboardScreen: React.FC<ProviderDashboardScreenProps> = ({ serviceRequests, navigateTo, onRespond, initialCategory = 'Tous' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filterLocation, setFilterLocation] = useState<{ city: string, zipCode: string, department: string } | null>(null);

  // Update local state if prop changes (e.g. navigation from home)
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredRequests = serviceRequests.filter(req => {
    const matchesCategory = selectedCategory === 'Tous' || req.category === selectedCategory;
    let matchesLocation = true;
    if (filterLocation) {
      if (req.city) {
        matchesLocation = req.city.toLowerCase() === filterLocation.city.toLowerCase();
      } else if (req.department) {
        matchesLocation = req.department.includes(filterLocation.department) || filterLocation.department.includes(req.department);
      } else {
        matchesLocation = false;
      }
    }
    return matchesCategory && matchesLocation;
  });

  const categories = [{ id: 'all', name: 'Tous', icon: () => null }, ...SERVICE_CATEGORIES];

  return (
    <div className="p-4 bg-gray-100 min-h-full pb-24">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-4">Demandes de services</h1>

      {/* Location Filter */}
      <div className="mb-4 relative z-20">
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

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto pb-4 mb-2 scrollbar-hide -mx-4 px-4">
        <div className="flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategory === cat.name
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div>
          {filteredRequests.map(req => <RequestCard key={req.id} request={req} onRespond={onRespond} />)}
        </div>
      ) : (
        <div className="text-center pt-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mx-auto mb-4">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h2 className="text-xl font-bold text-gray-700">Aucune demande</h2>
          <p className="text-gray-500 mt-2">
            {(selectedCategory === 'Tous' && !filterLocation)
              ? "Les nouvelles demandes de service apparaîtront ici."
              : `Aucune demande ne correspond à vos filtres.`}
          </p>
          {(selectedCategory !== 'Tous' || filterLocation) && (
            <button
              onClick={() => { setSelectedCategory('Tous'); setFilterLocation(null); }}
              className="mt-4 text-teal-600 font-medium hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardScreen;