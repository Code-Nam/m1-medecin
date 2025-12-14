import React from 'react';
import { AppointmentStatus as StatusEnum } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface AppointmentStatusProps {
    status: StatusEnum;
}

export const AppointmentStatus: React.FC<AppointmentStatusProps> = ({ status }) => {
    const { darkMode, colors } = useTheme();

    const getStatusStyles = (status: StatusEnum) => {
        switch (status) {
            case StatusEnum.CONFIRMED:
                return {
                    backgroundColor: darkMode ? 'rgba(77, 182, 172, 0.3)' : 'rgba(67, 167, 139, 0.2)',
                    color: colors.semantic.success,
                    borderColor: darkMode ? 'rgba(77, 182, 172, 0.4)' : 'rgba(67, 167, 139, 0.3)'
                };
            case StatusEnum.PENDING:
                return {
                    backgroundColor: darkMode ? 'rgba(255, 213, 79, 0.3)' : 'rgba(255, 224, 130, 0.3)',
                    color: colors.semantic.warning,
                    borderColor: darkMode ? 'rgba(255, 213, 79, 0.5)' : 'rgba(255, 224, 130, 0.5)'
                };
            case StatusEnum.CANCELLED:
                return {
                    backgroundColor: darkMode ? 'rgba(239, 83, 80, 0.2)' : 'rgba(230, 57, 70, 0.1)',
                    color: colors.semantic.danger,
                    borderColor: darkMode ? 'rgba(239, 83, 80, 0.4)' : 'rgba(230, 57, 70, 0.3)'
                };
            case StatusEnum.DOCTOR_CREATED:
                return {
                    backgroundColor: darkMode ? 'rgba(77, 182, 172, 0.3)' : 'rgba(67, 167, 139, 0.2)',
                    color: colors.semantic.success,
                    borderColor: darkMode ? 'rgba(77, 182, 172, 0.4)' : 'rgba(67, 167, 139, 0.3)'
                };
            default:
                return {
                    backgroundColor: darkMode ? colors.bg.secondary : colors.bg.primary,
                    color: colors.text.secondary,
                    borderColor: colors.border.default
                };
        }
    };

    const getStatusLabel = (status: StatusEnum) => {
        switch (status) {
            case StatusEnum.CONFIRMED:
                return 'Confirmé';
            case StatusEnum.PENDING:
                return 'En attente';
            case StatusEnum.CANCELLED:
                return 'Annulé';
            case StatusEnum.DOCTOR_CREATED:
                return 'Proposé';
            default:
                return status;
        }
    };

    const statusStyles = getStatusStyles(status);

    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold border"
            style={statusStyles}
            role="status"
        >
            {getStatusLabel(status)}
        </span>
    );
};
