
import React, { useEffect, useState } from 'react';
import { Screen, User, Service } from '../types';
import { API_BASE_URL } from '../constants';

interface ProviderServicesScreenProps {
    user: User;
    navigateTo: (screen: Screen) => void;
}

const ProviderServicesScreen: React.FC<ProviderServicesScreenProps> = ({ user, navigateTo }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyServices = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                };
                const response = await fetch(`${API_BASE_URL}/services?providerId=${user.id}`, { headers });
                if (!response.ok) {
                    throw new Error('Impossible de récupérer vos services.');
                }
                const data = await response.json();
                setServices(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyServices();
    }, [user.id]);

    return (
        <div className="bg-gray-50 min-h-full pb-20">
            <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={() => navigateTo(Screen.Profile)} className="text-gray-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Mes Services</h1>
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="flex justify-center p-8"><span className="text-gray-500">Chargement...</span></div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
                ) : services.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                        <span className="text-4xl block mb-2">🛠️</span>
                        <p className="text-gray-500 text-lg">Vous ne proposez aucun service.</p>
                        <button
                            onClick={() => navigateTo(Screen.Offer)}
                            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition"
                        >
                            Proposer un service
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <span className="bg-teal-50 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded mb-2 inline-block">{service.category}</span>
                                    <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-1">{service.description}</p>
                                </div>
                                {/* Future: Edit/Delete buttons could go here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderServicesScreen;
