import React, { useState } from 'react';
import { Check, X, Sparkles, Send } from 'lucide-react';
import { LessonBlock } from '../../types';
import { validateMathAnswer } from '../../utils/answerValidator';
import { MathText } from './MathText';
import { QuizHints } from './QuizHints';

interface QuizBlockProps {
  block: Extract<LessonBlock, { type: 'quiz' }>;
  onComplete?: (success: boolean, xp: number) => void;
}

export const QuizBlock: React.FC<QuizBlockProps> = ({ block, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userMathInput, setUserMathInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted && isCorrect) return;

    let correct = false;
    if (block.options && block.options.length > 0) {
      correct = selectedOption === block.correctOptionIndex;
    } else if (block.mathAnswer) {
      correct = validateMathAnswer(block.mathAnswer, userMathInput);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    if (correct && onComplete) {
      onComplete(true, 25);
    }
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      isSubmitted 
        ? isCorrect 
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 shadow-md'
          : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/50'
        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-lg'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex-1 leading-snug">
          <MathText text={block.question} />
        </h4>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 dark:bg-indigo-500/15 text-[#0066FF] dark:text-indigo-300 border border-blue-200 dark:border-indigo-500/30">
          +25 XP
        </span>
      </div>

      {block.options && block.options.length > 0 ? (
        <div className="space-y-2.5 mb-5">
          {block.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 hover:border-[#0066FF] text-slate-800 dark:text-slate-200';
            if (isSubmitted) {
              if (idx === block.correctOptionIndex) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 dark:bg-rose-900/50 border-rose-500 text-rose-900 dark:text-rose-100';
              }
            } else if (isSelected) {
              btnStyle = 'bg-blue-50 dark:bg-indigo-600/30 border-[#0066FF] text-blue-900 dark:text-indigo-100 ring-2 ring-[#0066FF]';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span><MathText text={option} /></span>
                {isSubmitted && idx === block.correctOptionIndex && (
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex gap-2.5">
            <input
              type="text"
              value={userMathInput}
              onChange={e => setUserMathInput(e.target.value)}
              placeholder="Введите число или дробь (например, 0.5 или 1/2)"
              disabled={isSubmitted && isCorrect}
              className="flex-1 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0066FF] transition-colors"
            />
            <button
              type="submit"
              disabled={!userMathInput.trim() || (isSubmitted && isCorrect)}
              className="px-5 py-3 bg-[#0066FF] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Send className="w-4 h-4" />
              Ответить
            </button>
          </div>
        </form>
      )}

      {block.options && block.options.length > 0 && !isSubmitted && (
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={selectedOption === null}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30"
        >
          Проверить ответ
        </button>
      )}

      {isSubmitted && isCorrect && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Великолепно! Ответ абсолютно верный (+25 XP).
        </div>
      )}

      <QuizHints
        hints={block.hints || []}
        explanation={block.explanation || ''}
        isAnswered={isSubmitted && isCorrect}
      />
    </div>
  );
};
