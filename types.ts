// FIX: Import React to provide the 'React' namespace for types like React.ComponentType.
import React from 'react';

export enum Screen {
  Landing,
  Login,
  SignUp,
  Home,
  Find,
  Offer,
  Profile,
  Legal,
  ServiceDetail,
  Messages,
  Chat,
  ProviderDashboard,
  RequestService,
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'provider';
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  imageUrl: string;
}

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  job: string;
  reviews: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  provider: Provider;
  category: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string; // 'user-1' for the current user, or a provider's ID
}

export interface Conversation {
  id: string;
  service: Service;
  provider: Provider;
  messages: Message[];
  unread: boolean;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  postedAt: string;
}