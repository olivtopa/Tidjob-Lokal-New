import React from 'react';

const RakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22V10" />
        <path d="M4 14l3.5-7" />
        <path d="M20 14l-3.5-7" />
        <path d="M7 14h10" />
        <path d="M9 14v4" />
        <path d="M15 14v4" />
        <path d="M12 14v4" />
    </svg>
);

export default RakeIcon;
