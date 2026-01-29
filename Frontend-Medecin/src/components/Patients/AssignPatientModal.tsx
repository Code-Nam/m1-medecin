import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { usePatientStore } from '../../stores/patientStore';
import { useDoctor } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../hooks/useTheme';
import Button from '../Common/Button';
import Input from '../Common/Input';

export const AssignPatientModal: React.FC = () => {
    const doctor = useDoctor();
    const {
        allPatients,
        fetchAllPatients,
        assignPatientToDoctor,
        getUnassignedPatients,
        isLoading
    } = usePatientStore();
    const { activeModal, closeModal, addToast } = useUIStore();
    const { darkMode, colors } = useTheme();

    const [searchTerm, setSearchTerm] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const isOpen = activeModal === 'assignPatient';

    useEffect(() => {
        if (isOpen) {
            fetchAllPatients();
        }
    }, [isOpen, fetchAllPatients]);

    if (!isOpen || !doctor) return null;

    const unassignedPatients = getUnassignedPatients(doctor.id);

    const filteredPatients = unassignedPatients.filter(p => {
        const term = searchTerm.toLowerCase();
        return (
            p.FirstName.toLowerCase().includes(term) ||
            p.Surname.toLowerCase().includes(term) ||
            p.email.toLowerCase().includes(term)
        );
    });

    const handleAssign = async (patientId: string, patientName: string) => {
        setIsAssigning(true);
        try {
            await assignPatientToDoctor(patientId, doctor.id);
            addToast('success', `${patientName} ajouté à votre liste de patients`);
        } catch (error: any) {
            addToast('error', error.message || 'Erreur lors de l\'assignation du patient');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleClose = () => {
        setSearchTerm('');
        closeModal();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-patient-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg rounded-xl shadow-2xl border"
                style={{
                    backgroundColor: colors.bg.card,
                    borderColor: colors.border.default
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-4 border-b"
                    style={{ borderColor: colors.border.default }}
                >
                    <h2
                        id="assign-patient-title"
                        className="text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                    >
                        Ajouter un patient existant
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
                        style={{
                            color: colors.text.muted,
                            '--tw-ring-color': colors.accent.primary
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? colors.bg.secondary : '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Search */}
                    <Input
                        type="search"
                        placeholder="Rechercher un patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                        aria-label="Rechercher un patient"
                    />

                    {/* Patient list */}
                    <div
                        className="max-h-64 overflow-y-auto rounded-lg border"
                        style={{ borderColor: colors.border.default }}
                    >
                        {isLoading ? (
                            <div className="p-4 text-center" style={{ color: colors.text.muted }}>
                                Chargement des patients...
                            </div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="p-4 text-center" style={{ color: colors.text.muted }}>
                                {searchTerm
                                    ? `Aucun patient trouvé pour "${searchTerm}"`
                                    : 'Aucun patient disponible à assigner'}
                            </div>
                        ) : (
                            <ul className="divide-y" style={{ borderColor: colors.border.default }}>
                                {filteredPatients.map((patient) => (
                                    <li
                                        key={patient.patientId}
                                        className="flex items-center justify-between p-3 transition-colors"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(31, 41, 55, 0.5)' : '#F9FAFB';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
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
                                                <p className="text-sm" style={{ color: colors.text.muted }}>
                                                    {patient.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<UserPlus className="w-4 h-4" />}
                                            onClick={() => handleAssign(patient.patientId, `${patient.FirstName} ${patient.Surname}`)}
                                            isLoading={isAssigning}
                                            aria-label={`Ajouter ${patient.FirstName} ${patient.Surname}`}
                                        >
                                            Ajouter
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex justify-end p-4 border-t"
                    style={{ borderColor: colors.border.default }}
                >
                    <Button variant="ghost" onClick={handleClose}>
                        Fermer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssignPatientModal;
