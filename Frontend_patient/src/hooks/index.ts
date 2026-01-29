import { useAppointmentStore } from '../store/appointmentStore';
import { usePatientStore } from '../store/patientStore';
import { useDoctorStore } from '../store/doctorStore';


export const useAppointments = useAppointmentStore;
export const usePatient = usePatientStore;
export const useDoctors = useDoctorStore;
export { useTheme } from './useTheme';
