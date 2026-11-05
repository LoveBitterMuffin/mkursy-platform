import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Sparkles, BookOpen } from 'lucide-react';
import { Lesson } from '../../types';
import { MathFormula, MathText, InteractivePlot, QuizBlock, PhotoSubmissionBlock } from '../math';

interface LessonPlayerProps {
  lesson: Lesson;
  onBack: () => void;
  onFinish: (xp: number) => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onBack, onFinish }) => {
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const handleQuizComplete = (success: boolean, xp: number) => {
    if (success) {
      setEarnedXp(prev => prev + xp);
    }
  };

  const handleCompleteLesson = () => {
    setIsFinished(true);
    onFinish(earnedXp + 50);
  };

  const getCalloutStyles = (type?: string) => {
    switch (type) {
      case 'theorem':
        return 'bg-indigo-950/40 border-l-4 border-indigo-500 text-indigo-100 shadow-lg shadow-indigo-950/20';
      case 'trap':
        return 'bg-rose-950/40 border-l-4 border-rose-500 text-rose-100 shadow-lg shadow-rose-950/20';
      case 'property':
        return 'bg-amber-950/40 border-l-4 border-amber-500 text-amber-100 shadow-lg shadow-amber-950/20';
      case 'info':
      default:
        return 'bg-slate-900/80 border-l-4 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors py-2 px-3.5 rounded-xl hover:bg-slate-800/80"
          aria-label="Назад к карте знаний"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к карте знаний
        </button>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-indigo-400" /> ~{lesson.estimatedMinutes} мин
          </span>
          <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4" /> +{earnedXp + 50} XP
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" /> Интерактивный урок
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          {lesson.description}
        </p>
      </div>

      <div className="space-y-6 pt-2">
        {lesson.blocks.map(block => {
          if (block.type === 'text') {
            return (
              <div key={block.id} className={`p-6 rounded-2xl text-sm leading-relaxed ${getCalloutStyles(block.calloutType)}`}>
                <MathText text={block.content} />
              </div>
            );
          }
          if (block.type === 'math') {
            return (
              <div key={block.id} className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-3xl flex flex-col items-center gap-3 shadow-xl">
                <MathFormula latex={block.latex} displayMode />
                {block.caption && <span className="text-xs text-slate-400 font-semibold">{block.caption}</span>}
              </div>
            );
          }
          if (block.type === 'plot') {
            return (
              <div key={block.id}>
                <InteractivePlot
                  title={block.title}
                  fnExpression={block.fnExpression}
                  params={block.params}
                />
              </div>
            );
          }
          if (block.type === 'quiz') {
            return <QuizBlock key={block.id} block={block} onComplete={handleQuizComplete} />;
          }
          if (block.type === 'photo_submission') {
            return (
              <div key={block.id}>
                <PhotoSubmissionBlock
                  block={block}
                  onSubmitted={() => setEarnedXp(prev => prev + 30)}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="pt-8 border-t border-slate-800">
        <button
          type="button"
          onClick={handleCompleteLesson}
          disabled={isFinished}
          className={`w-full min-h-[52px] py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 transition-all shadow-xl ${
            isFinished
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.01]'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {isFinished ? 'Урок успешно завершен (+50 XP начислено)!' : 'Завершить урок и зафиксировать навык'}
        </button>
      </div>
    </div>
  );
};
