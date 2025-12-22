import React from 'react';
import { Screen, ServiceRequest } from '../types';

interface ProviderDashboardScreenProps {
  serviceRequests: ServiceRequest[];
  navigateTo: (screen: Screen) => void;
  onRespond: (request: ServiceRequest, initialMessage: string) => void;
}

const RequestCard: React.FC<{ request: ServiceRequest; onRespond: (request: ServiceRequest, initialMessage: string) => void }> = ({ request, onRespond }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 p-4">
    <p className="text-sm font-semibold text-teal-600">{request.category}</p>
    <h3 className="text-lg font-bold text-gray-900 mt-1">{request.title}</h3>
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

const ProviderDashboardScreen: React.FC<ProviderDashboardScreenProps> = ({ serviceRequests, navigateTo, onRespond }) => {
  return (
    <div className="p-4 bg-slate-200 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 pt-4 mb-4">Mes Demandes de Service</h1>

      {serviceRequests.length > 0 ? (
        <div>
          {serviceRequests.map(req => <RequestCard key={req.id} request={req} onRespond={onRespond} />)}
        </div>
      ) : (
        <div className="text-center pt-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mx-auto mb-4">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h2 className="text-xl font-bold text-gray-700">Aucune demande pour le moment</h2>
          <p className="text-gray-500 mt-2">Les nouvelles demandes de service des clients apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardScreen;