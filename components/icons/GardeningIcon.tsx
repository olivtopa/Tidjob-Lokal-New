
import React from 'react';

const GardeningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 11V6.5A2.5 2.5 0 0 0 11.5 4h-1A2.5 2.5 0 0 0 8 6.5V11"/>
        <path d="M14 11v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1"/>
        <path d="M10 11h4"/>
        <path d="M12 2v2"/>
        <path d="M12 14v8"/>
        <path d="M10 18h4"/>
    </svg>
);
export default GardeningIcon;
