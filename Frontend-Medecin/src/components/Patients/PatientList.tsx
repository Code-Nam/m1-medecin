import React from 'react';
import { Search, Plus, Phone, Mail, ChevronLeft, ChevronRight, Eye, UserMinus } from 'lucide-react';
import { usePatientStore } from '../../stores/patientStore';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { formatPhoneDisplay } from '../../utils/validation';

export const PatientList: React.FC = () => {
  const { doctor } = useAuthStore();
  const {
    searchTerm,
    setSearchTerm,
    getPaginatedPatients,
    getTotalPages,
    currentPage,
    setCurrentPage,
    selectPatient,
    updatePatient
  } = usePatientStore();
  const { openModal, addToast } = useUIStore();
  const { darkMode, colors } = useTheme();

  const patients = getPaginatedPatients();
  const totalPages = getTotalPages();

  const handleViewDetail = (patient: any) => {
    selectPatient(patient);
    openModal('patientDetail', patient);
  };

  const handleRemoveFromDoctor = (patient: any) => {
    updatePatient(patient.patientId, { assigned_doctor: '' });
    addToast('success', `${patient.FirstName} ${patient.Surname} retiré de vos patients`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            aria-label="Rechercher un patient par nom ou prénom"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => openModal('createPatient')}
          aria-label="Créer un nouveau patient"
        >
          Nouveau patient
        </Button>
      </div>

      {/* Table */}
      <div 
        className="rounded-xl shadow-sm border overflow-hidden"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Liste des patients">
            <thead>
              <tr 
                className="border-b"
                style={{
                  backgroundColor: darkMode ? '#111827' : '#F9FAFB',
                  borderColor: colors.border.default
                }}
              >
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.muted }}>
                  Patient
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: colors.text.muted }}>
                  Téléphone
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: colors.text.muted }}>
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.muted }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderColor: colors.border.default }}>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center" style={{ color: colors.text.muted }}>
                    Aucun patient trouvé
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.patientId}
                    className="transition-colors"
                    style={{ borderColor: colors.border.default }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'rgba(31, 41, 55, 0.5)' : '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ 
                            background: darkMode 
                              ? 'linear-gradient(to bottom right, #4DB6AC, #26A69A)' 
                              : 'linear-gradient(to bottom right, #43A78B, #2E7D6B)' 
                          }}
                        >
                          {patient.FirstName[0]}{patient.Surname[0]}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: colors.text.primary }}>
                            {patient.FirstName} {patient.Surname}
                          </p>
                          <p className="text-sm sm:hidden" style={{ color: colors.text.muted }}>
                            {formatPhoneDisplay(patient.phone)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                        <Phone className="w-4 h-4" style={{ color: colors.text.muted }} />
                        <span className="font-mono">{formatPhoneDisplay(patient.phone)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                        <Mail className="w-4 h-4" style={{ color: colors.text.muted }} />
                        <span>{patient.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(patient)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: colors.text.muted }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          aria-label={`Voir les détails de ${patient.FirstName} ${patient.Surname}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromDoctor(patient)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: colors.text.muted }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.text.muted;
                          }}
                          aria-label={`Retirer ${patient.FirstName} ${patient.Surname} de vos patients`}
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div 
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: colors.border.default }}
          >
            <p className="text-sm" style={{ color: colors.text.muted }}>
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                aria-label="Page précédente"
              >
                Précédent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                aria-label="Page suivante"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;

