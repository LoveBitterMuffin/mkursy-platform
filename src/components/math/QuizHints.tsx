import React, { useState } from 'react';
import { Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react';
import { MathText } from './MathText';

interface QuizHintsProps {
  hints: string[];
  explanation: string;
  isAnswered: boolean;
}

export const QuizHints: React.FC<QuizHintsProps> = ({ hints, explanation, isAnswered }) => {
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints(prev => prev + 1);
    }
  };

  return (
    <div className="mt-4 space-y-3 pt-3 border-t border-slate-700/60">
      <div className="flex flex-wrap items-center gap-2">
        {hints.length > 0 && revealedHints < hints.length && (
          <button
            type="button"
            onClick={handleNextHint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Подсказка ({revealedHints + 1}/{hints.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowExplanation(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          {showExplanation ? 'Скрыть разбор' : 'Показать разбор решения'}
        </button>
      </div>

      {revealedHints > 0 && (
        <div className="space-y-2">
          {hints.slice(0, revealedHints).map((hint, idx) => (
            <div
              key={idx}
              className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-sm text-amber-200"
            >
              <div className="font-semibold text-xs text-amber-400 mb-1">
                Подсказка #{idx + 1}:
              </div>
              <MathText text={hint} />
            </div>
          ))}
        </div>
      )}

      {(showExplanation || isAnswered) && explanation && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-200">
          <div className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Подробный разбор решения:
          </div>
          <MathText text={explanation} />
        </div>
      )}
    </div>
  );
};
