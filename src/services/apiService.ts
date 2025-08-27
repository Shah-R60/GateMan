import { Location, Workspace, Offer, PropertyApiResponse, Property } from '../types';

/**
 * API service class for handling all API calls
 * This is set up to easily transition from mock data to real API calls
 */

class ApiService {
  private baseUrl: string = 'https://api.expogateman.com'; // Replace with actual API URL
  private apiKey: string = process.env.EXPO_PUBLIC_API_KEY || '';

  // Generic HTTP request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Locations API
  async getLocations(): Promise<Location[]> {
    // For now, return mock data
    // In production, this would be: return this.request<Location[]>('/locations');
    const { mockLocations } = await import('../data/mockData');
    return mockLocations;
  }

  // Workspaces API
  async getWorkspaces(locationId?: string, searchQuery?: string): Promise<Workspace[]> {
    // For now, return mock data
    // In production: return this.request<Workspace[]>(`/workspaces?location=${locationId}&search=${searchQuery}`);
    const { mockWorkspaces } = await import('../data/mockData');
    
    let filteredWorkspaces = mockWorkspaces;
    
    if (searchQuery) {
      filteredWorkspaces = filteredWorkspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredWorkspaces;
  }

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    // For now, return mock data
    // In production: return this.request<Workspace>(`/workspaces/${id}`);
    const { mockWorkspaces } = await import('../data/mockData');
    return mockWorkspaces.find(workspace => workspace.id === id) || null;
  }

  // Offers API
  async getOffers(): Promise<Offer[]> {
    // For now, return mock data
    // In production: return this.request<Offer[]>('/offers');
    const { mockOffers } = await import('../data/mockData');
    return mockOffers;
  }

  // Booking API
  async createBooking(workspaceId: string, date: string, duration: number): Promise<any> {
    // In production, this would make an actual API call
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        workspaceId,
        date,
        duration,
      }),
    });
  }

  async getUserBookings(): Promise<any[]> {
    // For now, return empty array
    // In production: return this.request<any[]>('/bookings/user');
    return [];
  }

  // Properties API
  async getProperties(): Promise<PropertyApiResponse> {
    try {
      const response = await fetch('http://192.168.137.1:3004/api/v1/properties/public');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw error;
    }
  }

  async getPropertyById(propertyId: string): Promise<Property> {
    try {
      const response = await fetch(`http://192.168.137.1:3004/api/v1/properties/${propertyId}`);
      // console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      return data.data; // The property data is directly in data, not data.property
    } catch (error) {
      console.error('Failed to fetch property by ID:', error);
      throw error;
    }
  }

  // User profile API
  async getUserProfile(): Promise<any> {
    // For now, return mock user
    // In production: return this.request<any>('/user/profile');
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
    };
  }

  async updateUserProfile(profile: any): Promise<any> {
    // In production, this would make an actual API call
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }
}

export const apiService = new ApiService();
