import React from 'react';
import { Lock, Check, Sparkles, BookOpen, Zap } from 'lucide-react';
import { SkillNode } from '../../types';

interface SkillNodeCardProps {
  skill: SkillNode;
  isSelected: boolean;
  onSelect: (skill: SkillNode) => void;
}

export const SkillNodeCard: React.FC<SkillNodeCardProps> = ({ skill, isSelected, onSelect }) => {
  const getStatusStyles = () => {
    switch (skill.status) {
      case 'mastered':
        return 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500 dark:border-emerald-400 text-emerald-950 dark:text-emerald-100 shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/20 ring-2 ring-emerald-500/30 dark:ring-emerald-500/40';
      case 'in_progress':
        return 'bg-blue-50 dark:bg-indigo-950/90 border-[#0066FF] dark:border-indigo-400 text-blue-950 dark:text-indigo-100 shadow-md shadow-blue-500/15 dark:shadow-indigo-500/25 ring-2 ring-blue-500/30 dark:ring-indigo-500/50';
      case 'available':
        return 'bg-amber-50 dark:bg-slate-900 border-amber-400 dark:border-amber-400/80 text-amber-950 dark:text-amber-100 shadow-sm dark:shadow-md hover:border-amber-500 dark:hover:border-amber-300';
      case 'locked':
      default:
        return 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-500 opacity-60 hover:opacity-80';
    }
  };

  const getStatusIcon = () => {
    switch (skill.status) {
      case 'mastered':
        return <Check className="w-4 h-4 text-emerald-300" />;
      case 'in_progress':
        return <Sparkles className="w-4 h-4 text-[#0066FF] dark:text-indigo-300" />;
      case 'available':
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'locked':
      default:
        return <Lock className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(skill);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Тема ${skill.title}, ${skill.grade} класс, награда ${skill.xpReward} XP`}
      style={{ left: `${skill.x}px`, top: `${skill.y}px` }}
      onClick={() => onSelect(skill)}
      onKeyDown={handleKeyDown}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0066FF] ${
        isSelected ? 'z-30 ring-4 ring-[#0066FF]' : 'z-20'
      }`}
    >
      <div className={`w-32 p-3.5 rounded-3xl border flex flex-col items-center text-center gap-2 ${getStatusStyles()}`}>
        <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-900 border border-inherit flex items-center justify-center shadow-xs">
          {getStatusIcon()}
        </div>
        <span className="text-xs font-bold line-clamp-2 leading-snug">
          {skill.title}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-white/5 w-full justify-center">
          <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-semibold">
            {skill.grade} кл
          </span>
          <span className="font-bold text-amber-500 dark:text-amber-400 flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
            {skill.xpReward}
          </span>
        </div>
      </div>
    </div>
  );
};
