import React from 'react';
import { Doctor } from '../../types';
import { User } from 'lucide-react';

interface DoctorSelectorProps {
    doctors: Doctor[];
    selectedDoctorId?: string;
    onSelect: (doctor: Doctor) => void;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
    doctors,
    selectedDoctorId,
    onSelect,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">1. Choisissez un médecin</h3>
            <div className="grid gap-4 sm:grid-cols-2">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.doctorId}
                        onClick={() => onSelect(doctor)}
                        className={`cursor-pointer p-4 rounded-lg border transition-all ${selectedDoctorId === doctor.doctorId
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                        role="radio"
                        aria-checked={selectedDoctorId === doctor.doctorId}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') onSelect(doctor);
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Dr. {doctor.firstName} {doctor.surname}</p>
                                <p className="text-sm text-gray-500">{doctor.specialization}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
