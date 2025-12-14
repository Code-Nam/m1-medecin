import React from 'react';
import { Patient } from '../../types';
import { PersonalInfoSection } from './PersonalInfoSection';
import { Button } from '../Common/Button';
import { useTheme } from '../../hooks/useTheme';

interface ProfilCardProps {
    patient: Patient;
    onEdit: () => void;
}

export const ProfilCard: React.FC<ProfilCardProps> = ({ patient, onEdit }) => {
    const { colors } = useTheme();

    if (!patient) return null;

    return (
        <div 
            className="shadow overflow-hidden sm:rounded-lg"
            style={{ backgroundColor: colors.bg.card }}
        >
            <PersonalInfoSection patient={patient} />
            <div 
                className="px-4 py-3 text-right sm:px-6"
                style={{ backgroundColor: colors.bg.secondary }}
            >
                <Button onClick={onEdit}>
                    Modifier mon profil
                </Button>
            </div>
        </div>
    );
};
