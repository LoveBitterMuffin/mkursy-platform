import React from 'react';
import { Flame, Zap, Award, Target } from 'lucide-react';
import { StudentProfile } from '../../types';

interface StudentKpiGridProps {
  profile: StudentProfile;
  masteredCount: number;
  totalSkills: number;
}

export const StudentKpiGrid: React.FC<StudentKpiGridProps> = ({
  profile,
  masteredCount,
  totalSkills,
}) => {
  const readiness = Math.round((masteredCount / Math.max(1, totalSkills)) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
          <Flame className="w-5 h-5 fill-amber-500 dark:fill-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Стрик</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{profile.streakDays} дней</div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Регулярные занятия без пропусков</p>
      </div>

      <div className="p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-[#0066FF] dark:text-indigo-400">
          <Zap className="w-5 h-5 fill-[#0066FF] dark:fill-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Опыт XP</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{profile.totalXp} XP</div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">За решенные формулы и квизы</p>
      </div>

      <div className="p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Темы</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{masteredCount} / {totalSkills}</div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Освоено разделов курса</p>
      </div>

      <div className="p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Готовность</span>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{readiness}%</div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">По кодификатору ФИПИ</p>
      </div>
    </div>
  );
};
