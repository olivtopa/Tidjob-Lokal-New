
import React, { useState } from 'react';
import { Screen } from '../types';

interface HelpCenterScreenProps {
    navigateTo: (screen: Screen) => void;
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

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ navigateTo }) => {
    return (
        <div className="bg-gray-50 min-h-full pb-20">
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
                    <FAQItem
                        question="Comment proposer un service ?"
                        answer="Pour proposer un service, allez dans l'onglet 'Mes Services' et cliquez sur le bouton '+'. Remplissez ensuite le formulaire avec les détails de votre prestation."
                    />
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

                {/* Section Contact */}
                <section className="bg-white rounded-xl shadow-sm p-5">
                    <h2 className="text-lg font-bold text-teal-600 mb-2">Nous contacter</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Vous ne trouvez pas la réponse à votre question ? Notre équipe est là pour vous aider.
                    </p>
                    <a
                        href="mailto:support@tidjob-lokal.com"
                        className="block w-full text-center bg-teal-50 text-teal-700 font-semibold py-3 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                    >
                        📧 Envoyer un email
                    </a>
                </section>

            </div>
        </div>
    );
};

export default HelpCenterScreen;
