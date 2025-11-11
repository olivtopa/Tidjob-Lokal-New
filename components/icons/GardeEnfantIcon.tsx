import React from 'react';

const GardeEnfantIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M12 11V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
        <path d="M12 14h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/>
    </svg>
);
export default GardeEnfantIcon;