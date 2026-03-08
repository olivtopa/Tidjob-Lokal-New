
import React from 'react';
import { Screen, ServiceRequest, User } from '../types';

interface ServiceHistoryScreenProps {
    user: User;
    serviceRequests: ServiceRequest[];
    navigateTo: (screen: Screen) => void;
}

const ServiceRequestCard: React.FC<{ req: ServiceRequest }> = ({ req }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded">{req.category}</span>
                <span className="text-xs text-gray-400">{new Date(req.postedAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{req.title}</h3>

            <div className="text-gray-600 text-sm">
                <p className={isExpanded ? "whitespace-pre-line" : "line-clamp-2 whitespace-pre-line"}>{req.description}</p>
                {(req.description && req.description.length > 80) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="text-teal-600 font-medium text-xs mt-1 hover:underline focus:outline-none"
                    >
                        {isExpanded ? "Voir moins" : "Voir plus"}
                    </button>
                )}
            </div>

            {req.budget && <p className="mt-2 text-teal-600 font-bold">{req.budget} €</p>}
        </div>
    );
};

const ServiceHistoryScreen: React.FC<ServiceHistoryScreenProps> = ({ user, serviceRequests, navigateTo }) => {
    // Filter requests for the current user
    const myRequests = serviceRequests.filter(req => req.client.id === user.id);

    return (
        <div className="bg-gray-100 min-h-full pb-20">
            <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={() => navigateTo(Screen.Profile)} className="text-gray-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">{user.role === 'client' ? 'Mes demandes' : 'Historique des services'}</h1>
            </div>

            <div className="p-4">
                {myRequests.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                        <span className="text-4xl block mb-2">{user.role === 'client' ? '📋' : '📜'}</span>
                        <p className="text-gray-500 text-lg">Aucune demande trouvée.</p>
                        {user.role === 'client' && (
                            <button
                                onClick={() => navigateTo(Screen.RequestService)}
                                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium"
                            >
                                Créer une demande
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myRequests.map((req) => (
                            <ServiceRequestCard key={req.id} req={req} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceHistoryScreen;
