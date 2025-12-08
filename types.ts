
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Name of the lucide icon
  color: string;
  subcategories?: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Schedule {
  day: string;
  open: string;
  close: string;
  active: boolean;
}

export interface Provider {
  id: string;
  name: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  distance: string; // e.g., "2.5 km"
  availability: string; // e.g., "Hoy 14:00"
  description: string;
  services: ServiceItem[];
  employees: Employee[];
  schedule: Schedule[];
  verified: boolean;
  phoneNumber?: string; // For WhatsApp integration
  location?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type NotificationType = 'order' | 'promo' | 'system' | 'payment';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export type LocationTarget = 'user' | 'business';
