import React from 'react';

const PrunerIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        {/* Left blade (hook) */}
        <path d="M8 5a6 6 0 0 1 6 6" />
        {/* Right blade (cutting) */}
        <path d="M16 5a6 6 0 0 0-6 6" />
        {/* Pivot */}
        <circle cx="11" cy="11" r="2" />
        {/* Left Handle */}
        <path d="M9 12 c-2 3 -4 6 0 9" />
        {/* Right Handle */}
        <path d="M13 12 c2 3 4 6 0 9" />
        {/* Spring/Latch detail optional, keeping it simple to match style */}
    </svg>
);

export default PrunerIcon;
