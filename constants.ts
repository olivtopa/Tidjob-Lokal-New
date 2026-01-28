import { ServiceCategory } from './types';
import PrunerIcon from './components/icons/PrunerIcon';
import CleaningBucketIcon from './components/icons/CleaningBucketIcon';
import TutoringIcon from './components/icons/TutoringIcon';
import BricolageIcon from './components/icons/BricolageIcon';
import GardeEnfantIcon from './components/icons/GardeEnfantIcon';
import CovoiturageIcon from './components/icons/CovoiturageIcon';

import ShearsIcon from './components/icons/ShearsIcon';
import ChefIcon from './components/icons/ChefIcon';

let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Handle Render internal hostnames (e.g., "service-name-slug") by appending .onrender.com
if (!baseUrl.includes('localhost') && !baseUrl.includes('.')) {
  baseUrl = `${baseUrl}.onrender.com`;
}

if (!baseUrl.startsWith('http')) {
  baseUrl = `https://${baseUrl}`;
}
export const API_BASE_URL = `${baseUrl}/api`;

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Jardinage', icon: PrunerIcon, imageUrl: '/images/categories/jardinage.png' },
  { id: 'cat-2', name: 'Ménage', icon: CleaningBucketIcon, imageUrl: '/images/categories/menage.png' },
  { id: 'cat-3', name: 'Cours', icon: TutoringIcon, imageUrl: '/images/categories/cours.png' },
  { id: 'cat-4', name: 'Bricolage', icon: BricolageIcon, imageUrl: '/images/categories/bricolage.png' },
  { id: 'cat-5', name: 'Garde d\'enfant', icon: GardeEnfantIcon, imageUrl: '/images/categories/garde-enfant.png' },
  { id: 'cat-6', name: 'Covoiturage', icon: CovoiturageIcon, imageUrl: '/images/categories/covoiturage.png' },
  { id: 'cat-7', name: 'Beauté & Bien-être', icon: ShearsIcon, imageUrl: '/images/categories/beaute.png' },
  { id: 'cat-8', name: 'Cuisine & Traiteur', icon: ChefIcon, imageUrl: '/images/categories/cuisine.png' },
];
