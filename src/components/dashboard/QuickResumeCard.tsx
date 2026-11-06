import React from 'react';
import { Play, Sparkles, Compass } from 'lucide-react';
import { SkillNode } from '../../types';

interface QuickResumeCardProps {
  skill: SkillNode | null;
  onResume: (skill: SkillNode) => void;
}

export const QuickResumeCard: React.FC<QuickResumeCardProps> = ({ skill, onResume }) => {
  if (!skill) return null;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 dark:from-indigo-950/80 dark:via-slate-900 dark:to-indigo-950/70 border border-blue-200 dark:border-indigo-500/40 rounded-3xl flex flex-wrap items-center justify-between gap-5 shadow-sm dark:shadow-2xl">
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] dark:text-indigo-400 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" />
          <span>Рекомендованный следующий шаг:</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-indigo-500/20 text-[#0066FF] dark:text-indigo-300 text-[11px] font-semibold">
            {skill.category}
          </span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{skill.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-3">
          <span>{skill.grade} класс</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> +{skill.xpReward} XP за освоение
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => onResume(skill)}
        className="min-h-[48px] px-6 py-3 bg-[#0066FF] hover:bg-blue-600 text-white text-sm font-black rounded-2xl flex items-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Продолжить урок</span>
      </button>
    </div>
  );
};
