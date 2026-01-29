import ApiClient from './api.client';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
  'http://localhost:3000/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    patientId: string;
    email: string;
    firstName: string;
    surname: string;
    role: 'PATIENT';
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/patients/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur de connexion' }));
      const errorMessage = errorData.error || errorData.message || `Erreur ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/patients/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur d\'inscription' }));
      const errorMessage = errorData.error || errorData.message || `Erreur ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  storeAuth: (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

