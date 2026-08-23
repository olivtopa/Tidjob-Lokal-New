import React, { useState } from 'react';
import { User } from '../types';
import LocationAutocomplete from './LocationAutocomplete';

interface AppHeaderProps {
  user: User | null;
  currentLocation?: { city: string; zipCode: string; department: string } | null;
  onLocationChange: (loc: { city: string; zipCode: string; department: string } | null) => void;
  onOpenMenu: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchFocus?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  currentLocation,
  onLocationChange,
  onOpenMenu,
  searchTerm = '',
  onSearchChange,
  onSearchFocus
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const locationDisplayText = currentLocation
    ? `${currentLocation.city} (${currentLocation.zipCode || currentLocation.department})`
    : 'Toutes les localités';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Logo tidjob */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="text-[#0E5A3F] flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0E5A3F]">
              tidjob
            </span>
          </div>

          {/* Central Search Input */}
          <div className="flex-1 relative flex items-center bg-gray-50 focus-within:bg-white text-gray-900 px-3 py-1.5 rounded-full border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200/50 shadow-inner transition-all duration-200 mx-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                if (onSearchFocus) onSearchFocus();
              }}
              onFocus={() => {
                if (onSearchFocus) onSearchFocus();
              }}
              placeholder="Rechercher..."
              className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none pr-5 font-medium"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            ) : (
              <svg className="w-4 h-4 text-gray-400 shrink-0 absolute right-2.5 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            )}
          </div>

          {/* Menu Hamburger Button */}
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 flex items-center justify-center bg-[#0E5A3F] hover:bg-[#093e2b] text-white rounded-xl shadow-sm transition-transform active:scale-95 shrink-0"
            aria-label="Ouvrir le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Location Pill Selector (Option 1) */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-[#0E5A3F] rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 text-[#0E5A3F]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span className="truncate max-w-[200px]">{locationDisplayText}</span>
            <svg className="w-3 h-3 text-[#0E5A3F] ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {currentLocation && (
            <button
              onClick={() => onLocationChange(null)}
              className="text-[11px] text-gray-400 hover:text-gray-600 font-medium underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-[#0E5A3F]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Votre Localisation</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Sélectionnez votre ville ou commune pour voir les services disponibles près de chez vous.
            </p>

            <LocationAutocomplete
              onSelect={(loc) => {
                onLocationChange(loc);
                setShowLocationModal(false);
              }}
              placeholder="Tapez votre commune..."
              className="w-full mb-4"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  onLocationChange(null);
                  setShowLocationModal(false);
                }}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Toutes les localités
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 py-2.5 px-4 bg-[#0E5A3F] hover:bg-[#093e2b] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
