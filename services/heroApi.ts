import { Provider, ServiceItem } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:7071/api' : '/api');

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment DEV:', import.meta.env.DEV);

export const HeroApi = {
  // === PROVIDER MANAGEMENT ===
  
  // Get all providers with optional filtering
  getProviders: async (filters?: {
    categoryId?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<Provider[]> => {
    try {
      let url = `${API_BASE_URL}/providers`;
      const params = new URLSearchParams();
      
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.latitude) params.append('latitude', filters.latitude.toString());
      if (filters?.longitude) params.append('longitude', filters.longitude.toString());
      if (filters?.radius) params.append('radius', filters.radius.toString());
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error getting providers:", error);
      return []; // Fallback to empty array
    }
  },

  // Get single provider by ID
  getProvider: async (id: number): Promise<Provider | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API Error getting provider:", error);
      return null;
    }
  },

  // Register new provider
  registerProvider: async (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'services' | 'employees' | 'schedules' | 'reviews'>): Promise<Provider | null> => {
    try {
      console.log('=== REGISTERING PROVIDER ===');
      console.log('URL:', `${API_BASE_URL}/providers`);
      console.log('Data:', providerData);
      
      const response = await fetch(`${API_BASE_URL}/providers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Success result:', result);
      return result;
    } catch (error) {
      console.error("API Error registering provider:", error);
      return null;
    }
  },

  // Update provider
  updateProvider: async (id: number, providerData: Partial<Provider>): Promise<Provider | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error updating provider:", error);
      return null;
    }
  },

  // Delete provider (soft delete)
  deleteProvider: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error("API Error deleting provider:", error);
      return false;
    }
  },

  // === SERVICE MANAGEMENT ===
  
  // Get services for a provider
  getProviderServices: async (providerId: number): Promise<ServiceItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error getting provider services:", error);
      return [];
    }
  },

  // Create new service for provider
  createProviderService: async (providerId: number, serviceData: Omit<ServiceItem, 'id' | 'providerId' | 'createdAt' | 'provider'>): Promise<ServiceItem | null> => {
    try {
      console.log('=== CREATING PROVIDER SERVICE ===');
      console.log('URL:', `${API_BASE_URL}/providers/${providerId}/services`);
      console.log('Service Data:', serviceData);
      
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      console.log('Service Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Service Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Service Success result:', result);
      return result;
    } catch (error) {
      console.error("API Error creating service:", error);
      return null;
    }
  },

  // Update service
  updateProviderService: async (providerId: number, serviceId: number, serviceData: Partial<ServiceItem>): Promise<ServiceItem | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error updating service:", error);
      return null;
    }
  },

  // Delete service
  deleteProviderService: async (providerId: number, serviceId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services/${serviceId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error("API Error deleting service:", error);
      return false;
    }
  },

  // Get services by category
  getServicesByCategory: async (categoryId: string, subcategory?: string): Promise<ServiceItem[]> => {
    try {
      let url = `${API_BASE_URL}/services/category/${categoryId}`;
      if (subcategory) {
        url += `?subcategory=${encodeURIComponent(subcategory)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error getting services by category:", error);
      return [];
    }
  },

  // === CATEGORIES ===
  
  // Get all service categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error getting categories:", error);
      return [];
    }
  },

  // === EMPLOYEE MANAGEMENT ===
  
  // Create new employee for provider
  createProviderEmployee: async (providerId: number, employeeData: {name: string, role: string, phoneNumber?: string, email?: string}): Promise<any | null> => {
    try {
      console.log('=== CREATING PROVIDER EMPLOYEE ===');
      console.log('URL:', `${API_BASE_URL}/providers/${providerId}/employees`);
      console.log('Employee Data:', employeeData);
      
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      console.log('Employee Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Employee Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Employee Success result:', result);
      return result;
    } catch (error) {
      console.error("API Error creating employee:", error);
      return null;
    }
  },

  // === IMAGE UPLOAD (Future Implementation) ===
  
  // Upload image to Azure Blob Storage
  uploadImage: async (providerId: number, file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error("API Error uploading image:", error);
      return null;
    }
  }
};