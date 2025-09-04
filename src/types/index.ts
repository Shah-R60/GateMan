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
  images?: string[]; // Array of images for carousel
  isPopular?: boolean;
  rating?: number;
  amenities?: string[];
  seatingTypes?: SeatingType[];
}

// API Property interface matching the backend structure
export interface Property {
  _id: string;
  ownerId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  name: string;
  description: string;
  propertyImages: string[];
  landmark: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  googleMapLink: string;
  totalArea: number;
  type: string;
  floorSize: number;
  totalFloor: number;
  cost: number;
  amenities: string[];
  isSaturdayOpened: boolean;
  isSundayOpened: boolean;
  seatingCapacity: number;
  totalCostPerSeat: number;
  isPriceNegotiable: boolean;
  unavailableDates: string[];
  furnishingLevel: string;
  propertyStatus: string;
  verificationStatus: string;
  bookingRules?: {
    minBookingHours: number;
    maxBookingHours: number;
    bufferHours: number;
    allowedTimeSlots: {
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[];
    checkoutGracePeriod: number;
  };
  pricing?: {
    hourlyRate: number;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    cleaningFee: number;
    overtimeHourlyRate: number;
  };
  location?: {
    nearestMetroStation: string;
    distanceFromMetro: number;
    nearestBusStop: string;
    distanceFromBusStop: number;
    nearestRailwayStation: string;
    distanceFromRailway: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyApiResponse {
  success: boolean;
  message: string;
  allProperties: Property[];
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
