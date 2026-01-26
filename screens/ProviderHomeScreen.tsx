import React from 'react';
import { Screen, User, ServiceCategory, ServiceRequest } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import SearchIcon from '../components/icons/SearchIcon';
import PlusCircleIcon from '../components/icons/PlusCircleIcon';

interface ProviderHomeScreenProps {
    user: User;
    serviceRequests: ServiceRequest[];
    navigateTo: (screen: Screen) => void;
    onSelectCategory: (category: string) => void;
    onRespond: (request: ServiceRequest, initialMessage: string) => void;
}

const CategoryCard: React.FC<{ category: ServiceCategory; onClick: () => void }> = ({ category, onClick }) => (
    <div
        onClick={onClick}
        className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-100/50 aspect-square"
    >
        <div className="p-3 mb-3 rounded-2xl bg-teal-50 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-300">
            <category.icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="font-semibold text-gray-700 text-sm text-center group-hover:text-teal-700 transition-colors duration-300">{category.name}</h3>
    </div>
);

const RequestCard: React.FC<{ request: ServiceRequest; onRespond: (request: ServiceRequest, initialMessage: string) => void }> = ({ request, onRespond }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="p-4">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">{request.category}</p>
            <h3 className="text-base font-bold text-gray-900 mt-1 truncate">{request.title}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{request.description}</p>

            <div className="flex items-center mt-3 pt-3 border-t border-gray-50">
                <img src={request.client.avatarUrl} alt={request.client.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="ml-2 text-xs font-medium text-gray-600 truncate">{request.client.name}</span>
                {request.budget && (
                    <span className="ml-auto text-xs font-bold text-gray-900">{request.budget} €</span>
                )}
            </div>

            <button
                onClick={() => onRespond(request, "Bonjour, je suis intéressé par votre demande.")}
                className="w-full mt-3 bg-teal-50 text-teal-700 font-bold py-2 px-4 rounded-lg transition-colors hover:bg-teal-100 text-sm"
            >
                Répondre
            </button>
        </div>
    </div>
);

const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({ user, serviceRequests, navigateTo, onSelectCategory, onRespond }) => {
    return (
        <div className="bg-gray-100 min-h-full pb-20">
            {/* Header Section with Greeting */}
            <header className="bg-white p-6 rounded-b-[30px] shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bonjour, <span className="text-teal-600">{user.name.split(' ')[0]}</span></h1>
                        <p className="text-gray-500 mt-1">Prêt à proposer vos services ?</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <img src={user.avatarUrl || 'https://via.placeholder.com/150'} alt="Profile" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    </div>
                </div>

                {/* Main CTA */}
                <button
                    onClick={() => navigateTo(Screen.Offer)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl shadow-lg shadow-teal-200 flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                            <PlusCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-lg">Proposer un service</p>
                            <p className="text-teal-100 text-sm">Créez une annonce en 2 minutes</p>
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-full p-2">
                        <svg className="w-5 h-5 text-white transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </button>
            </header>

            {/* Categories Grid */}
            <section className="mt-6 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Explorer les demandes</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {SERVICE_CATEGORIES.slice(0, 6).map(cat => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            onClick={() => onSelectCategory(cat.name)}
                        />
                    ))}
                </div>
            </section>

            {/* Recent Requests List */}
            <section className="mt-8 px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Demandes récentes</h2>
                <div className="space-y-3">
                    {serviceRequests.length > 0 ? (
                        serviceRequests.slice(0, 5).map(req => <RequestCard key={req.id} request={req} onRespond={onRespond} />)
                    ) : (
                        <div className="w-full text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Aucune demande récente</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProviderHomeScreen;
