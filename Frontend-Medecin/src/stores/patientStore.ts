import { create } from 'zustand';
import { patientsService } from '../services/api';
import type { Patient } from '../utils/mockData';

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  
  fetchPatients: (doctorId?: string) => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Omit<Patient, 'patientId'>) => Promise<void>;
  updatePatient: (patientId: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (patientId: string) => void;
  selectPatient: (patient: Patient | null) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  getFilteredPatients: () => Patient[];
  getPaginatedPatients: () => Patient[];
  getTotalPages: () => number;
  getPatientsByDoctor: (doctorId: string) => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  isLoading: false,
  error: null,
  selectedPatient: null,
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  
  fetchPatients: async (doctorId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let response;
      if (doctorId) {
        response = await patientsService.getByDoctor(doctorId, 1, 100);
      } else {
        response = await patientsService.getAll(1, 100);
      }
      
      const patients: Patient[] = (response.patients || []).map((p: any) => {
        const patientId = p.id || p.patientId;
        const assignedDoctorId = p.assignedDoctor?.id || p.assignedDoctor?.doctorId || null;
        
        return {
          patientId: patientId,
          Surname: p.surname,
          FirstName: p.firstName,
          email: p.email,
          phone: p.phone || '',
          assigned_doctor: assignedDoctorId ? String(assignedDoctorId) : '',
        };
      });
      
      set({ patients });
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement des patients' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setPatients: (patients) => set({ patients }),
  
  addPatient: async (patientData) => {
    try {
      const { patientsService } = await import('../services/api');
      
      const createData = {
        firstName: patientData.FirstName,
        surname: patientData.Surname,
        email: patientData.email || `${patientData.FirstName.toLowerCase()}.${patientData.Surname.toLowerCase()}@example.com`,
        password: 'password123',
        phone: patientData.phone || undefined,
        assigned_doctor: patientData.assigned_doctor || undefined,
      };
      
      const createdPatient = await patientsService.create(createData);
      
      const newPatient: Patient = {
        patientId: createdPatient.id,
        Surname: createdPatient.surname,
        FirstName: createdPatient.firstName,
        email: createdPatient.email,
        phone: createdPatient.phone || '',
        assigned_doctor: createdPatient.assignedDoctor?.id || patientData.assigned_doctor || '',
      };
      
      set((state) => ({
        patients: [...state.patients, newPatient]
      }));
    } catch (error: any) {
      throw error;
    }
  },
  
  updatePatient: async (patientId, updates) => {
    try {
      const { patientsService } = await import('../services/api');
      const updateData: any = {};
      
      if (updates.FirstName !== undefined) updateData.firstName = updates.FirstName;
      if (updates.Surname !== undefined) updateData.surname = updates.Surname;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.assigned_doctor !== undefined) {
        updateData.assigned_doctor = updates.assigned_doctor || undefined;
      }
      
      const updatedPatient = await patientsService.update(patientId, updateData);
      
      const transformedPatient: Patient = {
        patientId: updatedPatient.id || patientId,
        Surname: updatedPatient.surname || updates.Surname || '',
        FirstName: updatedPatient.firstName || updates.FirstName || '',
        email: updatedPatient.email || updates.email || '',
        phone: updatedPatient.phone || updates.phone || '',
        assigned_doctor: updatedPatient.assignedDoctor?.id || updates.assigned_doctor || '',
      };
      
      set((state) => ({
        patients: state.patients.map(p =>
          p.patientId === patientId ? transformedPatient : p
        )
      }));
    } catch (error: any) {
      throw error;
    }
  },
  
  deletePatient: (patientId) => {
    set((state) => ({
      patients: state.patients.filter(p => p.patientId !== patientId)
    }));
  },
  
  selectPatient: (patient) => set({ selectedPatient: patient }),
  
  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  getFilteredPatients: () => {
    const { patients, searchTerm } = get();
    if (!searchTerm) return patients;
    
    const term = searchTerm.toLowerCase();
    return patients.filter(p =>
      p.FirstName.toLowerCase().includes(term) ||
      p.Surname.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  },
  
  getPaginatedPatients: () => {
    const { currentPage, pageSize } = get();
    const filtered = get().getFilteredPatients();
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  },
  
  getTotalPages: () => {
    const { pageSize } = get();
    const filtered = get().getFilteredPatients();
    return Math.ceil(filtered.length / pageSize);
  },
  
  getPatientsByDoctor: (doctorId) => {
    const { patients } = get();
    return patients.filter(p => p.assigned_doctor === doctorId);
  }
}));

