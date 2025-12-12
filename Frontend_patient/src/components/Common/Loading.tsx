import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="sr-only">Chargement...</span>
        </div>
    );
};
