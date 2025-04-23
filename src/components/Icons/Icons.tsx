import React from 'react';

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#0ff"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 17.25V21h3.75l11.02-11.02-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 
             0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 
             3.75 3.75 1.83-1.83z"/>
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#f0f"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6h18v2H3V6zm2 3h14l-1.1 12.1c-.1 1.1-1 1.9-2.1 1.9H8.1c-1.1 
             0-2-.8-2.1-1.9L5 9zm5 2v8h2v-8H10zm4 
             0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z"/>
  </svg>
);

export const ReplaceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#0ff"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.65 6.35A7.95 7.95 0 0 0 12 
             4c-4.42 0-8 3.58-8 8h1.5l-2.2 
             2.2L0 12l3.3-3.3L1.1 6.5H2.5c0-4.42 
             3.58-8 8-8 2.21 0 4.21.9 
             5.65 2.35l1.5-1.5zm-6.3 
             11.3A7.95 7.95 0 0 0 12 
             20c4.42 0 8-3.58 8-8h-1.5l2.2-2.2L24 
             12l-3.3 3.3 2.2 2.2H21.5c0 
             4.42-3.58 8-8 8-2.21 0-4.21-.9-5.65-2.35
             l-1.5 1.5z"/>
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#0ff"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 20h14v-2H5v2zm7-18L5.33 
             9.67l1.41 1.41L11 7.83V18h2V7.83l4.26 
             4.26 1.41-1.41L12 2z"/>
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
  
  export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
  
  export const RepeatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 1l4 4-4 4M7 23l-4-4 4-4M3 12h18" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  