
import React, { useState } from 'react';
import { Screen, User } from '../types';
import { API_BASE_URL } from '../constants';

interface AccountSettingsScreenProps {
    user: User;
    navigateTo: (screen: Screen) => void;
    onLogout: () => void;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ user: initialUser, navigateTo, onLogout }) => {
    const [user, setUser] = useState(initialUser);
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };
        return fetch(url, { ...options, headers });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                body: JSON.stringify({ name, avatarUrl }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erreur lors de la mise à jour');

            setUser(prev => ({ ...prev, ...data }));
            setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/password`, {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Erreur lors du changement de mot de passe');

            setMessage({ text: 'Mot de passe modifié avec succès', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors de la suppression');
            }

            onLogout();
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-full pb-20">
            <div className="bg-white shadow-sm p-4 flex items-center">
                <button onClick={() => navigateTo(Screen.Profile)} className="mr-4 text-gray-600 font-bold text-xl">
                    ←
                </button>
                <h1 className="text-xl font-bold text-gray-900">Paramètres du compte</h1>
            </div>

            <div className="p-4 space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* Section Profil Public */}
                <section className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Profil Public</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'affichage</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Avatar</label>
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://example.com/masuperphoto.jpg"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            {avatarUrl && (
                                <div className="mt-2">
                                    <img src={avatarUrl} alt="Aperçu" className="w-12 h-12 rounded-full object-cover border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Enregistrer les modifications
                        </button>
                    </form>
                </section>

                {/* Section Sécurité */}
                <section className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Sécurité</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !currentPassword || !newPassword}
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Changer le mot de passe
                        </button>
                    </form>
                </section>

                {/* Zone Danger */}
                <section className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
                    <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-red-100 pb-2">Zone Danger</h2>
                    <p className="text-sm text-gray-600 mb-4">La suppression de votre compte est définitive. Toutes vos données seront effacées.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full border border-red-500 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Supprimer mon compte
                    </button>
                </section>
            </div>
        </div>
    );
};

export default AccountSettingsScreen;
