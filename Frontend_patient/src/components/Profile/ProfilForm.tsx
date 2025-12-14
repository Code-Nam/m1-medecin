import React, { useState } from 'react';
import { Patient, PatientUpdatePayload } from '../../types';
import { Button } from '../Common/Button';
import { isValidEmail, isValidPhone } from '../../utils/validation';

interface ProfilFormProps {
    patient: Patient;
    onSave: (data: PatientUpdatePayload) => Promise<void>;
    onCancel: () => void;
}

export const ProfilForm: React.FC<ProfilFormProps> = ({ patient, onSave, onCancel }) => {
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
        // Clear error when typing
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
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Prénom
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${errors.firstName ? 'border-red-300' : ''}`}
                        />
                        {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                        Nom
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="surname"
                            id="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${errors.surname ? 'border-red-300' : ''}`}
                        />
                        {errors.surname && <p className="mt-2 text-sm text-red-600">{errors.surname}</p>}
                    </div>
                </div>

                <div className="sm:col-span-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Téléphone
                    </label>
                    <div className="mt-1">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${errors.phone ? 'border-red-300' : ''}`}
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Adresse
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border ${errors.address ? 'border-red-300' : ''}`}
                        />
                        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
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
