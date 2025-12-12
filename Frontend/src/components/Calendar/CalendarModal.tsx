import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import Modal from '../Common/Modal';
import AppointmentForm from '../Appointments/AppointmentForm';
import AppointmentDeleteConfirm from '../Appointments/AppointmentDeleteConfirm';

export const CalendarModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useUIStore();

  return (
    <>
      {/* Create Appointment Modal */}
      <Modal
        isOpen={activeModal === 'createAppointment'}
        onClose={closeModal}
        title="Nouveau rendez-vous"
        size="lg"
      >
        <AppointmentForm
          initialDate={modalData?.date}
          initialTime={modalData?.time}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={activeModal === 'editAppointment'}
        onClose={closeModal}
        title="Modifier le rendez-vous"
        size="lg"
      >
        <AppointmentForm
          appointment={modalData}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Appointment Modal */}
      <Modal
        isOpen={activeModal === 'deleteAppointment'}
        onClose={closeModal}
        title="Annuler le rendez-vous"
        size="md"
      >
        <AppointmentDeleteConfirm
          appointment={modalData}
          onConfirm={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
};

export default CalendarModal;

