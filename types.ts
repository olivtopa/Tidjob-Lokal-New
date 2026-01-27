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
  AccountSettings,
  ServiceHistory,
  HelpCenter,
  ProviderServices,
  ProviderHome,
  Dashboard,
  ForgotPassword,
  ResetPassword,
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'provider';
  avatarUrl?: string;
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
  zipCode?: string;
  city?: string;
  department?: string;
  serviceRequestId?: string; // Optional, as not all services might originate from a request
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string; // 'user-1' for the current user, or a provider's ID
}

export interface Conversation {
  id: string;
  service?: Service | null; // Optional now
  serviceRequest?: ServiceRequest | null; // New field
  provider: Provider;
  client: User; // Added client to access the other participant
  messages: Message[];
  unread: boolean;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  zipCode?: string;
  city?: string;
  department?: string;
  postedAt: string;
  client: User;
}