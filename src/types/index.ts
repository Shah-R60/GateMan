export interface Location {
  id: string;
  name: string;
  city: string;
}

export interface Workspace {
  id: string;
  name: string;
  location: string;
  distance: string;
  hours: string;
  price: number;
  currency: string;
  period: string;
  imageUrl: string;
  isPopular?: boolean;
  rating?: number;
  amenities?: string[];
  seatingTypes?: SeatingType[];
}

export interface SeatingType {
  type: 'Open Desk' | 'Private Desk' | 'Meeting Room';
  available: boolean;
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  description: string;
  code: string;
  backgroundColor: string;
  textColor: string;
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
}

export type TabNavigationType = 'Home' | 'Desks' | 'Meeting Rooms' | 'Bookings';
