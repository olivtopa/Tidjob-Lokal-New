import React, { useState, useCallback, useEffect } from 'react';
import { Screen, User, Service, Conversation, Message, ServiceRequest, Provider } from './types';

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import FindServiceScreen from './screens/FindServiceScreen';
import OfferServiceScreen from './screens/OfferServiceScreen';
import ProfileScreen from './screens/ProfileScreen';
import LegalScreen from './screens/LegalScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProviderDashboardScreen from './screens/ProviderDashboardScreen';
import RequestServiceScreen from './screens/RequestServiceScreen';

import { API_BASE_URL } from './constants';
import HomeIcon from './components/icons/HomeIcon';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Landing);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [servicesRes, providersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/providers`)
        ]);

        if (!servicesRes.ok || !providersRes.ok) {
            throw new Error(`Services: ${servicesRes.statusText}, Providers: ${providersRes.statusText}`);
        }

        const servicesData = await servicesRes.json();
        const providersData = await providersRes.json();

        setServices(servicesData);
        setProviders(providersData);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        // Don't set a global error, let screens handle missing data gracefully.
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setError(null);
    setCurrentScreen(screen);
  }, []);

  const loginUser = async (role: 'user' | 'provider') => {
    setError(null);
    setIsLoading(true);
    try {
      const userRes = await fetch(role === 'user' ? `${API_BASE_URL}/user` : `${API_BASE_URL}/provider`);
      if (!userRes.ok) throw new Error(`Impossible de récupérer le profil utilisateur : ${userRes.statusText}`);
      const user = await userRes.json();

      const convRes = await fetch(`${API_BASE_URL}/conversations`);
      if (!convRes.ok) throw new Error(`Impossible de récupérer les conversations : ${convRes.statusText}`);
      const allConversations = await convRes.json();
      
      setCurrentUser(user);
      setConversations(allConversations);

      if (role === 'provider') {
        const reqRes = await fetch(`${API_BASE_URL}/service-requests`);
        if (!reqRes.ok) throw new Error(`Impossible de récupérer les demandes de service : ${reqRes.statusText}`);
        const requests = await reqRes.json();
        setServiceRequests(requests);
        navigateTo(Screen.ProviderDashboard);
      } else {
        navigateTo(Screen.Home);
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setError(`La connexion a échoué. Assurez-vous que le serveur est bien démarré. (${error.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // Step 1: Authenticate and get the token
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Erreur de connexion');
      }
      
      const token = loginData.token;
      console.log('Login successful, token:', token);
      
      // Step 2: Use the token to fetch the user's profile
      const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const user = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(user.error || 'Impossible de récupérer le profil utilisateur');
      }

      // Step 3: Set the user and navigate
      setCurrentUser(user);
      // Here you would also fetch user-specific data like conversations
      navigateTo(Screen.Home);

    } catch (error: any) {
      console.error("Login process failed", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigateTo]);
  
  const handleSignUp = useCallback(async (name: string, email: string, password: string, role: 'user' | 'provider') => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Successfully signed up, now navigate to login screen
      // We could also pass a success message.
      navigateTo(Screen.Login);

    } catch (error: any) {
      console.error("Sign up failed", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigateTo]);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setConversations([]);
    setServiceRequests([]);
    navigateTo(Screen.Landing);
  }, [navigateTo]);

  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
    navigateTo(Screen.ServiceDetail);
  }, [navigateTo]);
  
  const handleSelectConversation = useCallback((conversation: Conversation) => {
      setSelectedConversation(conversation);
      setConversations(prev => prev.map(c => c.id === conversation.id ? { ...c, unread: false } : c));
      navigateTo(Screen.Chat);
  }, [navigateTo]);

  const handleStartConversation = (service: Service, initialMessage: string) => {
    if (!currentUser) return; // Guard against user being null
    const existingConversation = conversations.find(c => c.service.id === service.id);
    if (existingConversation) {
      handleSelectConversation(existingConversation);
      return;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      service,
      provider: service.provider,
      unread: false,
      messages: [
        { id: `msg-${Date.now()}`, text: initialMessage, timestamp: 'À l\'instant', senderId: currentUser.id }
      ],
    };
    
    setTimeout(() => {
        setConversations(prev => prev.map(c => {
            if (c.id === newConversation.id) {
                const reply: Message = {
                    id: `msg-${Date.now() + 1}`,
                    text: `Bonjour, merci pour votre message concernant "${service.title}". Comment puis-je vous aider ?`,
                    timestamp: 'À l\'instant',
                    senderId: service.provider.id,
                };
                return { ...c, messages: [...c.messages, reply], unread: true };
            }
            return c;
        }));
    }, 2000);

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    navigateTo(Screen.Chat);
  };
  
  const handleSendMessage = (conversationId: string, messageText: string) => {
      if (!currentUser) return; // Guard against user being null
      setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
              const newMessage: Message = {
                  id: `msg-${Date.now()}`,
                  text: messageText,
                  timestamp: 'À l\'instant',
                  senderId: currentUser.id,
              };
              const updatedConversation = { ...c, messages: [...c.messages, newMessage] };
              setSelectedConversation(updatedConversation);
              return updatedConversation;
          }
          return c;
      }));
  };

  const renderScreen = () => {
    if (isLoading && !currentUser) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-gray-500">Chargement...</p>
        </div>
      );
    }

    switch (currentScreen) {
      case Screen.Landing:
        return <LandingScreen navigateTo={navigateTo} />;
      case Screen.Login:
        return <LoginScreen navigateTo={navigateTo} onLogin={handleLogin} error={error} isLoading={isLoading} />;
      case Screen.SignUp:
        return <SignUpScreen navigateTo={navigateTo} onSignUp={handleSignUp} error={error} isLoading={isLoading} />;
      case Screen.Home:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        if (currentUser.role !== 'user') return <ProviderDashboardScreen serviceRequests={serviceRequests} navigateTo={navigateTo} />;
        return <HomeScreen navigateTo={navigateTo} user={currentUser} providers={providers} />;
      case Screen.Find:
        return <FindServiceScreen services={services} navigateTo={navigateTo} onSelectService={handleSelectService} />;
      case Screen.Offer:
        return <OfferServiceScreen navigateTo={navigateTo} />;
      case Screen.Profile:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        return <ProfileScreen user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />;
      case Screen.Legal:
        return <LegalScreen navigateTo={navigateTo} />;
      case Screen.ServiceDetail:
        if (!selectedService) { navigateTo(Screen.Find); return null; }
        return <ServiceDetailScreen service={selectedService} navigateTo={navigateTo} onStartConversation={handleStartConversation} />;
      case Screen.Messages:
        return <MessagesScreen conversations={conversations} onSelectConversation={handleSelectConversation} />;
      case Screen.Chat:
        if (!selectedConversation || !currentUser) { navigateTo(Screen.Messages); return null; }
        return <ChatScreen conversation={selectedConversation} currentUser={currentUser} navigateTo={navigateTo} onSendMessage={handleSendMessage} />;
      case Screen.ProviderDashboard:
        if (!currentUser || currentUser.role !== 'provider') { navigateTo(Screen.Login); return null; }
        return <ProviderDashboardScreen serviceRequests={serviceRequests} navigateTo={navigateTo} />;
      case Screen.RequestService:
        return <RequestServiceScreen navigateTo={navigateTo} />;
      default:
        return <LandingScreen navigateTo={navigateTo} />;
    }
  };

  const NavItem: React.FC<{ screen: Screen; icon: React.ReactNode; label: string; hasNotification?: boolean }> = ({ screen, icon, label, hasNotification }) => (
    <button
      onClick={() => navigateTo(screen)}
      className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        currentScreen === screen ? 'text-teal-500' : 'text-gray-500 hover:text-teal-600'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
      {hasNotification && <span className="absolute top-1 right-[calc(50%-20px)] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
    </button>
  );
  
  const hasUnreadMessages = conversations.some(c => c.unread);

  const renderUserNav = () => (
    <div className="flex justify-around items-center h-16">
        <NavItem screen={Screen.Home} icon={<HomeIcon className="w-6 h-6" />} label="Accueil" />
        <NavItem screen={Screen.Find} icon={<SearchIcon className="w-6 h-6" />} label="Trouver" />
        <NavItem screen={Screen.Messages} icon={<MessageSquareIcon className="w-6 h-6" />} label="Messages" hasNotification={hasUnreadMessages} />
        <NavItem screen={Screen.RequestService} icon={<PlusCircleIcon className="w-6 h-6" />} label="Demander" />
        <NavItem screen={Screen.Profile} icon={<UserIcon className="w-6 h-6" />} label="Profil" />
    </div>
  );

  const renderProviderNav = () => (
      <div className="flex justify-around items-center h-16">
          <NavItem screen={Screen.ProviderDashboard} icon={<ClipboardListIcon className="w-6 h-6" />} label="Demandes" />
          <NavItem screen={Screen.Offer} icon={<PlusCircleIcon className="w-6 h-6" />} label="Mes Services" />
          <NavItem screen={Screen.Messages} icon={<MessageSquareIcon className="w-6 h-6" />} label="Messages" hasNotification={hasUnreadMessages} />
          <NavItem screen={Screen.Profile} icon={<UserIcon className="w-6 h-6" />} label="Profil" />
      </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg h-screen flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto pb-20">{renderScreen()}</main>

      {currentUser && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t-strong">
          {currentUser.role === 'user' ? renderUserNav() : renderProviderNav()}
        </footer>
      )}
    </div>
  );
};

export default App;