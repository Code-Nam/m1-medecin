const API_BASE_URL = (process.env.BUN_PUBLIC_API_URL) as string;

interface RequestOptions extends RequestInit {
  doctorId?: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
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

    const token = this.getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (doctorId) {
      (headers as Record<string, string>)['doctorId'] = doctorId;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      const errorMessage = errorData.error?.message || errorData.message || (typeof errorData.error === 'string' ? errorData.error : `Erreur ${response.status}`);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new APIService(API_BASE_URL);

export const patientsService = {
  getAll: (page = 1, pageSize = 10) =>
    api.get(`/patients?page=${page}&pageSize=${pageSize}`),

  getByDoctor: (doctorId: string, page = 1, pageSize = 10) =>
    api.get(`/patients?doctorId=${doctorId}&page=${page}&pageSize=${pageSize}`),

  getById: (patientId: string) =>
    api.get(`/patients/${patientId}`),

  create: (patientData: {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    assigned_doctor?: string;
  }) => api.post('/patients', patientData),

  update: (patientId: string, updates: any) =>
    api.put(`/patients/${patientId}`, updates),

  delete: (patientId: string) =>
    api.delete(`/patients/${patientId}`),
};

export const appointmentsService = {
  getAll: (page = 1, pageSize = 30) =>
    api.get(`/appointments?page=${page}&pageSize=${pageSize}`),

  getByDoctor: (doctorId: string, page = 1, pageSize = 30) =>
    api.get(`/appointments?doctorId=${doctorId}&page=${page}&pageSize=${pageSize}`),

  getByPatient: (patientId: string, page = 1, pageSize = 30) =>
    api.get(`/appointments?patientId=${patientId}&page=${page}&pageSize=${pageSize}`),

  getById: (appointmentId: string) =>
    api.get(`/appointments/${appointmentId}`),

  create: (appointmentData: {
    appointedPatientId: string;
    appointedDoctorId: string;
    date: string;
    time: string;
    reason: string;
    notes?: string;
  }) => api.post('/appointments', appointmentData),

  update: (appointmentId: string, updates: {
    date?: string;
    time?: string;
    reason?: string;
    status?: string;
    notes?: string;
  }) => api.put(`/appointments/${appointmentId}`, updates),

  delete: (appointmentId: string) =>
    api.delete(`/appointments/${appointmentId}`),
};

export const doctorsService = {
  getAll: (page = 1, pageSize = 10) =>
    api.get(`/doctors?page=${page}&pageSize=${pageSize}`),

  getAllWithoutPagination: () =>
    api.get(`/doctors/all`),

  getById: (doctorId: string) =>
    api.get(`/doctors/${doctorId}`),

  create: (doctorData: {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    title?: string;
    specialization: string;
    openingTime?: string;
    closingTime?: string;
    slotDuration?: number;
  }) => api.post('/doctors', doctorData),

  update: (doctorId: string, updates: any) =>
    api.put(`/doctors/${doctorId}`, updates),

  delete: (doctorId: string) =>
    api.delete(`/doctors/${doctorId}`),
};

export const availabilityService = {
  getAvailableSlots: (doctorId: string, date: string) =>
    api.get(`/availability/${doctorId}/slots?date=${date}`),

  generateSlots: (doctorId: string, startDate: string, endDate: string) =>
    api.post(`/availability/${doctorId}/generate`, { startDate, endDate }),

  cleanupPastSlots: () =>
    api.post('/availability/cleanup', {}),
};

export const secretariesService = {
  getAll: (page = 1, pageSize = 10) =>
    api.get(`/secretaries?page=${page}&pageSize=${pageSize}`),

  getByDoctor: (doctorId: string, page = 1, pageSize = 10) =>
    api.get(`/secretaries?doctorId=${doctorId}&page=${page}&pageSize=${pageSize}`),

  getById: (secretaryId: string) =>
    api.get(`/secretaries/${secretaryId}`),

  create: (secretaryData: {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    doctorIds?: string[];
  }) => api.post('/secretaries', secretaryData),

  update: (secretaryId: string, updates: any) =>
    api.put(`/secretaries/${secretaryId}`, updates),

  delete: (secretaryId: string) =>
    api.delete(`/secretaries/${secretaryId}`),
};

export default api;

