import { Provider, ServiceItem } from '../types';

// La URL base de tus Azure Functions (local o nube)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export const HeroApi = {
  // Obtener proveedores desde el backend real
  getProviders: async (): Promise<Provider[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`);
      if (!response.ok) throw new Error('Error fetching providers');
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      // Fallback a mock data si el backend no está corriendo
      return []; 
    }
  },

  // Crear una nueva solicitud de proveedor (Partners)
  registerProvider: async (providerData: Partial<Provider>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      return response.ok;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  },

  // Subir imagen a Azure Blob Storage a través de la Function
  uploadImage: async (providerId: string, file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/image`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // Asumiendo que la function devuelve la URL del blob
        const data = await response.json();
        return data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  }
};
