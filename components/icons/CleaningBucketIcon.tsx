import React from 'react';

const CleaningBucketIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        {/* Bucket */}
        <path d="M3 7h18l-2 13H5L3 7z" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        {/* Mop stick */}
        <path d="M16 3l4-3" />
        {/* Bubbles / Foam */}
        <circle cx="10" cy="12" r="1" />
        <circle cx="14" cy="14" r="1" />
        <circle cx="8" cy="16" r="1" />
    </svg>
);

export default CleaningBucketIcon;
