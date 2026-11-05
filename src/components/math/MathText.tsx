import React from 'react';
import { MathFormula } from './MathFormula';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // If text starts with LaTeX command like \frac, \sqrt, or pure math without words
  if (/^\\[a-zA-Z]+/.test(text.trim())) {
    return <MathFormula latex={text} className={className} />;
  }

  // Split by inline $math$ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className={`inline ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const formula = part.slice(1, -1);
          return <MathFormula key={index} latex={formula} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
