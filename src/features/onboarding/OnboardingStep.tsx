import React from 'react';
import { Button } from '../../components/common/Button';
import './OnboardingWizard.css';

interface OnboardingStepProps {
  icon: string | React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  children?: React.ReactNode;
  pulseIcon?: boolean;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = function({
  icon,
  title,
  description,
  onNext,
  nextLabel = 'הבא',
  children,
  pulseIcon = false
}) {
  return (
    <div className="wizard-step active">
      <div className="content">
        <div className={`icon ${pulseIcon ? 'pulse' : ''}`}>{icon}</div>
        <h2>{title}</h2>
        {typeof description === 'string' ? <p className="element-desc">{description}</p> : <div className="element-desc">{description}</div>}
        {children}
      </div>
      <div className="actions">
        {onNext && <Button onClick={onNext}>{nextLabel}</Button>}
      </div>
    </div>
  );
};
