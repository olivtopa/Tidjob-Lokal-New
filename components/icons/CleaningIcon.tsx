
import React from 'react';

const CleaningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 21h14"/>
        <path d="M5 14v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>
        <path d="M3 14h18"/>
        <path d="M12 14v7"/>
        <path d="M10 4h4"/>
    </svg>
);
export default CleaningIcon;
