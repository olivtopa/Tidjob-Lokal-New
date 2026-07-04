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

interface ServiceData {
    id: string;
    title: string;
    category: string;
    price: number;
    createdAt: string;
}

interface DashboardScreenProps {
    navigateTo: (screen: Screen) => void;
    onLogout: () => void;
}

// --- Premium SVG Icons ---
const Icons = {
    Users: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Requests: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    ),
    Services: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Connections: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    Signups: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
    ),
    Categories: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    Messages: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    Logout: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
    Back: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
    ),
    Delete: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Calendar: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
};

// --- Custom Interactive Chart Component ---
const AnalyticsChart = ({
    connectionsData,
    signupsData
}: {
    connectionsData: { date: string; count: number }[];
    signupsData: { date: string; count: number }[];
}) => {
    const [chartMode, setChartMode] = useState<'both' | 'connections' | 'signups'>('both');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Merge & sync datasets chronologically
    const allDates = Array.from(new Set([
        ...connectionsData.map(d => d.date),
        ...signupsData.map(d => d.date)
    ])).sort();

    // Map data to all dates
    const dataPoints = allDates.map(date => {
        const connObj = connectionsData.find(d => d.date === date);
        const signupObj = signupsData.find(d => d.date === date);
        return {
            date,
            connections: connObj ? connObj.count : 0,
            signups: signupObj ? signupObj.count : 0
        };
    }).slice(-15); // Show last 15 active days for readability

    if (dataPoints.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-400 font-medium">
                Pas assez de données pour afficher le graphique.
            </div>
        );
    }

    const maxVal = Math.max(
        ...dataPoints.map(d => Math.max(d.connections, d.signups)),
        10
    );

    // SVG coordinates computation
    const width = 600;
    const height = 240;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const getX = (index: number) => padding + (index / (dataPoints.length - 1)) * chartWidth;
    const getY = (val: number) => height - padding - (val / maxVal) * chartHeight;

    // SVG Paths
    const getBezierPath = (type: 'connections' | 'signups') => {
        let path = '';
        dataPoints.forEach((point, i) => {
            const val = type === 'connections' ? point.connections : point.signups;
            const x = getX(i);
            const y = getY(val);
            if (i === 0) {
                path += `M ${x} ${y}`;
            } else {
                const prevX = getX(i - 1);
                const prevVal = type === 'connections' ? dataPoints[i - 1].connections : dataPoints[i - 1].signups;
                const prevY = getY(prevVal);
                const cpX1 = prevX + (x - prevX) / 2;
                const cpY1 = prevY;
                const cpX2 = prevX + (x - prevX) / 2;
                const cpY2 = y;
                path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
            }
        });
        return path;
    };

    const getAreaPath = (type: 'connections' | 'signups') => {
        const linePath = getBezierPath(type);
        if (!linePath) return '';
        const startX = getX(0);
        const endX = getX(dataPoints.length - 1);
        const bottomY = height - padding;
        return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
    };

    // Format dates for display
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Activité Générale</h3>
                    <p className="text-sm text-gray-500 mt-1">Volume de connexions et d'inscriptions (utilisateurs réels)</p>
                </div>
                <div className="flex bg-gray-100/80 p-1 rounded-xl text-xs font-semibold text-gray-600">
                    <button
                        onClick={() => setChartMode('both')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${chartMode === 'both' ? 'bg-white text-teal-600 shadow-sm' : 'hover:text-gray-900'}`}
                    >
                        Tous
                    </button>
                    <button
                        onClick={() => setChartMode('connections')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${chartMode === 'connections' ? 'bg-white text-teal-600 shadow-sm' : 'hover:text-gray-900'}`}
                    >
                        Connexions
                    </button>
                    <button
                        onClick={() => setChartMode('signups')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${chartMode === 'signups' ? 'bg-white text-teal-600 shadow-sm' : 'hover:text-gray-900'}`}
                    >
                        Inscriptions
                    </button>
                </div>
            </div>

            {/* Chart SVG */}
            <div className="relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    <defs>
                        <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = padding + ratio * chartHeight;
                        const labelVal = Math.round(maxVal * (1 - ratio));
                        return (
                            <g key={i} className="opacity-40">
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="text-[10px] fill-gray-400 font-medium"
                                >
                                    {labelVal}
                                </text>
                            </g>
                        );
                    })}

                    {/* Render Area/Curves */}
                    {chartMode !== 'signups' && (
                        <>
                            <path d={getAreaPath('connections')} fill="url(#colorConnections)" />
                            <path
                                d={getBezierPath('connections')}
                                fill="none"
                                stroke="#0d9488"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                            />
                        </>
                    )}

                    {chartMode !== 'connections' && (
                        <>
                            <path d={getAreaPath('signups')} fill="url(#colorSignups)" />
                            <path
                                d={getBezierPath('signups')}
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                            />
                        </>
                    )}

                    {/* X Axis Labels */}
                    {dataPoints.map((point, i) => {
                        if (i % 2 !== 0 && i !== dataPoints.length - 1) return null; // Avoid labels overcrowding
                        return (
                            <text
                                key={i}
                                x={getX(i)}
                                y={height - 8}
                                textAnchor="middle"
                                className="text-[10px] fill-gray-400 font-semibold"
                            >
                                {formatDate(point.date)}
                            </text>
                        );
                    })}

                    {/* Interactive Hover Bars */}
                    {dataPoints.map((point, i) => (
                        <rect
                            key={i}
                            x={getX(i) - chartWidth / (dataPoints.length * 2)}
                            y={padding}
                            width={chartWidth / dataPoints.length}
                            height={chartHeight}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    ))}

                    {/* Hover line & helper dots */}
                    {hoveredIndex !== null && (
                        <g>
                            <line
                                x1={getX(hoveredIndex)}
                                y1={padding}
                                x2={getX(hoveredIndex)}
                                x2-={getX(hoveredIndex)}
                                y2={height - padding}
                                stroke="#cbd5e1"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                            />
                            {chartMode !== 'signups' && (
                                <circle
                                    cx={getX(hoveredIndex)}
                                    cy={getY(dataPoints[hoveredIndex].connections)}
                                    r={5}
                                    fill="#0d9488"
                                    stroke="white"
                                    strokeWidth={1.5}
                                    className="shadow"
                                />
                            )}
                            {chartMode !== 'connections' && (
                                <circle
                                    cx={getX(hoveredIndex)}
                                    cy={getY(dataPoints[hoveredIndex].signups)}
                                    r={5}
                                    fill="#6366f1"
                                    stroke="white"
                                    strokeWidth={1.5}
                                    className="shadow"
                                />
                            )}
                        </g>
                    )}
                </svg>
            </div>

            {/* Custom Tooltip Card */}
            {hoveredIndex !== null && (
                <div className="mt-4 p-3 bg-slate-900 text-white rounded-xl shadow-xl flex items-center justify-between text-xs animate-fade-in">
                    <div>
                        <span className="font-semibold text-slate-300">Date:</span>{' '}
                        <span className="font-bold">{dataPoints[hoveredIndex].date}</span>
                    </div>
                    <div className="flex gap-4">
                        {chartMode !== 'signups' && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
                                <span className="text-slate-300">Connexions :</span>
                                <span className="font-bold text-teal-400">{dataPoints[hoveredIndex].connections}</span>
                            </div>
                        )}
                        {chartMode !== 'connections' && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                                <span className="text-slate-300">Inscriptions :</span>
                                <span className="font-bold text-indigo-400">{dataPoints[hoveredIndex].signups}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Legend indicators */}
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-500">
                {chartMode !== 'signups' && (
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-teal-500 inline-block"></span>
                        <span>Connexions Actives (non-admin)</span>
                    </div>
                )}
                {chartMode !== 'connections' && (
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                        <span>Nouveaux Inscrits</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo, onLogout }) => {
    // State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<{ recentUsers: UserData[], recentRequests: RequestData[] } | null>(null);
    const [advancedStats, setAdvancedStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // View Navigation
    const [currentView, setCurrentView] = useState<'menu' | 'users' | 'requests' | 'services' | 'providers' | 'clients' | 'connections' | 'categories' | 'messages'>('menu');
    const [historyStack, setHistoryStack] = useState<string[]>(['menu']);

    // List Data
    const [usersList, setUsersList] = useState<UserData[]>([]);
    const [requestsList, setRequestsList] = useState<RequestData[]>([]);
    const [servicesList, setServicesList] = useState<ServiceData[]>([]);
    const [listLoading, setListLoading] = useState(false);

    // Search & Filter state for lists
    const [searchQuery, setSearchQuery] = useState('');

    const loadDashboardData = async (showLoading = true) => {
        if (showLoading) setLoading(true);
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
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData(true);
    }, []);

    const fetchList = async (type: 'users' | 'requests' | 'services') => {
        setListLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${API_BASE_URL}/admin/${type}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                if (type === 'users') setUsersList(data);
                else if (type === 'requests') setRequestsList(data);
                else if (type === 'services') setServicesList(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setListLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) return;
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchList('users');
                loadDashboardData(false);
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de la suppression');
            }
        } catch (e) {
            console.error(e);
            alert('Erreur réseau');
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchList('services');
                loadDashboardData(false);
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de la suppression');
            }
        } catch (e) {
            console.error(e);
            alert('Erreur réseau');
        }
    };

    const handleDeleteRequest = async (requestId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`${API_BASE_URL}/admin/requests/${requestId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchList('requests');
                loadDashboardData(false);
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de la suppression');
            }
        } catch (e) {
            console.error(e);
            alert('Erreur réseau');
        }
    };

    const handleViewChange = (view: typeof currentView) => {
        setHistoryStack(prev => [...prev, view]);
        setCurrentView(view);
        setSearchQuery('');
        if (view === 'users' && usersList.length === 0) fetchList('users');
        if (view === 'requests' && requestsList.length === 0) fetchList('requests');
        if (view === 'services' && servicesList.length === 0) fetchList('services');
    };

    const handleBack = () => {
        setSearchQuery('');
        if (historyStack.length > 1) {
            const newStack = [...historyStack];
            newStack.pop();
            const prevView = newStack[newStack.length - 1] as typeof currentView;
            setHistoryStack(newStack);
            setCurrentView(prevView);
        } else {
            setCurrentView('menu');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-teal-600 font-semibold tracking-wide">Chargement du tableau de bord...</div>
            </div>
        );
    }

    // --- Header ---
    const renderHeader = (title: string, isHome: boolean = false) => {
        const isDetailView = currentView !== 'menu';
        const backLabel = isDetailView ? "Retour au menu" : "Accueil";

        return isHome ? (
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-500/10 p-2.5 rounded-xl text-teal-600">
                        <Icons.Connections className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">TidJob Console</h1>
                        <p className="text-xs text-gray-500 font-medium">Panneau d'administration principal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                        <Icons.Logout className="w-4 h-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </header>
        ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    <p className="text-sm text-gray-500">Gestion et consultation des données</p>
                </div>
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 hover:text-teal-600 px-5 py-2.5 rounded-xl transition-all shadow-sm border border-gray-100 text-sm font-semibold"
                >
                    <Icons.Back className="w-4 h-4" />
                    <span>{backLabel}</span>
                </button>
            </div>
        );
    };

    // --- Sub-View Renderers ---

    const renderUsers = () => {
        const filteredUsers = usersList.filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="max-w-6xl mx-auto px-4 animate-fade-in">
                {renderHeader('Utilisateurs')}
                
                <div className="mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Rôle</th>
                                    <th className="px-6 py-4">Inscrit le</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                {listLoading ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-teal-600">Chargement...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-400">Aucun utilisateur trouvé</td></tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${u.role === 'provider' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                    {u.role === 'provider' ? 'Prestataire' : 'Client'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-center">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                                                        title="Supprimer l'utilisateur"
                                                    >
                                                        <Icons.Delete className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderRequests = () => {
        const filteredRequests = requestsList.filter(r => 
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            r.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="max-w-6xl mx-auto px-4 animate-fade-in">
                {renderHeader('Demandes de Service')}

                <div className="mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Rechercher par titre ou catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Titre</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Publié le</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                {listLoading ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-teal-600">Chargement...</td></tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-400">Aucune demande trouvée</td></tr>
                                ) : (
                                    filteredRequests.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{r.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                                    {r.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-teal-600 font-bold text-base">{r.budget ? `${r.budget} €` : '-'}</td>
                                            <td className="px-6 py-4 text-gray-400">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteRequest(r.id)}
                                                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                                                    title="Supprimer la demande"
                                                >
                                                    <Icons.Delete className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderServices = () => {
        const filteredServices = servicesList.filter(s => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="max-w-6xl mx-auto px-4 animate-fade-in">
                {renderHeader('Offres de Services')}

                <div className="mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Rechercher par titre ou catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Titre</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4">Prix</th>
                                    <th className="px-6 py-4">Créé le</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                {listLoading ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-teal-600">Chargement...</td></tr>
                                ) : filteredServices.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-gray-400">Aucune offre trouvée</td></tr>
                                ) : (
                                    filteredServices.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{s.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                                                    {s.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-teal-600 font-bold text-base">{s.price ? `${s.price} €` : '-'}</td>
                                            <td className="px-6 py-4 text-gray-400">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteService(s.id)}
                                                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all inline-flex items-center justify-center border border-transparent hover:border-rose-100"
                                                    title="Supprimer l'offre"
                                                >
                                                    <Icons.Delete className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderPerformanceTable = (title: string, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode) => (
        <div className="max-w-5xl mx-auto px-4 animate-fade-in">
            {renderHeader(title)}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            <tr>
                                {headers.map(h => <th key={h} className="px-6 py-4 text-center first:text-left">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {data.length === 0 ? (
                                <tr><td colSpan={headers.length} className="p-12 text-center text-gray-400">Aucune donnée disponible</td></tr>
                            ) : (
                                data.map(renderRow)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="max-w-6xl mx-auto px-4 animate-fade-in">
            {renderHeader('Top Catégories')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demandes Clients Card */}
                <div
                    onClick={() => handleViewChange('requests')}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group flex items-center justify-between"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Icons.Requests className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Demandes Clients</h3>
                            <p className="text-xs text-gray-400 mt-1">Consulter l'historique complet</p>
                        </div>
                    </div>
                    <span className="text-teal-600 font-bold text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </div>

                {/* Offres Prestataires Card */}
                <div
                    onClick={() => handleViewChange('services')}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group flex items-center justify-between"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Icons.Services className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Offres Prestataires</h3>
                            <p className="text-xs text-gray-400 mt-1">Consulter les services proposés</p>
                        </div>
                    </div>
                    <span className="text-indigo-600 font-bold text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </div>
    );

    const renderMessages = () => (
        <div className="max-w-4xl mx-auto px-4 animate-fade-in">
            {renderHeader('Messages & Support')}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
                <div className="mb-6 inline-block p-4 bg-teal-50 rounded-full text-teal-600">
                    <Icons.Messages className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Boîte de Réception Support</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    Le module de gestion des messages de support, signalements et modérations en temps réel est actuellement en cours d'intégration finale.
                </p>
                <button
                    onClick={() => setCurrentView('menu')}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                    Retour à l'accueil admin
                </button>
            </div>
        </div>
    );

    // --- Main Menu Dashboard ---
    if (currentView === 'menu') {
        return (
            <div className="min-h-screen bg-slate-50/50 font-sans text-gray-800 pb-20">
                {renderHeader('', true)}

                <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
                    {/* Upper Analytics Cards Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Users Card */}
                        <div
                            onClick={() => handleViewChange('users')}
                            className="bg-white rounded-3xl p-6 border border-gray-100/70 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membres Actifs</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats?.users || 0}</h3>
                                </div>
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                                    <Icons.Users className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400">
                                <span className="font-semibold text-teal-600 bg-teal-50 border border-teal-100/55 px-2 py-0.5 rounded-lg mr-2">Clients: {advancedStats?.counts?.clients || 0}</span>
                                <span className="font-semibold text-purple-600 bg-purple-50 border border-purple-100/55 px-2 py-0.5 rounded-lg">Pro: {advancedStats?.counts?.providers || 0}</span>
                            </div>
                        </div>

                        {/* Requests Card */}
                        <div
                            onClick={() => handleViewChange('requests')}
                            className="bg-white rounded-3xl p-6 border border-gray-100/70 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demandes Actives</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stats?.requests || 0}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                    <Icons.Requests className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 font-semibold text-blue-600">
                                <span>Voir et modérer toutes les demandes</span>
                            </div>
                        </div>

                        {/* Services Card */}
                        <div
                            onClick={() => handleViewChange('services')}
                            className="bg-white rounded-3xl p-6 border border-gray-100/70 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offres Proposées</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{advancedStats?.counts?.servicesOffered || 0}</h3>
                                </div>
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                    <Icons.Services className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 font-semibold text-indigo-600">
                                <span>Voir et modérer tous les services</span>
                            </div>
                        </div>

                        {/* Navigation Card: Shortcuts */}
                        <div
                            onClick={() => handleViewChange('categories')}
                            className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 text-white relative group overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-teal-100 uppercase tracking-wider">Performance</p>
                                    <h3 className="text-xl font-bold tracking-tight">Vue d'ensemble</h3>
                                </div>
                                <div className="p-3 bg-white/20 text-white rounded-2xl transition-all duration-300">
                                    <Icons.Categories className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center text-xs text-teal-100 font-bold gap-2">
                                <span>Analyser les catégories & performances</span>
                                <span>→</span>
                            </div>
                        </div>
                    </section>

                    {/* Chart & Quick List Controls */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Interactive Analytics Chart */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnalyticsChart
                                connectionsData={advancedStats?.dailyConnections || []}
                                signupsData={advancedStats?.dailySignups || []}
                            />

                            {/* Additional Segment / Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => handleViewChange('providers')}
                                    className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-sm cursor-pointer transition-all group"
                                >
                                    <div className="p-3 bg-purple-50 text-purple-700 rounded-xl group-hover:scale-105 transition-all">
                                        <Icons.Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">Performance Prestataires</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Analyse des réalisations</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => handleViewChange('clients')}
                                    className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-sm cursor-pointer transition-all group"
                                >
                                    <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:scale-105 transition-all">
                                        <Icons.Requests className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">Performance Clients</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Analyse des demandes reçues</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Sidepanel */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-extrabold text-gray-900 text-lg">Dernières Inscriptions</h3>
                                    <button
                                        onClick={() => handleViewChange('users')}
                                        className="text-xs text-teal-600 hover:text-teal-700 font-bold"
                                    >
                                        Voir tous
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity?.recentUsers?.map((user, i) => (
                                        <div key={user.id || i} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm text-gray-800">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md tracking-wider ${user.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role === 'provider' ? 'Pro' : 'Client'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-extrabold text-gray-900 text-lg">Demandes Récentes</h3>
                                    <button
                                        onClick={() => handleViewChange('requests')}
                                        className="text-xs text-teal-600 hover:text-teal-700 font-bold"
                                    >
                                        Voir toutes
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity?.recentRequests?.map((req, i) => (
                                        <div key={req.id || i} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                                            <div className="space-y-1 max-w-[70%]">
                                                <p className="font-bold text-sm text-gray-800 truncate">{req.title}</p>
                                                <p className="text-xs text-gray-400 truncate">{req.category}</p>
                                            </div>
                                            <span className="font-bold text-xs text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg">
                                                {req.budget ? `${req.budget}€` : 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    // --- Detail View Wrapper ---
    return (
        <div className="min-h-screen bg-slate-50/50 text-gray-800 font-sans overflow-y-auto">
            <div className="pt-8 pb-20">
                {currentView === 'users' && renderUsers()}
                {currentView === 'requests' && renderRequests()}
                {currentView === 'services' && renderServices()}
                {currentView === 'providers' && renderPerformanceTable('Performance Prestataires', advancedStats?.providerStats || [], ['Nom', 'Offres proposées', 'Réalisations'], (p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-600">{p.offered}</td>
                        <td className="px-6 py-4 text-center text-teal-600 font-bold text-base">{p.realized}</td>
                    </tr>
                ))}
                {currentView === 'clients' && renderPerformanceTable('Performance Clients', advancedStats?.clientStats || [], ['Nom', 'Demandes postées', 'Prestations reçues'], (c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-600">{c.posted}</td>
                        <td className="px-6 py-4 text-center text-blue-600 font-bold text-base">{c.received}</td>
                    </tr>
                ))}
                {currentView === 'categories' && renderCategories()}
                {currentView === 'messages' && renderMessages()}
            </div>
        </div>
    );
};

export default DashboardScreen;
