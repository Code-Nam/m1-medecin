import React from 'react';
import { Patient } from '../../types';
import { Mail, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../../utils/dataFormater';
import { useTheme } from '../../hooks/useTheme';

interface PersonalInfoSectionProps {
    patient: Patient;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ patient }) => {
    const { colors } = useTheme();

    return (
        <div 
            className="px-4 py-5 sm:px-6"
            style={{ backgroundColor: colors.bg.card }}
        >
            <h3 
                className="text-lg leading-6 font-medium"
                style={{ color: colors.text.primary }}
            >
                Information Personnelle
            </h3>
            <p 
                className="mt-1 max-w-2xl text-sm"
                style={{ color: colors.text.secondary }}
            >
                Détails de votre compte et contact.
            </p>

            <div 
                className="mt-5 border-t"
                style={{ borderColor: colors.border.default }}
            >
                <dl 
                    className="divide-y"
                    style={{ '--tw-divide-color': colors.border.default } as React.CSSProperties}
                >
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt 
                            className="text-sm font-medium flex items-center"
                            style={{ color: colors.text.secondary }}
                        >
                            <span className="mr-2">Nom complet</span>
                        </dt>
                        <dd 
                            className="mt-1 text-sm sm:mt-0 sm:col-span-2"
                            style={{ color: colors.text.primary }}
                        >
                            {patient.firstName} {patient.surname}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt 
                            className="text-sm font-medium flex items-center"
                            style={{ color: colors.text.secondary }}
                        >
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </dt>
                        <dd 
                            className="mt-1 text-sm sm:mt-0 sm:col-span-2"
                            style={{ color: colors.text.primary }}
                        >
                            {patient.email}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt 
                            className="text-sm font-medium flex items-center"
                            style={{ color: colors.text.secondary }}
                        >
                            <Phone className="mr-2 h-4 w-4" /> Téléphone
                        </dt>
                        <dd 
                            className="mt-1 text-sm sm:mt-0 sm:col-span-2"
                            style={{ color: colors.text.primary }}
                        >
                            {patient.phone}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt 
                            className="text-sm font-medium flex items-center"
                            style={{ color: colors.text.secondary }}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" /> Date de naissance
                        </dt>
                        <dd 
                            className="mt-1 text-sm sm:mt-0 sm:col-span-2"
                            style={{ color: colors.text.primary }}
                        >
                            {formatDate(patient.dateOfBirth)}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt 
                            className="text-sm font-medium flex items-center"
                            style={{ color: colors.text.secondary }}
                        >
                            <MapPin className="mr-2 h-4 w-4" /> Adresse
                        </dt>
                        <dd 
                            className="mt-1 text-sm sm:mt-0 sm:col-span-2"
                            style={{ color: colors.text.primary }}
                        >
                            {patient.address}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
