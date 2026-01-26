import React, { useState, useEffect, useRef } from 'react';

interface City {
    nom: string;
    code: string; // INSEE code
    codesPostaux: string[];
    codeDepartement: string;
    departement?: {
        nom: string;
        code: string;
    };
}

interface Location {
    city: string;
    zipCode: string;
    department: string; // store department code (e.g. "971") or name, generally code + name is better but let's stick to name for display or code for filtering
    departmentName?: string;
}

interface LocationAutocompleteProps {
    onSelect: (location: Location) => void;
    initialValue?: string; // e.g. "Pointe-à-Pitre (97110)"
    placeholder?: string;
    className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ onSelect, initialValue = '', placeholder = "Ville ou Code postal...", className }) => {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        // If query is exactly initialValue, don't search (avoid popup on edit load)
        if (query === initialValue && initialValue !== '') return;

        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                // Query API Geo for communes. Boost population
                const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code,codesPostaux,codeDepartement,departement&boost=population&limit=5`);
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, initialValue]);

    const handleSelect = (city: City) => {
        const zipCode = city.codesPostaux[0]; // Take primary zip code
        // API Geo returns 'departement' object if requested in fields
        const departmentName = city.departement ? city.departement.nom : city.codeDepartement;

        // Format display string
        const displayString = `${city.nom} (${zipCode})`;
        setQuery(displayString);
        setIsOpen(false);

        onSelect({
            city: city.nom,
            zipCode: zipCode,
            department: departmentName || city.codeDepartement, // Fallback
            departmentName: departmentName
        });
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-900"
                    autoComplete="off"
                />
                {/* Optional: Add a location icon here */}
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((city) => (
                        <li
                            key={`${city.code}-${city.codesPostaux[0]}`}
                            onClick={() => handleSelect(city)}
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-0"
                        >
                            <span className="font-medium text-gray-900">{city.nom}</span>
                            <span className="text-xs text-gray-500">
                                {city.codesPostaux[0]} - {city.departement?.nom || city.codeDepartement}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
