
import React from 'react';

const ChefHatIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a5 5 0 0 0-5 5v2h10V7a5 5 0 0 0-5-5Z" />
    <path d="M19.78 9.34A5.001 5.001 0 0 0 17 7h-2a5 5 0 0 0-5 5v2h10v-2a5.001 5.001 0 0 0-.22-1.66Z" />
    <path d="M7 9.34A5.001 5.001 0 0 1 4.22 7.66 4.992 4.992 0 0 1 4 7h3a5 5 0 0 1 5 5v2H2v-2a5 5 0 0 1 5-5Z" />
    <path d="M2 14h20v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-2Z" />
  </svg>
);

export default ChefHatIcon;
