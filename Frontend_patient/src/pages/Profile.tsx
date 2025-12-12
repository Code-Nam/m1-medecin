import React, { useState } from 'react';
import { usePatientStore } from '../store/patientStore';
import { ProfilCard, ProfilForm } from '../components/Profile';
import type { PatientUpdatePayload } from '../types';
import { Sidebar } from '../components/Layout';

export const Profile = () => {
    const { currentPatient, updatePatient } = usePatientStore();
    const [isEditing, setIsEditing] = useState(false);

    if (!currentPatient) return <div>Chargement...</div>;

    const handleUpdate = async (data: PatientUpdatePayload) => {
        try {
            await updatePatient(currentPatient.patientId, data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                        <p className="text-gray-500">Mettez à jour vos informations personnelles.</p>
                    </header>

                    <div className="space-y-6">
                        {isEditing ? (
                            <ProfilForm
                                patient={currentPatient}
                                onSave={handleUpdate}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <ProfilCard
                                patient={currentPatient}
                                onEdit={() => setIsEditing(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
