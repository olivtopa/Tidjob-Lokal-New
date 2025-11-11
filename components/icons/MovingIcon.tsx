
import React from 'react';

const MovingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 17h10"/>
        <path d="M12 17V7H2v10"/>
        <path d="M6 11h2"/>
        <path d="M22 17H12"/>
        <path d="m17 12 3 3-3 3"/>
        <path d="M12 7H6.5a2.5 2.5 0 0 1 0-5h0A2.5 2.5 0 0 1 9 4.5"/>
    </svg>
);
export default MovingIcon;
