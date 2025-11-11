import React from 'react';
import { Screen } from '../types';

interface LegalScreenProps {
  navigateTo: (screen: Screen) => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ navigateTo }) => {
  return (
    <div className="p-4 bg-white min-h-full">
      <header className="flex items-center pt-4 mb-6">
        <button onClick={() => navigateTo(Screen.Profile)} className="text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Mentions Légales</h1>
      </header>

      <div className="prose max-w-none text-gray-700">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Conditions d'Utilisation</h2>
          <p>Dernière mise à jour : [Date]</p>
          <p>
            Bienvenue sur Tidjob Lokal. En accédant à notre application et en utilisant nos services, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas utiliser notre service.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">1. Comptes Utilisateurs</h3>
          <p>
            Pour utiliser certaines fonctionnalités de l'application, vous devez créer un compte. Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe.
          </p>
           <h3 className="text-lg font-semibold text-gray-800 mt-4">2. Contenu Utilisateur</h3>
          <p>
            Les utilisateurs peuvent publier du contenu, comme des offres de service. Vous êtes seul responsable du contenu que vous publiez. Tidjob Lokal n'est pas responsable des interactions entre utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800">Politique de Confidentialité</h2>
          <p>Dernière mise à jour : [Date]</p>
          <p>
            Votre vie privée est importante pour nous. Cette politique de confidentialité explique comment nous collectons, utilisons, et protégeons vos informations personnelles.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">1. Informations Collectées</h3>
          <p>
            Nous collectons les informations que vous nous fournissez directement, telles que votre nom, votre adresse e-mail, lors de la création de votre compte.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalScreen;