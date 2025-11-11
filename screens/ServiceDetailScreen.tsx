import React, { useState } from 'react';
import { Screen, Service } from '../types';

interface ServiceDetailScreenProps {
  service: Service;
  navigateTo: (screen: Screen) => void;
  onStartConversation: (service: Service, initialMessage: string) => void;
}

const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({ service, navigateTo, onStartConversation }) => {
  const [message, setMessage] = useState('');
  const { title, description, price, provider, category, imageUrl } = service;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onStartConversation(service, message);
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <header className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover"/>
        <button onClick={() => navigateTo(Screen.Find)} className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-800 hover:bg-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </header>
      
      <div className="p-4 pb-6">
        <p className="text-sm font-semibold text-teal-600 mb-1">{category}</p>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-2xl font-extrabold text-gray-800 mt-2">{price}€</p>
        <p className="text-gray-600 text-base mt-4">{description}</p>
        
        <div className="my-6 border-t border-gray-200"></div>

        <h2 className="text-xl font-bold text-gray-800 mb-3">Prestataire</h2>
        <div className="flex items-center p-3 bg-white rounded-xl shadow-md space-x-4">
            <img className="w-16 h-16 rounded-full object-cover" src={provider.avatarUrl} alt={provider.name} />
            <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">{provider.name}</p>
                <p className="text-sm text-teal-600">{provider.job}</p>
                <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-gray-600 text-sm font-bold ml-1">{provider.rating}</span>
                    <span className="text-gray-400 text-sm ml-2">({provider.reviews} avis)</span>
                </div>
            </div>
        </div>

        <div className="my-6 border-t border-gray-200"></div>

        <form onSubmit={handleSendMessage}>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Contacter {provider.name.split(' ')[0]}</h2>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            placeholder={`Bonjour ${provider.name.split(' ')[0]}, je suis intéressé(e) par votre service de "${title}"...`}
          ></textarea>
          <button type="submit" className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceDetailScreen;