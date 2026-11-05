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
    <div className={`p-5 rounded-xl border transition-all duration-200 ${
      isSubmitted 
        ? isCorrect 
          ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-900/10'
          : 'bg-rose-950/20 border-rose-500/40'
        : 'bg-slate-900/80 border-slate-700/80'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h4 className="text-base font-semibold text-slate-100 flex-1">
          <MathText text={block.question} />
        </h4>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          +25 XP
        </span>
      </div>

      {block.options && block.options.length > 0 ? (
        <div className="space-y-2 mb-4">
          {block.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-indigo-400 text-slate-200';
            if (isSubmitted) {
              if (idx === block.correctOptionIndex) {
                btnStyle = 'bg-emerald-900/40 border-emerald-500 text-emerald-200';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-900/40 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${btnStyle}`}
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
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userMathInput}
              onChange={e => setUserMathInput(e.target.value)}
              placeholder="Введите число или дробь (например, 0.5 или 1/2)"
              disabled={isSubmitted && isCorrect}
              className="flex-1 px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!userMathInput.trim() || (isSubmitted && isCorrect)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
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
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Проверить ответ
        </button>
      )}

      {isSubmitted && isCorrect && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-300 text-sm font-medium mb-2">
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
