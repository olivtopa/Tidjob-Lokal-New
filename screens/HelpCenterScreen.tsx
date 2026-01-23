
import React, { useState } from 'react';
import { Screen, User } from '../types';
import { API_BASE_URL } from '../constants';

interface HelpCenterScreenProps {
    navigateTo: (screen: Screen) => void;
    user: User | null;
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 py-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left font-medium text-gray-800"
            >
                <span>{question}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {answer}
                </p>
            )}
        </div>
    );
};

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ navigateTo, user }) => {
    return (
        <div className="bg-gray-100 min-h-full pb-20">
            <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={() => navigateTo(Screen.Profile)} className="text-gray-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Centre d'aide</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Section FAQ */}
                <section className="bg-white rounded-xl shadow-sm p-5">
                    <h2 className="text-lg font-bold text-teal-600 mb-4">Questions Fréquentes</h2>

                    {user?.role === 'provider' ? (
                        <FAQItem
                            question="Comment proposer un service ?"
                            answer="Vous avez deux possibilités : cliquez sur l'icône '+' dans la barre de menu en bas, ou utilisez le bouton 'Proposer un service' directement sur votre écran d'accueil."
                        />
                    ) : (
                        <FAQItem
                            question="Comment demander un service ?"
                            answer="Pour demander un service, allez sur l'écran d'accueil et cliquez sur le bouton 'Demander un service'. Décrivez votre besoin et publiez votre annonce."
                        />
                    )}

                    <FAQItem
                        question="Le paiement est-il sécurisé ?"
                        answer="Tidjob Lokal met en relation les particuliers. Le paiement se fait généralement en main propre ou via les méthodes convenues entre vous et le prestataire. Nous travaillons sur une solution de paiement intégrée."
                    />
                    <FAQItem
                        question="Comment contacter un prestataire ?"
                        answer="Sur la fiche d'un service, cliquez sur le bouton 'Contacter' pour ouvrir une discussion directe via la messagerie de l'application."
                    />
                    <FAQItem
                        question="J'ai oublié mon mot de passe"
                        answer="Pour le moment, contactez le support directement pour réinitialiser votre accès."
                    />
                </section>

                {/* Section Contact Form */}
                <section className="bg-white rounded-xl shadow-sm p-5">
                    <h2 className="text-lg font-bold text-teal-600 mb-2">Nous contacter</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Vous ne trouvez pas la réponse à votre question ? Envoyez-nous un message directement.
                    </p>

                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement;
                        const message = messageInput.value;
                        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

                        if (!message.trim()) return;

                        submitButton.disabled = true;
                        submitButton.textContent = 'Envoi...';

                        try {
                            const response = await fetch(`${API_BASE_URL}/support/contact`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    message,
                                    email: user?.email,
                                    name: user?.name
                                })
                            });

                            if (response.ok) {
                                alert('Message envoyé avec succès !');
                                messageInput.value = '';
                            } else {
                                alert('Erreur lors de l\'envoi.');
                            }
                        } catch (error) {
                            console.error(error);
                            alert('Erreur de connexion.');
                        } finally {
                            submitButton.disabled = false;
                            submitButton.textContent = 'Envoyer le message';
                        }
                    }}>
                        <textarea
                            name="message"
                            rows={4}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 mb-3"
                            placeholder="Votre message pour contact@tidjob.com..."
                        ></textarea>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-teal-300"
                        >
                            Envoyer le message
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
};

export default HelpCenterScreen;
