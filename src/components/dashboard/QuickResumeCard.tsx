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
    <div className="p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/70 border border-indigo-500/40 rounded-3xl flex flex-wrap items-center justify-between gap-5 shadow-2xl shadow-indigo-950/40">
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Рекомендованный следующий шаг:</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px]">
            {skill.category}
          </span>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">{skill.title}</h3>
        <p className="text-xs text-slate-300 font-medium flex items-center gap-3">
          <span>{skill.grade} класс</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> +{skill.xpReward} XP за освоение
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => onResume(skill)}
        className="min-h-[48px] px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-2xl flex items-center gap-2.5 shadow-lg shadow-indigo-600/40 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Продолжить урок</span>
      </button>
    </div>
  );
};
