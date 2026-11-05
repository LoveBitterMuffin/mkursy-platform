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
        return 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/40';
      case 'in_progress':
        return 'bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/50 animate-pulse';
      case 'available':
        return 'bg-slate-900/90 border-amber-400/80 text-amber-100 shadow-md shadow-amber-500/10 hover:border-amber-300';
      case 'locked':
      default:
        return 'bg-slate-950/90 border-slate-800 text-slate-500 opacity-60 hover:opacity-80';
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
        isSelected ? 'scale-110 z-30 ring-4 ring-indigo-400/80' : 'hover:scale-105 z-20'
      }`}
    >
      <div className={`w-32 p-3.5 rounded-3xl border flex flex-col items-center text-center gap-2 backdrop-blur-xl ${getStatusStyles()}`}>
        <div className="w-9 h-9 rounded-2xl bg-slate-900/90 border border-inherit flex items-center justify-center shadow-inner">
          {getStatusIcon()}
        </div>
        <span className="text-xs font-bold line-clamp-2 leading-snug">
          {skill.title}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1 border-t border-white/5 w-full justify-center">
          <span className="px-2 py-0.5 rounded-lg bg-slate-800/80 font-mono font-semibold">
            {skill.grade} кл
          </span>
          <span className="font-bold text-amber-400 flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-amber-400" />
            {skill.xpReward}
          </span>
        </div>
      </div>
    </div>
  );
};
