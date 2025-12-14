import React from 'react';
import { Patient } from '../../types';
import { PersonalInfoSection } from './PersonalInfoSection';
import { Button } from '../Common/Button';

interface ProfilCardProps {
    patient: Patient;
    onEdit: () => void;
}

export const ProfilCard: React.FC<ProfilCardProps> = ({ patient, onEdit }) => {
    if (!patient) return null;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <PersonalInfoSection patient={patient} />
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <Button onClick={onEdit}>
                    Modifier mon profil
                </Button>
            </div>
        </div>
    );
};
