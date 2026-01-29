import React from 'react';
import { Search, Plus, Phone, Mail, ChevronLeft, ChevronRight, Eye, UserMinus, UserPlus } from 'lucide-react';
import { usePatientStore } from '../../stores/patientStore';
import { useDoctor } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { formatPhoneDisplay } from '../../utils/validation';

export const PatientList: React.FC = () => {
  const doctor = useDoctor();
  const {
    patients: allPatients,
    searchTerm,
    setSearchTerm,
    getPaginatedPatients,
    getTotalPages,
    currentPage,
    setCurrentPage,
    selectPatient,
    updatePatient,
    isLoading,
    error
  } = usePatientStore();
  const { openModal, addToast } = useUIStore();
  const { darkMode, colors } = useTheme();

  const patients = getPaginatedPatients();
  const totalPages = getTotalPages();

  const handleViewDetail = (patient: any) => {
    selectPatient(patient);
    openModal('patientDetail', patient);
  };

  const handleRemoveFromDoctor = async (patient: any) => {
    try {
      await updatePatient(patient.patientId, { assigned_doctor: '' });
      addToast('success', `${patient.FirstName} ${patient.Surname} retiré de vos patients`);
    } catch (error: any) {
      addToast('error', error.message || 'Erreur lors de la suppression du patient');
    }
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => openModal('assignPatient')}
            aria-label="Ajouter un patient existant"
          >
            Patient existant
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => openModal('createPatient')}
            aria-label="Créer un nouveau patient"
          >
            Nouveau patient
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl shadow-sm border overflow-hidden"
        style={{
          backgroundColor: colors.bg.card,
          borderColor: colors.border.default
        }}
        role="region"
        aria-label="Tableau des patients"
      >
        <div className="overflow-x-auto">
          <table className="w-full" aria-label={`Liste de ${patients.length} patient${patients.length > 1 ? 's' : ''}`}>
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: colors.bg.secondary,
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
                  Adresse électronique
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.muted }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ borderColor: colors.border.default }}>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center" style={{ color: colors.text.muted }}>
                    Chargement des patients...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center" style={{ color: '#ef4444' }}>
                    Erreur: {error}
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center" style={{ color: colors.text.muted }} role="status">
                    {searchTerm ? `Aucun patient trouvé pour la recherche "${searchTerm}"` : 'Aucun patient enregistré'}
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
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
                    aria-label={`Patient ${index + 1} sur ${patients.length} : ${patient.FirstName} ${patient.Surname}`}
                  >
                    <th scope="row" className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{
                            background: darkMode
                              ? 'linear-gradient(to bottom right, #4DB6AC, #26A69A)'
                              : 'linear-gradient(to bottom right, #43A78B, #2E7D6B)'
                          }}
                          aria-hidden="true"
                        >
                          {patient.FirstName[0]}{patient.Surname[0]}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: colors.text.primary }}>
                            {patient.FirstName} {patient.Surname}
                          </p>
                          <p className="text-sm sm:hidden" style={{ color: colors.text.muted }}>
                            <span className="sr-only">Téléphone : </span>
                            {formatPhoneDisplay(patient.phone)}
                          </p>
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                        <Phone className="w-4 h-4" style={{ color: colors.text.muted }} aria-hidden="true" />
                        <span className="font-mono">
                          <span className="sr-only">Téléphone : </span>
                          {formatPhoneDisplay(patient.phone)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                        <Mail className="w-4 h-4" style={{ color: colors.text.muted }} aria-hidden="true" />
                        <span>
                          <span className="sr-only">Adresse électronique : </span>
                          {patient.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1" role="group" aria-label="Actions pour ce patient">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(patient)}
                          className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{
                            color: colors.text.muted,
                            '--tw-ring-color': colors.accent.primary
                          } as React.CSSProperties}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? colors.bg.card : '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          aria-label={`Voir les détails de ${patient.FirstName} ${patient.Surname}`}
                        >
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromDoctor(patient)}
                          className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{
                            color: colors.text.muted,
                            '--tw-ring-color': colors.semantic.danger
                          } as React.CSSProperties}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.text.muted;
                          }}
                          aria-label={`Retirer ${patient.FirstName} ${patient.Surname} de votre liste de patients`}
                        >
                          <UserMinus className="w-4 h-4" aria-hidden="true" />
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
          <nav
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: colors.border.default }}
            aria-label="Navigation de pagination"
          >
            <p className="text-sm" style={{ color: colors.text.muted }} role="status" aria-live="polite">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex gap-2" role="group" aria-label="Contrôles de pagination">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                aria-label={`Aller à la page précédente, page ${currentPage - 1}`}
              >
                Précédent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                aria-label={`Aller à la page suivante, page ${currentPage + 1}`}
              >
                Suivant
              </Button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default PatientList;

