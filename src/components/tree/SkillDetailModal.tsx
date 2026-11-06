import React, { useEffect } from 'react';
import { X, Play, Lock, Check, Award, Clock } from 'lucide-react';
import { SkillNode } from '../../types';

interface SkillDetailModalProps {
  skill: SkillNode | null;
  allSkills: SkillNode[];
  onClose: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  allSkills,
  onClose,
  onOpenLesson,
}) => {
  useEffect(() => {
    if (!skill) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skill, onClose]);

  if (!skill) return null;

  const nodeMap = new Map<string, SkillNode>(allSkills.map(s => [s.id, s]));
  const isLocked = skill.status === 'locked';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 w-full max-w-md rounded-3xl p-8 shadow-2xl relative text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть окно темы"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 dark:bg-indigo-500/20 text-[#0066FF] dark:text-indigo-300 border border-blue-200 dark:border-indigo-500/30">
            {skill.category.toUpperCase()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
            {skill.grade} класс
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
          {skill.title}
        </h3>

        <div className="flex items-center gap-5 text-xs text-slate-700 dark:text-slate-300 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Награда: <strong className="text-amber-600 dark:text-amber-300 font-bold">+{skill.xpReward} XP</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" />
            <span>Время: <strong className="text-slate-900 dark:text-slate-100 font-bold">~20 мин</strong></span>
          </div>
        </div>

        {skill.prerequisites.length > 0 && (
          <div className="mb-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Необходимая база (Prerequisites):
            </h4>
            <div className="space-y-2">
              {skill.prerequisites.map(prereqId => {
                const parent = nodeMap.get(prereqId);
                const isParentMastered = parent?.status === 'mastered';
                return (
                  <div
                    key={prereqId}
                    className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {parent?.title ?? prereqId}
                    </span>
                    {isParentMastered ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Освоено
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Требуется
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (!isLocked && skill.lessonId) {
              onOpenLesson(skill.lessonId);
            }
          }}
          disabled={isLocked}
          className={`w-full min-h-[48px] py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            isLocked
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
              : 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.01]'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Тема заблокирована (освойте базу)
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              {skill.status === 'mastered' ? 'Повторить урок' : 'Начать изучение'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
