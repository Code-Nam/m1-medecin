import React, { useState } from 'react';
import { Patient, PatientUpdatePayload } from '../../types';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';
import { isValidEmail, isValidPhone } from '../../utils/validation';

interface ProfilFormProps {
    patient: Patient;
    onSave: (data: PatientUpdatePayload) => Promise<void>;
    onCancel: () => void;
}

export const ProfilForm: React.FC<ProfilFormProps> = ({ patient, onSave, onCancel }) => {
    const { colors } = useTheme();
    const [formData, setFormData] = useState({
        firstName: patient.firstName,
        surname: patient.surname,
        phone: patient.phone,
        address: patient.address,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseStyle: React.CSSProperties = {
        backgroundColor: colors.bg.card,
        color: colors.text.primary,
        borderColor: colors.border.default
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="shadow sm:rounded-lg p-6 space-y-6"
            style={{ backgroundColor: colors.bg.card }}
        >
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label 
                        htmlFor="firstName" 
                        className="block text-sm font-medium"
                        style={{ color: colors.text.primary }}
                    >
                        Prénom
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm rounded-md p-2 border"
                            style={{
                                ...inputBaseStyle,
                                borderColor: errors.firstName ? colors.semantic.danger : colors.border.default
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.firstName ? colors.semantic.danger : colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
                        />
                        {errors.firstName && (
                            <p 
                                className="mt-2 text-sm"
                                style={{ color: colors.semantic.danger }}
                            >
                                {errors.firstName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label 
                        htmlFor="surname" 
                        className="block text-sm font-medium"
                        style={{ color: colors.text.primary }}
                    >
                        Nom
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="surname"
                            id="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm rounded-md p-2 border"
                            style={{
                                ...inputBaseStyle,
                                borderColor: errors.surname ? colors.semantic.danger : colors.border.default
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.surname ? colors.semantic.danger : colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
                        />
                        {errors.surname && (
                            <p 
                                className="mt-2 text-sm"
                                style={{ color: colors.semantic.danger }}
                            >
                                {errors.surname}
                            </p>
                        )}
                    </div>
                </div>

                <div className="sm:col-span-4">
                    <label 
                        htmlFor="phone" 
                        className="block text-sm font-medium"
                        style={{ color: colors.text.primary }}
                    >
                        Téléphone
                    </label>
                    <div className="mt-1">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm rounded-md p-2 border"
                            style={{
                                ...inputBaseStyle,
                                borderColor: errors.phone ? colors.semantic.danger : colors.border.default
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.phone ? colors.semantic.danger : colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
                        />
                        {errors.phone && (
                            <p 
                                className="mt-2 text-sm"
                                style={{ color: colors.semantic.danger }}
                            >
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label 
                        htmlFor="address" 
                        className="block text-sm font-medium"
                        style={{ color: colors.text.primary }}
                    >
                        Adresse
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm rounded-md p-2 border"
                            style={{
                                ...inputBaseStyle,
                                borderColor: errors.address ? colors.semantic.danger : colors.border.default
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = colors.accent.primary;
                                e.currentTarget.style.outline = `2px solid ${colors.accent.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.address ? colors.semantic.danger : colors.border.default;
                                e.currentTarget.style.outline = 'none';
                            }}
                        />
                        {errors.address && (
                            <p 
                                className="mt-2 text-sm"
                                style={{ color: colors.semantic.danger }}
                            >
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div 
                className="flex justify-end gap-3 pt-5 border-t"
                style={{ borderColor: colors.border.default }}
            >
                <Button variant="secondary" onClick={onCancel} type="button" disabled={isLoading}>
                    Annuler
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    Enregistrer
                </Button>
            </div>
        </form>
    );
};
