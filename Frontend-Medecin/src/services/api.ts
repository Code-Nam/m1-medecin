// Service API - Configuration et méthodes pour appels backend
// Ce fichier est prêt pour l'intégration avec le vrai backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

interface RequestOptions extends RequestInit {
  doctorId?: string;
}

// Instance de base pour les appels API
class APIService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { doctorId, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (doctorId) {
      (headers as Record<string, string>)['doctorId'] = doctorId;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new APIService(API_BASE_URL);

// ===== PATIENTS SERVICE =====
export const patientsService = {
  // Récupérer les patients d'un médecin
  getByDoctor: (doctorId: string, page = 1, pageSize = 10) =>
    api.get(`/patients?doctorId=${doctorId}&page=${page}&pageSize=${pageSize}`),

  // Créer un patient
  create: (patientData: {
    Surname: string;
    FirstName: string;
    email?: string;
    phone?: string;
    assigned_doctor?: string;
  }) => api.post('/patients', patientData),

  // Mettre à jour un patient
  update: (patientId: string, updates: any) =>
    api.put(`/patients/${patientId}`, updates),

  // Assigner un patient à un médecin
  assignToDoctor: (patientId: string, doctorId: string) =>
    api.put(`/patients/${patientId}`, { assigned_doctor: doctorId }),
};

// ===== APPOINTMENTS SERVICE =====
export const appointmentsService = {
  // Récupérer les RDV d'un médecin
  getByDoctor: (doctorId: string, page = 1, pageSize = 30) =>
    api.get(`/appointments/${doctorId}?page=${page}&pageSize=${pageSize}`),

  // Créer un RDV
  create: (appointmentData: {
    appointedPatient: string;
    appointedDoctor: string;
    date: string;
    time: string;
    reason: string;
  }) => api.post('/appointments', appointmentData),

  // Modifier un RDV
  update: (
    appointmentId: string,
    updates: { date?: string; time?: string; reason?: string },
    doctorId: string
  ) => api.put(`/appointments/${appointmentId}`, updates, { doctorId }),

  // Supprimer/Annuler un RDV
  delete: (appointmentId: string, doctorId: string) =>
    api.delete(`/appointments/${appointmentId}`, { doctorId }),
};

// ===== DOCTORS SERVICE =====
export const doctorsService = {
  // Récupérer les infos d'un médecin
  getById: (doctorId: string) => api.get(`/doctors/${doctorId}`),

  // Créer un médecin
  create: (doctorData: {
    Surname: string;
    FirstName: string;
    specialization: string;
    email: string;
    phone: string;
  }) => api.post('/doctors', doctorData),
};

export default api;

