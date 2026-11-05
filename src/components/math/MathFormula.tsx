import React, { useMemo } from 'react';
import katex from 'katex';

export interface MathFormulaProps {
  math?: string;
  latex?: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  math,
  latex,
  displayMode = false,
  className = '',
}) => {
  const formula = (math ?? latex ?? '').trim();

  const rendered = useMemo(() => {
    if (!formula) return { html: '', hasError: false };
    try {
      const html = katex.renderToString(formula, {
        displayMode,
        throwOnError: true,
        output: 'htmlAndMathml',
      });
      return { html, hasError: false };
    } catch {
      return { html: '', hasError: true };
    }
  }, [formula, displayMode]);

  if (!formula) return null;

  if (rendered.hasError) {
    return (
      <span
        className={`font-mono text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 ${className}`}
        title="Формула содержит синтаксическую ошибку"
      >
        {formula}
      </span>
    );
  }

  if (displayMode) {
    return (
      <div
        className={`overflow-x-auto py-2 my-2 text-center text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: rendered.html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-baseline text-slate-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  );
};
