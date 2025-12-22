import React, { useState } from 'react';
import { Screen } from '../types';

interface LegalScreenProps {
  navigateTo: (screen: Screen) => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'mentions' | 'cgu' | 'privacy'>('cgu');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigateTo(Screen.Profile)} className="text-gray-600 p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Informations Légales</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
          <button
            onClick={() => scrollToSection('mentions')}
            className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-teal-600 border-b-2 border-transparent hover:border-teal-600 whitespace-nowrap"
          >
            Mentions Légales
          </button>
          <button
            onClick={() => scrollToSection('cgu')}
            className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-teal-600 border-b-2 border-transparent hover:border-teal-600 whitespace-nowrap"
          >
            CGU
          </button>
          <button
            onClick={() => scrollToSection('privacy')}
            className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-teal-600 border-b-2 border-transparent hover:border-teal-600 whitespace-nowrap"
          >
            Confidentialité
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-12 pb-20">

          {/* Mentions Légales */}
          <section id="mentions" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">Mentions Légales</h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs de l'application <strong>Tidjob Lokal</strong> les présentes mentions légales.</p>
              <p>La connexion et la navigation sur l'application Tidjob Lokal par l’Utilisateur implique acceptation intégrale et sans réserve des présentes mentions légales.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 1 - L'Éditeur</h3>
              <p>L'édition de l'application Tidjob Lokal est assurée par :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Raison sociale / Nom</strong> : [Nom de votre Entreprise ou Entrepreneur Individuel]</li>
                <li><strong>Forme juridique</strong> : [Vérifier le statut]</li>
                <li><strong>Capital social</strong> : [Montant] (si applicable)</li>
                <li><strong>Adresse</strong> : [Adresse complète]</li>
                <li><strong>Numéro RCS</strong> : [Numéro]</li>
                <li><strong>TVA Intracommunautaire</strong> : [Numéro]</li>
                <li><strong>Directeur de la publication</strong> : [Nom]</li>
                <li><strong>Contact</strong> : [Email] / [Téléphone]</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 2 - L'Hébergeur</h3>
              <p>L'hébergement de la partie backend est assuré par <strong>Render</strong> (San Francisco, USA).</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 3 - Accès à l'application</h3>
              <p>L'application est accessible par tout endroit, 7j/7, 24h/24 sauf cas de force majeure ou maintenance. L'Éditeur ne saurait être tenu responsable en cas de modification, interruption ou suspension de l'application.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 4 - Collecte des données</h3>
              <p>L'application assure une collecte et un traitement d'informations personnelles dans le respect de la vie privée conformément à la loi n°78-17 du 6 janvier 1978. L'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 5 - Propriété intellectuelle</h3>
              <p>Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie de l'application Tidjob Lokal, sans autorisation de l’Editeur est prohibée.</p>
            </div>
          </section>

          {/* CGU */}
          <section id="cgu" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">Conditions Générales d'Utilisation (CGU)</h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p className="font-medium text-gray-500">Dernière mise à jour : [Date du jour]</p>
              <p>Les présentes CGU encadrent l'accès et l’utilisation de l'application <strong>Tidjob Lokal</strong>.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 1 : Mentions Légales</h3>
              <p>Voir section "Mentions Légales" ci-dessus.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 2 : Accès à l'application</h3>
              <p>Tidjob Lokal met en relation des <strong>Clients</strong> et des <strong>Prestataires</strong>. L'accès est gratuit (hors coûts internet à charge de l'utilisateur).</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 3 : Inscription et Compte</h3>
              <p>L'inscription est requise pour certaines fonctionnalités. L'Utilisateur s'engage à fournir des informations exactes et est responsable de la sécurité de son mot de passe et de son compte.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 4 : Services et Fonctionnement</h3>
              <p>Services proposés : Inscription, publication de demandes/offres, messagerie. Tidjob Lokal est un intermédiaire technique et n'est pas partie aux contrats entre utilisateurs.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 5 : Responsabilités</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Utilisateur</strong> : Responsable de ses contenus et du respect des règles de courtoisie.</li>
                <li><strong>Éditeur</strong> : Non responsable des pannes techniques ou des litiges entre utilisateurs.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 6 : Propriété Intellectuelle</h3>
              <p>Tous les contenus de l'application sont protégés par le droit d'auteur. Reproduction interdite sans autorisation.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 7 : Données Personnelles</h3>
              <p>Régies par la Politique de Confidentialité (voir ci-dessous).</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 8 : Liens Hypertextes</h3>
              <p>L'application peut contenir des liens vers des sites tiers dont nous ne sommes pas responsables.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 9 : Cookies</h3>
              <p>Des cookies peuvent s'installer pour le bon fonctionnement et la mesure d'audience. Paramétrable via le navigateur.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Article 10 : Droit Applicable</h3>
              <p>Législation française. Tribunaux français compétents.</p>
            </div>
          </section>

          {/* Politique de Confidentialité */}
          <section id="privacy" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">Politique de Confidentialité</h2>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p className="font-medium text-gray-500">Dernière mise à jour : [Date du jour]</p>
              <p><strong>Tidjob Lokal</strong> traite vos données personnelles conformément au RGPD.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1. Responsable du Traitement</h3>
              <p>[Nom de l'Entreprise], [Adresse], [Email].</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Données Collectées</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identification : Nom, prénom.</li>
                <li>Contact : Email.</li>
                <li>Profil : Rôle, mot de passe (crypté).</li>
                <li>Technique : IP, logs.</li>
                <li>Contenu : Annonces, messages.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Finalités</h3>
              <p>Gestion de compte, mise en relation, support, sécurité, amélioration du service.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4. Base Légale</h3>
              <p>Exécution du contrat (CGU), obligations légales, intérêt légitime.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">5. Destinataires</h3>
              <p>Équipe interne et sous-traitants techniques (hébergement). Pas de revente de données.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">6. Conservation</h3>
              <p>Durée d'activité du compte. Suppression/anonymisation à la clôture (sauf obligations légales).</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">7. Vos Droits</h3>
              <p>Accès, rectification, effacement, limitation, portabilité, opposition. Contact : [Email].</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">8. Sécurité</h3>
              <p>Mesures techniques (HTTPS, hachage) pour protéger vos données.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default LegalScreen;