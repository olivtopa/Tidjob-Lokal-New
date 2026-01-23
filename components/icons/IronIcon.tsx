import React from 'react';

const IronIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path d="M21.11 3.89a2.53 2.53 0 0 1 .49 2.45L19.4 12.8A6.47 6.47 0 0 1 12.93 18H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12.5a2 2 0 0 1 1.41.58C19.78 3.45 20.31 3.58 21.11 3.89Z" />
        <path d="M22 20H2" />
    </svg>
);

export default IronIcon;
