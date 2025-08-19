import { Location, Workspace, Offer, ServiceType } from '../types';

export const mockLocations: Location[] = [
  { id: '1', name: 'All Locations', city: 'All' },
  { id: '2', name: 'Ahmedabad', city: 'Ahmedabad' },
  { id: '3', name: 'Mumbai', city: 'Mumbai' },
  { id: '4', name: 'Delhi', city: 'Delhi' },
  { id: '5', name: 'Bangalore', city: 'Bangalore' },
];

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Welcome Offer',
    discount: '50% off',
    description: 'on 1st booking',
    code: 'MYHO50',
    backgroundColor: '#B8860B',
    textColor: '#FFFFFF',
  },
  {
    id: '2',
    title: 'Additional 10% off',
    discount: 'Additional 10% off',
    description: 'on 1st payment',
    code: 'WELCOME',
    backgroundColor: '#F5F5F5',
    textColor: '#B8860B',
  },
];

export const mockServiceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Desk',
    icon: 'desktop-outline',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
  },
  {
    id: '2',
    name: 'Meeting Room',
    icon: 'people-outline',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
  },
];

export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'awfis - Kirsh Cubical',
    location: 'Thaltej, Ahmedabad',
    distance: '7.26 kms away',
    hours: '09:00 am - 06:00 pm (Mon)',
    price: 300,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    isPopular: true,
    rating: 4.5,
    seatingTypes: [
      { type: 'Open Desk', available: true },
    ],
  },
  {
    id: '2',
    name: 'Oyo Workflo - Mayuransh Elanza',
    location: 'Satellite, Ahmedabad',
    distance: '4.33 kms away',
    hours: '09:00 am - 09:00 pm (Mon)',
    price: 350,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600',
    isPopular: true,
    rating: 4.3,
    seatingTypes: [
      { type: 'Open Desk', available: true },
    ],
  },
  {
    id: '3',
    name: 'Karyalay Coworking Space',
    location: 'Prahlad Nagar, Ahmedabad',
    distance: '5.2 kms away',
    hours: '24/7 Access',
    price: 400,
    currency: '₹',
    period: '/day',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
    isPopular: true,
    rating: 4.7,
    seatingTypes: [
      { type: 'Private Desk', available: true },
      { type: 'Meeting Room', available: false },
    ],
  },
];
