import React, { useEffect, useState } from 'react';
import { Screen } from '../types';
import { API_BASE_URL } from '../constants';

// --- Interfaces ---
interface DashboardStats {
    users: number;
    requests: number;
    messages: number;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface RequestData {
    id: string;
    title: string;
    category: string;
    budget: number;
    createdAt: string;
}

interface DashboardScreenProps {
    navigateTo: (screen: Screen) => void;
    onLogout: () => void;
}

// --- Icons ---
const Icons = {
    Users: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Requests: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    Stats: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Check: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Chart: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
    Message: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    Logout: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    Back: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
};

// --- Menu Tile (Matching HomeScreen CategoryCard Style) ---
const MenuTile = ({ title, icon, colorClass, textClass, onClick, value }: { title: string, icon: React.ReactNode, colorClass: string, textClass: string, onClick: () => void, value?: number | string }) => (
    <div
        onClick={onClick}
        className="group flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-100/50 aspect-square relative"
    >
        <div className={`p-4 mb-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-all duration-300`}>
            {/* Clone icon to apply classes if it's a valid element, or wrap it */}
            <div className={`${textClass} group-hover:text-white transition-colors duration-300`}>
                {icon}
            </div>
        </div>
        <h3 className="font-bold text-gray-700 text-lg text-center group-hover:text-teal-700 transition-colors duration-300">{title}</h3>
        {value !== undefined && (
            <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">{value}</span>
        )}
    </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo, onLogout }) => {
    // State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<{ recentUsers: UserData[], recentRequests: RequestData[] } | null>(null);
    const [advancedStats, setAdvancedStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Navigation State: 'menu' is the grid, others are sub-views
    const [currentView, setCurrentView] = useState<'menu' | 'users' | 'requests' | 'providers' | 'clients' | 'connections' | 'categories' | 'messages'>('menu');

    // List Data
    const [usersList, setUsersList] = useState<UserData[]>([]);
    const [requestsList, setRequestsList] = useState<RequestData[]>([]);
    const [listLoading, setListLoading] = useState(false);

    // Fetch Initial Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [statsRes, activityRes, advancedRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/stats`, { headers }),
                    fetch(`${API_BASE_URL}/admin/activity`, { headers }),
                    fetch(`${API_BASE_URL}/admin/advanced-stats`, { headers })
                ]);

                if (statsRes.ok && activityRes.ok && advancedRes.ok) {
                    setStats(await statsRes.json());
                    setRecentActivity(await activityRes.json());
                    setAdvancedStats(await advancedRes.json());
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Fetch Lists on demand
    const fetchList = async (type: 'users' | 'requests') => {
        setListLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${API_BASE_URL}/admin/${type}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                if (type === 'users') setUsersList(data);
                else setRequestsList(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setListLoading(false);
        }
    }

    // Handlers
    const handleViewChange = (view: typeof currentView) => {
        setCurrentView(view);
        if (view === 'users' && usersList.length === 0) fetchList('users');
        if (view === 'requests' && requestsList.length === 0) fetchList('requests');
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-teal-600 animate-pulse">Chargement...</div>;
    }

    // --- Sub-View Renderers ---

    const renderHeader = (title: string, isHome: boolean = false) => (
        isHome ? (
            <header className="bg-white p-6 rounded-b-[30px] shadow-sm mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Monitoring <span className="text-teal-600">Admin</span></h1>
                        <p className="text-gray-500 mt-1">Gérez votre application TidJob</p>
                    </div>
                    <button
                        onClick={() => navigateTo(Screen.AccountSettings)}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 hover:text-teal-600 transition-colors"
                    >
                        <Icons.Logout />
                    </button>
                </div>
            </header>
        ) : (
            <div className="flex flex-col mb-8 px-4">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-4">{title}</h2>
                <div className="flex justify-end">
                    <button
                        onClick={() => setCurrentView('menu')}
                        className="flex items-center space-x-2 text-gray-600 bg-white hover:bg-gray-50 hover:text-teal-600 px-6 py-2 rounded-xl transition-all shadow-sm border border-gray-200"
                    >
                        <Icons.Back />
                        <span className="font-medium">Accueil</span>
                    </button>
                </div>
            </div>
        )
    );

    const renderUsers = () => (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {renderHeader('Utilisateurs')}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mx-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 font-bold">Nom</th>
                                <th className="px-8 py-5 font-bold">Email</th>
                                <th className="px-8 py-5 font-bold">Rôle</th>
                                <th className="px-8 py-5 font-bold">Inscrit le</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {listLoading ? <tr><td colSpan={4} className="p-10 text-center text-teal-600">Chargement...</td></tr> :
                                usersList.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 font-semibold text-gray-900">{u.name}</td>
                                        <td className="px-8 py-5">{u.email}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role === 'provider' ? 'Prestataire' : 'Client'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRequests = () => (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {renderHeader('Demandes de Service')}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mx-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 font-bold">Titre</th>
                                <th className="px-8 py-5 font-bold">Catégorie</th>
                                <th className="px-8 py-5 font-bold">Budget</th>
                                <th className="px-8 py-5 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {listLoading ? <tr><td colSpan={4} className="p-10 text-center text-teal-600">Chargement...</td></tr> :
                                requestsList.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 font-semibold text-gray-900">{r.title}</td>
                                        <td className="px-8 py-5"><span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200">{r.category}</span></td>
                                        <td className="px-8 py-5 font-bold text-teal-600 text-lg">{r.budget ? `${r.budget} €` : '-'}</td>
                                        <td className="px-8 py-5">{new Date(r.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderPerformanceTable = (title: string, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode) => (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {renderHeader(title)}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mx-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 uppercase text-xs tracking-wider border-b border-gray-100">
                            <tr>
                                {headers.map(h => <th key={h} className="px-8 py-5 text-center first:text-left font-bold">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map(renderRow)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderConnections = () => (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {renderHeader('Connexions (30 Derniers Jours)')}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mx-4">
                <div className="h-64 flex items-end justify-between space-x-2">
                    {advancedStats?.dailyConnections.map((day: any, i: number) => {
                        const max = Math.max(...advancedStats.dailyConnections.map((d: any) => d.count), 5);
                        const h = (day.count / max) * 100;
                        return (
                            <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
                                <div
                                    className="w-full bg-red-100 hover:bg-red-400 rounded-t-md transition-all duration-300 relative"
                                    style={{ height: `${h}%` }}>
                                </div>
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                                    {day.date}: {day.count}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 flex justify-between text-gray-400 text-sm font-medium border-t border-gray-100 pt-2">
                    <span>Il y a 30 jours</span>
                    <span>Aujourd'hui</span>
                </div>
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="px-4">
                {renderHeader('Top Catégories')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {/* Demandes Clients Card */}
                <div
                    onClick={() => handleViewChange('requests')}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group flex items-center justify-center h-48"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-teal-600 group-hover:scale-110 transition-transform duration-300">
                            <Icons.Chart />
                        </span>
                        <h3 className="text-2xl font-bold text-teal-600 group-hover:text-teal-700 transition-colors text-left leading-tight">
                            Demandes<br />Clients
                        </h3>
                    </div>
                </div>

                {/* Offres Prestataires Card */}
                <div
                    onClick={() => handleViewChange('providers')}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group flex items-center justify-center h-48"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                            <Icons.Stats />
                        </span>
                        <h3 className="text-2xl font-bold text-yellow-500 group-hover:text-yellow-600 transition-colors text-left leading-tight">
                            Offres<br />Prestataires
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMessages = () => (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {renderHeader('Messages & Support')}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 mx-4 text-center">
                <div className="mb-6 inline-block p-4 bg-pink-100 rounded-full text-pink-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Boîte de Réception Admin</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Le module de gestion des messages de support et des signalements est en cours de déploiement final.
                </p>
                <button
                    onClick={() => setCurrentView('menu')}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                    Retour au menu
                </button>
            </div>
        </div>
    );

    // --- Main Menu Grid ---
    if (currentView === 'menu') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans overflow-hidden relative">
                {renderHeader('', true)}

                <div className="max-w-xl mx-auto px-6 pb-20">
                    <div className="grid grid-cols-2 gap-6">
                        <MenuTile
                            title="Utilisateurs"
                            icon={<Icons.Users />}
                            colorClass="bg-purple-50 group-hover:bg-purple-500"
                            textClass="text-purple-600"
                            value={stats?.users}
                            onClick={() => handleViewChange('users')}
                        />
                        <MenuTile
                            title="Demandes"
                            icon={<Icons.Requests />}
                            colorClass="bg-blue-50 group-hover:bg-blue-500"
                            textClass="text-blue-600"
                            value={stats?.requests}
                            onClick={() => handleViewChange('requests')}
                        />
                        <MenuTile
                            title="Prestataires"
                            icon={<Icons.Check />}
                            colorClass="bg-teal-50 group-hover:bg-teal-500"
                            textClass="text-teal-600"
                            onClick={() => handleViewChange('providers')}
                        />
                        <MenuTile
                            title="Clients"
                            icon={<Icons.Stats />}
                            colorClass="bg-orange-50 group-hover:bg-orange-500"
                            textClass="text-orange-600"
                            onClick={() => handleViewChange('clients')}
                        />
                        <MenuTile
                            title="Connexions"
                            icon={<Icons.Chart />}
                            colorClass="bg-red-50 group-hover:bg-red-500"
                            textClass="text-red-600"
                            onClick={() => handleViewChange('connections')}
                        />
                        <MenuTile
                            title="Catégories"
                            icon={<span className="text-3xl">🗂️</span>}
                            colorClass="bg-yellow-50 group-hover:bg-yellow-500"
                            textClass="text-yellow-600"
                            onClick={() => handleViewChange('categories')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- Detail View Wrapper ---
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans overflow-y-auto">
            <div className="pt-8 pb-20">
                {currentView === 'users' && renderUsers()}
                {currentView === 'requests' && renderRequests()}
                {currentView === 'providers' && renderPerformanceTable('Performance Prestataires', advancedStats?.providerStats || [], ['Nom', 'Offres', 'Réalisées'], (p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 font-semibold text-gray-900">{p.name}</td>
                        <td className="px-8 py-5 text-center">{p.offered}</td>
                        <td className="px-8 py-5 text-center text-teal-600 font-bold text-lg">{p.realized}</td>
                    </tr>
                ))}
                {currentView === 'clients' && renderPerformanceTable('Performance Clients', advancedStats?.clientStats || [], ['Nom', 'Postés', 'Reçus'], (c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 font-semibold text-gray-900">{c.name}</td>
                        <td className="px-8 py-5 text-center">{c.posted}</td>
                        <td className="px-8 py-5 text-center text-blue-600 font-bold text-lg">{c.received}</td>
                    </tr>
                ))}
                {currentView === 'connections' && renderConnections()}
                {currentView === 'categories' && renderCategories()}
                {currentView === 'messages' && renderMessages()}
            </div>
        </div>
    );
};

export default DashboardScreen;
