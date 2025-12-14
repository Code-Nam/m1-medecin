import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    surname: string;
    role: 'DOCTOR' | 'SECRETARY';
    doctorId?: string;
    secretaryId?: string;
    clinicId?: string;
    clinics?: Array<{ id: string; clinicId: string; name: string }>;
  };
}

export const authService = {
  loginDoctor: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/doctors/login', credentials);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
  },

  loginSecretary: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/secretaries/login', credentials);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
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

