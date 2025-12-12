import React from 'react';
import { Patient } from '../../types';
import { Mail, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../../utils/dataFormater';

interface PersonalInfoSectionProps {
    patient: Patient;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ patient }) => {
    return (
        <div className="bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Information Personnelle</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Détails de votre compte et contact.</p>

            <div className="mt-5 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <span className="mr-2">Nom complet</span>
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {patient.firstName} {patient.surname}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {patient.email}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Phone className="mr-2 h-4 w-4" /> Téléphone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {patient.phone}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Date de naissance
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {formatDate(patient.dateOfBirth)}
                        </dd>
                    </div>

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <MapPin className="mr-2 h-4 w-4" /> Adresse
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {patient.address}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
