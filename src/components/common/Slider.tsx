import React from 'react';
import './Slider.css';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  labelLeft: string;
  labelRight: string;
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ 
  labelLeft, 
  labelRight, 
  value, 
  onChange, 
  ...props 
}) => {
  return (
    <div className="slider-container">
      <input 
        type="range" 
        className="range-slider" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value, 10))} 
        {...props} 
      />
      <div className="slider-labels">
        <span>{labelRight}</span>
        <span>{labelLeft}</span>
      </div>
    </div>
  );
};
