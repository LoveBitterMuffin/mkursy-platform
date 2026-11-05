import React from 'react';
import { Lock, Check, Sparkles, BookOpen } from 'lucide-react';
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
        return 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40';
      case 'in_progress':
        return 'bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/50 animate-pulse';
      case 'available':
        return 'bg-slate-900 border-amber-400/80 text-amber-100 shadow-md shadow-amber-500/10 hover:border-amber-300';
      case 'locked':
      default:
        return 'bg-slate-950/90 border-slate-700/60 text-slate-500 opacity-60 hover:opacity-80';
    }
  };

  const getStatusIcon = () => {
    switch (skill.status) {
      case 'mastered':
        return <Check className="w-4 h-4 text-emerald-300" />;
      case 'in_progress':
        return <Sparkles className="w-4 h-4 text-indigo-300 animate-spin" />;
      case 'available':
        return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'locked':
      default:
        return <Lock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      style={{ left: `${skill.x}px`, top: `${skill.y}px` }}
      onClick={() => onSelect(skill)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 select-none ${
        isSelected ? 'scale-110 z-30 ring-4 ring-indigo-400' : 'hover:scale-105 z-20'
      }`}
    >
      <div className={`w-28 p-2.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 backdrop-blur-md ${getStatusStyles()}`}>
        <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-inherit flex items-center justify-center">
          {getStatusIcon()}
        </div>
        <span className="text-xs font-semibold line-clamp-2 leading-tight">
          {skill.title}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-slate-300">
          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 font-mono">
            {skill.grade} кл
          </span>
          <span className="font-semibold text-amber-400">
            +{skill.xpReward} XP
          </span>
        </div>
      </div>
    </div>
  );
};
