import { create } from 'zustand';
import { mockPatients, type Patient } from '../utils/mockData';

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  
  // Actions
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Omit<Patient, 'patientId'>) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;
  selectPatient: (patient: Patient | null) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  
  // Getters
  getFilteredPatients: () => Patient[];
  getPaginatedPatients: () => Patient[];
  getTotalPages: () => number;
  getPatientsByDoctor: (doctorId: string) => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: mockPatients,
  selectedPatient: null,
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  
  setPatients: (patients) => set({ patients }),
  
  addPatient: (patientData) => {
    const newPatient: Patient = {
      ...patientData,
      patientId: `pat_${Date.now()}`
    };
    set((state) => ({
      patients: [...state.patients, newPatient]
    }));
  },
  
  updatePatient: (patientId, updates) => {
    set((state) => ({
      patients: state.patients.map(p =>
        p.patientId === patientId ? { ...p, ...updates } : p
      )
    }));
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

