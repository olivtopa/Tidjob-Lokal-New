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
import AccountSettingsScreen from './screens/AccountSettingsScreen';
import ServiceHistoryScreen from './screens/ServiceHistoryScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import ProviderServicesScreen from './screens/ProviderServicesScreen';

import { API_BASE_URL } from './constants';

import HomeIcon from './components/icons/HomeIcon';
import SearchIcon from './components/icons/SearchIcon';
import PlusCircleIcon from './components/icons/PlusCircleIcon';
import UserIcon from './components/icons/UserIcon';
import MessageSquareIcon from './components/icons/MessageSquareIcon';
import ClipboardListIcon from './components/icons/ClipboardListIcon';

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

  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const navigateTo = useCallback((screen: Screen, addToHistory = true) => {
    console.log('App: navigateTo called with screen:', screen);
    setError(null);
    setCurrentScreen(screen);
    if (addToHistory) {
      window.history.pushState({ screen }, '', '');
    }
  }, []);

  useEffect(() => {
    // Handle back button
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
      } else {
        // Fallback or initial state
        setCurrentScreen(Screen.Landing);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state
    window.history.replaceState({ screen: Screen.Landing }, '', '');

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    navigateTo(Screen.Find);
  }, [navigateTo]);

  // Helper function for authenticated fetches
  const fetchWithAuth = useCallback(async (url: string, options?: RequestInit) => {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    };
    return fetch(url, { ...options, headers });
  }, []);

  useEffect(() => {
    const initializeAppData = async () => {
      setIsLoading(true);
      try {
        // Attempt to auto-login if token exists
        const token = localStorage.getItem('jwtToken');
        if (token) {
          try {
            const profileResponse = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
            const user = await profileResponse.json();

            if (!profileResponse.ok) {
              throw new Error(user.error || 'Impossible de récupérer le profil utilisateur');
            }
            setCurrentUser(user);

            // Fetch service requests for both providers AND clients (now that backend allows it)
            // If user is provider -> all requests (marketplace)
            // If user is client -> my requests (history)
            const serviceRequestsRes = await fetchWithAuth(`${API_BASE_URL}/servicerequests`);
            if (serviceRequestsRes.ok) {
              const requestsData = await serviceRequestsRes.json();
              setServiceRequests(requestsData);
            }

            navigateTo(Screen.Home); // Navigate to home if auto-login successful
          } catch (autoLoginError) {
            console.error("Auto-login failed, clearing token", autoLoginError);
            localStorage.removeItem('jwtToken'); // Clear invalid token
            setCurrentUser(null);
            navigateTo(Screen.Landing);
          }
        }

        // Fetch initial public data (services and providers)
        const [servicesRes, providersRes] = await Promise.all([
          fetchWithAuth(`${API_BASE_URL}/services`),
          fetchWithAuth(`${API_BASE_URL}/providers`)
        ]);

        if (!servicesRes.ok || !providersRes.ok) {
          throw new Error(`Services: ${servicesRes.statusText}, Providers: ${providersRes.statusText}`);
        }

        const servicesData = await servicesRes.json();
        const providersData = await providersRes.json();

        setServices(servicesData);
        setProviders(providersData);
      } catch (error) {
        console.error("Failed to fetch initial data or auto-login", error);
        setError(`Erreur de chargement initial: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAppData();
  }, [fetchWithAuth, navigateTo]);

  useEffect(() => {
    if (currentUser) {
      console.log('User data updated in frontend:', currentUser);
    }
  }, [currentUser]);

  // New useEffect to fetch conversations when currentUser changes
  // Poll for new messages every 30 seconds
  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const conversationsRes = await fetchWithAuth(`${API_BASE_URL}/messages`);
        if (!conversationsRes.ok) return; // Silent fail on poll

        const conversationsData = await conversationsRes.json();

        // Update state
        setConversations(prev => {
          // Simple check to see if we have new unread messages compared to previous state
          // to potentially show a toast (omitted for now, just updating data)
          return conversationsData;
        });

      } catch (error) {
        console.error("Error polling conversations:", error);
      }
    };

    fetchConversations(); // Initial fetch

    const intervalId = setInterval(fetchConversations, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [currentUser, fetchWithAuth]);

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
      localStorage.setItem('jwtToken', token);

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

      // Fetch service requests for both (Provider = all, Client = mine)
      const serviceRequestsRes = await fetchWithAuth(`${API_BASE_URL}/servicerequests`);
      if (serviceRequestsRes.ok) {
        const requestsData = await serviceRequestsRes.json();
        setServiceRequests(requestsData);
      } else {
        console.warn(`Impossible de récupérer les demandes de service : ${serviceRequestsRes.statusText}`);
      }

      if (user.role === 'provider') {
        navigateTo(Screen.ProviderDashboard);
      } else {
        navigateTo(Screen.Home);
      }

    } catch (error: any) {
      console.error("Login process failed", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigateTo]);

  const handleSignUp = useCallback(async (name: string, email: string, password: string, role: 'client' | 'provider') => {
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

  const handlePublishRequest = useCallback(async (title: string, category: string, description: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/servicerequests`, {
      method: 'POST',
      body: JSON.stringify({ title, category, description }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to publish service request.');
    }
    // Optionally, refresh the list of service requests or handle the new request data
    console.log('Service request created:', data);
  }, [fetchWithAuth]);

  const handlePublishService = useCallback(async (title: string, description: string, category: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/services`, {
      method: 'POST',
      body: JSON.stringify({ title, description, category }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to publish service.');
    }
    // Optionally, refresh the list of services or handle the new service data
    console.log('Service created:', data);
  }, [fetchWithAuth]);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setConversations([]);
    setServiceRequests([]);
    localStorage.removeItem('jwtToken'); // Remove token on logout
    navigateTo(Screen.Landing);
  }, [navigateTo]);

  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
    navigateTo(Screen.ServiceDetail);
  }, [navigateTo]);

  const handleSelectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Fetch latest messages for the selected conversation
    try {
      const messagesRes = await fetchWithAuth(`${API_BASE_URL}/messages/${conversation.id}/messages`);
      if (!messagesRes.ok) {
        throw new Error(`Failed to fetch messages: ${messagesRes.statusText}`);
      }
      const messagesData = await messagesRes.json();
      const updatedConversation = { ...conversation, messages: messagesData, unread: false };
      setConversations(prev => prev.map(c => c.id === conversation.id ? updatedConversation : c));
      setSelectedConversation(updatedConversation);
      navigateTo(Screen.Chat);
    } catch (error) {
      console.error("Error fetching messages for conversation:", error);
      setError(`Erreur de chargement des messages: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [fetchWithAuth, navigateTo]);

  const handleStartConversation = useCallback(async (service: Service, initialMessageContent: string) => {
    console.log('App.tsx: handleStartConversation called with service:', service);
    if (!currentUser) return; // Guard against user being null

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          ServiceId: service.id,
          providerId: service.provider.id,
          initialMessageContent,
        }),
      });

      const newConversation = await response.json();
      console.log('Frontend: Received new conversation object:', newConversation);

      if (!response.ok) {
        throw new Error(newConversation.message || 'Failed to start conversation.');
      }

      // If a conversation already existed, the backend returns it. Otherwise, a new one is created.
      // We need to ensure our local state reflects this.
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === newConversation.id);
        if (existingIndex > -1) {
          // Update existing conversation (e.g., with new messages if any)
          return prev.map((c, index) => index === existingIndex ? newConversation : c);
        } else {
          // Add new conversation to the top
          return [newConversation, ...prev];
        }
      });
      setSelectedConversation(newConversation);
      navigateTo(Screen.Chat);

    } catch (error: any) {
      console.error("Error starting conversation:", error);
      setError(error.message);
    }
  }, [currentUser, fetchWithAuth, navigateTo]);

  const handleRespondToRequest = useCallback(async (request: ServiceRequest, initialMessageContent: string) => {
    if (!currentUser) return;

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          ServiceRequestId: request.id,
          providerId: currentUser.id, // Current user is the provider responding
          initialMessageContent,
        }),
      });

      const newConversation = await response.json();

      if (!response.ok) {
        throw new Error(newConversation.message + (newConversation.error ? `: ${newConversation.error}` : '') || 'Failed to start conversation.');
      }

      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === newConversation.id);
        if (existingIndex > -1) {
          return prev.map((c, index) => index === existingIndex ? newConversation : c);
        } else {
          return [newConversation, ...prev];
        }
      });
      setSelectedConversation(newConversation);
      navigateTo(Screen.Chat);

    } catch (error: any) {
      console.error("Error responding to request:", error);
      setError(error.message);
    }
  }, [currentUser, fetchWithAuth, navigateTo]);

  const handleSendMessage = useCallback(async (conversationId: string, messageText: string) => {
    if (!currentUser) return; // Guard against user being null

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/messages/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: messageText }),
      });

      const newMessage = await response.json();

      if (!response.ok) {
        throw new Error(newMessage.message || 'Failed to send message.');
      }

      // Update local state with the new message
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          const updatedConversation = { ...c, messages: [...c.messages, newMessage], lastMessageAt: newMessage.timestamp };
          setSelectedConversation(updatedConversation);
          return updatedConversation;
        }
        return c;
      }));

    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  }, [currentUser, fetchWithAuth]);

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
        if (currentUser.role === 'provider') return <ProviderDashboardScreen serviceRequests={serviceRequests} navigateTo={navigateTo} onRespond={handleRespondToRequest} />;
        return <HomeScreen navigateTo={navigateTo} user={currentUser} providers={providers} services={services} onSelectService={handleSelectService} onSelectCategory={handleCategorySelect} />;
      case Screen.Find:
        return <FindServiceScreen services={services} navigateTo={navigateTo} onSelectService={handleSelectService} initialCategory={selectedCategory} />;
      case Screen.Offer:
        return <OfferServiceScreen navigateTo={navigateTo} onPublishService={handlePublishService} />;
      case Screen.Profile:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        return <ProfileScreen user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />;
      case Screen.Legal:
        return <LegalScreen navigateTo={navigateTo} />;
      case Screen.ServiceDetail:
        if (!selectedService) { navigateTo(Screen.Find); return null; }
        return <ServiceDetailScreen service={selectedService} navigateTo={navigateTo} onStartConversation={handleStartConversation} user={currentUser} />;
      case Screen.Messages:
        return <MessagesScreen conversations={conversations} onSelectConversation={handleSelectConversation} />;
      case Screen.Chat:
        if (!selectedConversation || !currentUser) { navigateTo(Screen.Messages); return null; }
        return <ChatScreen conversation={selectedConversation} currentUser={currentUser} navigateTo={navigateTo} onSendMessage={handleSendMessage} />;
      case Screen.ProviderDashboard:
        if (!currentUser || currentUser.role !== 'provider') { navigateTo(Screen.Login); return null; }
        return <ProviderDashboardScreen serviceRequests={serviceRequests} navigateTo={navigateTo} onRespond={handleRespondToRequest} />;
      case Screen.RequestService:
        return <RequestServiceScreen navigateTo={navigateTo} onPublish={handlePublishRequest} />;
      case Screen.AccountSettings:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        console.log('App: Rendering AccountSettingsScreen');
        return <AccountSettingsScreen user={currentUser} navigateTo={navigateTo} onLogout={handleLogout} />;
      case Screen.ServiceHistory:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        return <ServiceHistoryScreen user={currentUser} serviceRequests={serviceRequests} navigateTo={navigateTo} />;
      case Screen.HelpCenter:
        return <HelpCenterScreen navigateTo={navigateTo} />;
      case Screen.ProviderServices:
        if (!currentUser) { navigateTo(Screen.Login); return null; }
        return <ProviderServicesScreen user={currentUser} navigateTo={navigateTo} onSelectService={handleSelectService} />;
      default:
        return <LandingScreen navigateTo={navigateTo} />;
    }
  };

  const NavItem: React.FC<{ screen: Screen; icon: React.ReactNode; label: string; hasNotification?: boolean }> = ({ screen, icon, label, hasNotification }) => (
    <button
      onClick={() => navigateTo(screen)}
      className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${currentScreen === screen ? 'text-teal-500' : 'text-gray-500 hover:text-teal-600'
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
      <NavItem screen={Screen.Offer} icon={<PlusCircleIcon className="w-6 h-6" />} label="Proposer" />
      <NavItem screen={Screen.Messages} icon={<MessageSquareIcon className="w-6 h-6" />} label="Messages" hasNotification={hasUnreadMessages} />
      <NavItem screen={Screen.Profile} icon={<UserIcon className="w-6 h-6" />} label="Profil" />
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg h-screen flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto pb-20">{renderScreen()}</main>

      {currentUser && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t-strong">
          {currentUser.role === 'client' ? renderUserNav() : renderProviderNav()}
        </footer>
      )}
    </div>
  );
};

export default App;