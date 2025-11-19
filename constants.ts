import { ServiceCategory } from './types';
import GardeningIcon from './components/icons/GardeningIcon';
import CleaningIcon from './components/icons/CleaningIcon';
import MovingIcon from './components/icons/MovingIcon';
import BricolageIcon from './components/icons/BricolageIcon';
import GardeEnfantIcon from './components/icons/GardeEnfantIcon';
import CovoiturageIcon from './components/icons/CovoiturageIcon';

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
  { id: 'cat-1', name: 'Jardinage', icon: GardeningIcon, imageUrl: 'https://picsum.photos/seed/garden/600/400' },
  { id: 'cat-2', name: 'Ménage', icon: CleaningIcon, imageUrl: 'https://picsum.photos/seed/cleaning/600/400' },
  { id: 'cat-3', name: 'Déménagement', icon: MovingIcon, imageUrl: 'https://picsum.photos/seed/moving/600/400' },
  { id: 'cat-4', name: 'Bricolage', icon: BricolageIcon, imageUrl: 'https://picsum.photos/seed/diy/600/400' },
  { id: 'cat-5', name: 'Garde d\'enfant', icon: GardeEnfantIcon, imageUrl: 'https://picsum.photos/seed/childcare/600/400' },
  { id: 'cat-6', name: 'Covoiturage', icon: CovoiturageIcon, imageUrl: 'https://picsum.photos/seed/carpool/600/400' },
];
