import React, { useState } from 'react';
import { User, Save, Edit2 } from 'lucide-react';
import { usePatientStore } from '../store/patientStore';
import { useTheme } from '../hooks/useTheme';
import { Input } from '../components/Common/Input';
import { Button } from '../components/Common/Button';
import type { PatientUpdatePayload } from '../types';
import { isValidPhone } from '../utils/validation';

export const Profile = () => {
    const { currentPatient, updatePatient } = usePatientStore();
    const { colors } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: currentPatient?.firstName || '',
        surname: currentPatient?.surname || '',
        phone: currentPatient?.phone || '',
        address: currentPatient?.address || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!currentPatient) return <div>Chargement...</div>;

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!formData.surname.trim()) newErrors.surname = 'Le nom est requis';
        if (!isValidPhone(formData.phone)) newErrors.phone = 'Numéro de téléphone invalide';
        if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await updatePatient(currentPatient.patientId, formData as PatientUpdatePayload);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: currentPatient.firstName,
            surname: currentPatient.surname,
            phone: currentPatient.phone,
            address: currentPatient.address,
        });
        setErrors({});
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                >
                    Mon Profil
                </h1>
                <p 
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                >
                    Gérez vos informations personnelles
                </p>
            </div>

            {/* Profile Section */}
            <section 
                className="rounded-xl shadow-sm border p-6"
                style={{
                    backgroundColor: colors.bg.card,
                    borderColor: colors.border.default
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 
                        className="text-lg font-semibold flex items-center gap-2"
                        style={{ color: colors.text.primary }}
                    >
                        <User className="w-5 h-5" style={{ color: colors.accent.primary }} />
                        Profil
                    </h2>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Edit2 className="w-4 h-4" />}
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nom"
                        value={isEditing ? formData.surname : currentPatient.surname}
                        onChange={isEditing ? (e) => handleChange('surname', e.target.value) : undefined}
                        readOnly={!isEditing}
                        error={errors.surname}
                        aria-label="Nom du patient"
                    />
                    <Input
                        label="Prénom"
                        value={isEditing ? formData.firstName : currentPatient.firstName}
                        onChange={isEditing ? (e) => handleChange('firstName', e.target.value) : undefined}
                        readOnly={!isEditing}
                        error={errors.firstName}
                        aria-label="Prénom du patient"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={currentPatient.email}
                        readOnly
                        aria-label="Email du patient"
                    />
                    <Input
                        label="Téléphone"
                        type="tel"
                        value={isEditing ? formData.phone : currentPatient.phone}
                        onChange={isEditing ? (e) => handleChange('phone', e.target.value) : undefined}
                        readOnly={!isEditing}
                        error={errors.phone}
                        aria-label="Téléphone du patient"
                    />
                    <Input
                        label="Date de naissance"
                        type="date"
                        value={currentPatient.dateOfBirth}
                        readOnly
                        aria-label="Date de naissance du patient"
                    />
                    <Input
                        label="Adresse"
                        value={isEditing ? formData.address : currentPatient.address}
                        onChange={isEditing ? (e) => handleChange('address', e.target.value) : undefined}
                        readOnly={!isEditing}
                        error={errors.address}
                        aria-label="Adresse du patient"
                    />
                </div>
                {isEditing && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.border.default }}>
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<Save className="w-4 h-4" />}
                            onClick={handleSave}
                        >
                            Enregistrer
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};
