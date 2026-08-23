import React, { useState, useMemo } from 'react';
import { Screen, User, ServiceCategory, Provider, Service } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface HomeScreenProps {
  user: User;
  providers: Provider[];
  services: Service[];
  navigateTo: (screen: Screen) => void;
  onSelectService: (service: Service) => void;
  onSelectCategory: (category: string) => void;
  filterLocation?: { city: string; zipCode: string; department: string } | null;
}

const CategoryCard: React.FC<{ category: ServiceCategory; onClick: () => void }> = ({ category, onClick }) => (
  <div
    onClick={onClick}
    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
  >
    {/* Image with Badge */}
    <div className="relative h-28 w-full overflow-hidden bg-gray-100">
      <img
        src={category.imageUrl || '/images/categories/jardinage.jpg'}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Category Badge overlay (top left) */}
      <div className="absolute top-2 left-2 bg-[#0E5A3F]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
        {category.name}
      </div>
    </div>

    {/* Info below photo */}
    <div className="p-3 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-900 text-sm">{category.name}</h3>
        <p className="text-[11px] text-gray-500">Services de proximité</p>
      </div>
      <div className="text-gray-300 group-hover:text-[#0E5A3F] transition-colors">
        <category.icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const ServiceCard: React.FC<{ service: Service; onSelect: (service: Service) => void; }> = ({ service, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-3.5 hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* Top category & location badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#0E5A3F] bg-emerald-50 px-2.5 py-1 rounded-full">
            {service.category}
          </span>
          {(service.city || service.department) && (
            <div className="flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3 mr-1 text-[#0E5A3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{service.city ? `${service.city} (${service.zipCode || ''})` : service.department}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mt-2 line-clamp-2">{service.title}</h3>

        {/* Description */}
        {service.description && (
          <div className="mt-1.5 text-gray-600 text-xs">
            <p className={isExpanded ? "whitespace-pre-line" : "line-clamp-2 whitespace-pre-line"}>{service.description}</p>
            {service.description.length > 80 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-[#0E5A3F] font-bold text-xs mt-1 hover:underline focus:outline-none"
              >
                {isExpanded ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </div>
        )}

        {/* Provider & Action Bottom Bar */}
        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={service.provider.avatarUrl || 'https://picsum.photos/seed/person/200'}
              alt={service.provider.name}
              className="w-7 h-7 rounded-full object-cover border border-gray-200"
            />
            <span className="text-xs font-semibold text-gray-800">{service.provider.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {service.price !== undefined && (
              <span className="text-base font-black text-gray-900">{service.price} €</span>
            )}
            <button
              onClick={() => onSelect(service)}
              className="bg-[#0E5A3F] hover:bg-[#093e2b] text-white font-bold py-1.5 px-4 rounded-xl transition-all active:scale-95 text-xs shadow-sm"
            >
              Voir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  services,
  navigateTo,
  onSelectService,
  onSelectCategory,
  filterLocation
}) => {
  // Filter popular services based on selected header location (Option 1)
  const localizedServices = useMemo(() => {
    if (!filterLocation) return services;
    return services.filter(service => {
      if (filterLocation.city && service.city) {
        return service.city.toLowerCase() === filterLocation.city.toLowerCase() ||
               (service.zipCode && service.zipCode === filterLocation.zipCode);
      }
      if (filterLocation.department && service.department) {
        return service.department.includes(filterLocation.department) ||
               filterLocation.department.includes(service.department);
      }
      return true;
    });
  }, [services, filterLocation]);

  return (
    <div className="bg-gray-50/60 min-h-full pb-28">
      {/* Top Banner / Categories Highlights */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-gray-900">Catégories de services</h2>
          <span className="text-xs font-semibold text-[#0E5A3F] cursor-pointer" onClick={() => navigateTo(Screen.Find)}>
            Voir tout ›
          </span>
        </div>

        {/* 2x2 or 3x3 visual cards */}
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => onSelectCategory(cat.name)}
            />
          ))}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Prestations récentes</h2>
            {filterLocation && (
              <p className="text-xs text-[#0E5A3F] font-semibold">
                📍 Filtré sur {filterLocation.city || filterLocation.department}
              </p>
            )}
          </div>
          <button
            onClick={() => navigateTo(Screen.Find)}
            className="text-xs font-bold text-[#0E5A3F] hover:underline"
          >
            Explorer ({localizedServices.length})
          </button>
        </div>

        {localizedServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm my-2">
            <p className="text-sm font-bold text-gray-700">Aucune prestation trouvée dans cette zone</p>
            <p className="text-xs text-gray-400 mt-1">Essayez de réinitialiser le filtre de localisation.</p>
          </div>
        ) : (
          <div>
            {localizedServices.slice(0, 6).map(service => (
              <ServiceCard key={service.id} service={service} onSelect={onSelectService} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
