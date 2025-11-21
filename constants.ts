import { ServiceCategory } from './types';
import GardeningIcon from './components/icons/GardeningIcon';
import CleaningIcon from './components/icons/CleaningIcon';
import TutoringIcon from './components/icons/TutoringIcon';
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
  { id: 'cat-1', name: 'Jardinage', icon: GardeningIcon, imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80' },
  { id: 'cat-2', name: 'Ménage', icon: CleaningIcon, imageUrl: 'https://images.unsplash.com/photo-1581578731117-104f8a746956?auto=format&fit=crop&w=800&q=80' },
  { id: 'cat-3', name: 'Cours', icon: TutoringIcon, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80' },
  { id: 'cat-4', name: 'Bricolage', icon: BricolageIcon, imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80' },
  { id: 'cat-5', name: 'Garde d\'enfant', icon: GardeEnfantIcon, imageUrl: 'https://images.unsplash.com/photo-1502086223501-68119195a544?auto=format&fit=crop&w=800&q=80' },
  { id: 'cat-6', name: 'Covoiturage', icon: CovoiturageIcon, imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80' },
];
