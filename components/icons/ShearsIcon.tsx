import React from 'react';

const ShearsIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.5 17.5 13 11l4.5 6.5" />
        <path d="M15.5 17.5 11 11l-4.5 6.5" />
        <path d="M11 11 9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1l-2 7" />
    </svg>
);

export default ShearsIcon;
