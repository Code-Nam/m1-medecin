import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { usePatientStore } from '../../stores/patientStore';
import Modal from '../Common/Modal';
import PatientForm from './PatientForm';
import PatientDetail from './PatientDetail';

export const PatientModal: React.FC = () => {
  const { activeModal, modalData, closeModal } = useUIStore();
  const { selectedPatient } = usePatientStore();

  return (
    <>
      {/* Create Patient Modal */}
      <Modal
        isOpen={activeModal === 'createPatient'}
        onClose={closeModal}
        title="Nouveau patient"
        size="md"
      >
        <PatientForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={activeModal === 'editPatient'}
        onClose={closeModal}
        title="Modifier le patient"
        size="md"
      >
        <PatientForm
          patient={modalData || selectedPatient}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={activeModal === 'patientDetail'}
        onClose={closeModal}
        title="Détails du patient"
        size="lg"
      >
        <PatientDetail
          patient={modalData || selectedPatient}
          onClose={closeModal}
        />
      </Modal>
    </>
  );
};

export default PatientModal;

