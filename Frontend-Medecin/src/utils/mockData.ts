// Mock Data pour l'interface médecin

export interface Doctor {
  doctorId: string;
  Surname: string;
  FirstName: string;
  specialization: string;
  email: string;
  phone: string;
}

export interface Patient {
  patientId: string;
  Surname: string;
  FirstName: string;
  email: string;
  phone: string;
  assigned_doctor: string;
}

export interface Appointment {
  appointmentId: string;
  appointedPatient: string;
  appointedDoctor: string;
  date: string; // format dd-MM-yyyy
  time: string; // format HH:MM
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'doctor_created';
  createdBy: 'patient' | 'doctor';
}

export const mockDoctors: Doctor[] = [
  {
    doctorId: "doc_001",
    Surname: "Martin",
    FirstName: "Catherine",
    specialization: "Médecine Générale",
    email: "catherine.martin@mail.fr",
    phone: "0612345678"
  }
];

export const mockPatients: Patient[] = [
  {
    patientId: "pat_001",
    Surname: "Dupont",
    FirstName: "Jean",
    email: "jean.dupont@mail.fr",
    phone: "0698765432",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_002",
    Surname: "Bernard",
    FirstName: "Marie",
    email: "marie.bernard@mail.fr",
    phone: "0687654321",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_003",
    Surname: "Petit",
    FirstName: "Pierre",
    email: "pierre.petit@mail.fr",
    phone: "0676543210",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_004",
    Surname: "Durand",
    FirstName: "Sophie",
    email: "sophie.durand@mail.fr",
    phone: "0665432109",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_005",
    Surname: "Leroy",
    FirstName: "Lucas",
    email: "lucas.leroy@mail.fr",
    phone: "0654321098",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_006",
    Surname: "Moreau",
    FirstName: "Camille",
    email: "camille.moreau@mail.fr",
    phone: "0643210987",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_007",
    Surname: "Simon",
    FirstName: "Emma",
    email: "emma.simon@mail.fr",
    phone: "0632109876",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_008",
    Surname: "Laurent",
    FirstName: "Hugo",
    email: "hugo.laurent@mail.fr",
    phone: "0621098765",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_009",
    Surname: "Garcia",
    FirstName: "Léa",
    email: "lea.garcia@mail.fr",
    phone: "0610987654",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_010",
    Surname: "Martinez",
    FirstName: "Thomas",
    email: "thomas.martinez@mail.fr",
    phone: "0609876543",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_011",
    Surname: "Roux",
    FirstName: "Chloé",
    email: "chloe.roux@mail.fr",
    phone: "0698765401",
    assigned_doctor: "doc_001"
  },
  {
    patientId: "pat_012",
    Surname: "Fournier",
    FirstName: "Nathan",
    email: "nathan.fournier@mail.fr",
    phone: "0687654302",
    assigned_doctor: "doc_001"
  }
];

// Générer des dates pour les rendez-vous
const today = new Date();
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const mockAppointments: Appointment[] = [
  // Aujourd'hui
  {
    appointmentId: "appt_001",
    appointedPatient: "pat_001",
    appointedDoctor: "doc_001",
    date: formatDate(today),
    time: "09:00",
    reason: "Consultation générale",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_002",
    appointedPatient: "pat_002",
    appointedDoctor: "doc_001",
    date: formatDate(today),
    time: "10:30",
    reason: "Suivi tension artérielle",
    status: "confirmed",
    createdBy: "doctor"
  },
  {
    appointmentId: "appt_003",
    appointedPatient: "pat_003",
    appointedDoctor: "doc_001",
    date: formatDate(today),
    time: "14:00",
    reason: "Renouvellement ordonnance",
    status: "pending",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_004",
    appointedPatient: "pat_004",
    appointedDoctor: "doc_001",
    date: formatDate(today),
    time: "15:30",
    reason: "Consultation dermatologique",
    status: "doctor_created",
    createdBy: "doctor"
  },
  // Demain
  {
    appointmentId: "appt_005",
    appointedPatient: "pat_005",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 1)),
    time: "08:30",
    reason: "Bilan annuel",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_006",
    appointedPatient: "pat_006",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 1)),
    time: "11:00",
    reason: "Vaccination grippe",
    status: "confirmed",
    createdBy: "doctor"
  },
  {
    appointmentId: "appt_007",
    appointedPatient: "pat_007",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 1)),
    time: "14:30",
    reason: "Consultation générale",
    status: "pending",
    createdBy: "patient"
  },
  // Après-demain
  {
    appointmentId: "appt_008",
    appointedPatient: "pat_008",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 2)),
    time: "09:30",
    reason: "Suivi diabète",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_009",
    appointedPatient: "pat_009",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 2)),
    time: "16:00",
    reason: "Consultation générale",
    status: "doctor_created",
    createdBy: "doctor"
  },
  // J+3
  {
    appointmentId: "appt_010",
    appointedPatient: "pat_010",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 3)),
    time: "10:00",
    reason: "Résultats analyses",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_011",
    appointedPatient: "pat_011",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 3)),
    time: "15:00",
    reason: "Suivi grossesse",
    status: "confirmed",
    createdBy: "patient"
  },
  // J+4
  {
    appointmentId: "appt_012",
    appointedPatient: "pat_012",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 4)),
    time: "08:00",
    reason: "Bilan sanguin",
    status: "pending",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_013",
    appointedPatient: "pat_001",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 4)),
    time: "11:30",
    reason: "Consultation générale",
    status: "confirmed",
    createdBy: "doctor"
  },
  // J+5
  {
    appointmentId: "appt_014",
    appointedPatient: "pat_002",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 5)),
    time: "09:00",
    reason: "Suivi tension",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_015",
    appointedPatient: "pat_003",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, 5)),
    time: "14:00",
    reason: "Renouvellement ordonnance",
    status: "doctor_created",
    createdBy: "doctor"
  },
  // J-1 (hier)
  {
    appointmentId: "appt_016",
    appointedPatient: "pat_004",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -1)),
    time: "10:00",
    reason: "Consultation générale",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_017",
    appointedPatient: "pat_005",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -1)),
    time: "15:00",
    reason: "Vaccination",
    status: "cancelled",
    createdBy: "patient"
  },
  // J-2
  {
    appointmentId: "appt_018",
    appointedPatient: "pat_006",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -2)),
    time: "09:30",
    reason: "Bilan annuel",
    status: "confirmed",
    createdBy: "doctor"
  },
  {
    appointmentId: "appt_019",
    appointedPatient: "pat_007",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -2)),
    time: "14:30",
    reason: "Consultation générale",
    status: "confirmed",
    createdBy: "patient"
  },
  // J-3
  {
    appointmentId: "appt_020",
    appointedPatient: "pat_008",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -3)),
    time: "11:00",
    reason: "Suivi diabète",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_021",
    appointedPatient: "pat_009",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -3)),
    time: "16:30",
    reason: "Résultats analyses",
    status: "cancelled",
    createdBy: "patient"
  },
  // J-4
  {
    appointmentId: "appt_022",
    appointedPatient: "pat_010",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -4)),
    time: "08:30",
    reason: "Consultation générale",
    status: "confirmed",
    createdBy: "doctor"
  },
  {
    appointmentId: "appt_023",
    appointedPatient: "pat_011",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -4)),
    time: "10:30",
    reason: "Suivi grossesse",
    status: "confirmed",
    createdBy: "patient"
  },
  // J-5
  {
    appointmentId: "appt_024",
    appointedPatient: "pat_012",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -5)),
    time: "09:00",
    reason: "Bilan sanguin",
    status: "confirmed",
    createdBy: "patient"
  },
  {
    appointmentId: "appt_025",
    appointedPatient: "pat_001",
    appointedDoctor: "doc_001",
    date: formatDate(addDays(today, -5)),
    time: "14:00",
    reason: "Consultation générale",
    status: "cancelled",
    createdBy: "patient"
  }
];

// Helper pour obtenir le nom complet d'un patient
export const getPatientName = (patientId: string): string => {
  const patient = mockPatients.find(p => p.patientId === patientId);
  return patient ? `${patient.FirstName} ${patient.Surname}` : 'Patient inconnu';
};

// Helper pour obtenir les infos d'un patient
export const getPatient = (patientId: string): Patient | undefined => {
  return mockPatients.find(p => p.patientId === patientId);
};

