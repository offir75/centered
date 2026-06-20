import React from 'react';
import './PhoneContainer.css';

interface PhoneContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ 
  children, 
  backgroundColor = 'rgba(255, 255, 255, 0.9)' 
}) => {
  return (
    <div 
      className="phone-container" 
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
};
