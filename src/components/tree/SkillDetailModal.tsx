import React from 'react';
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
  if (!skill) return null;

  const nodeMap = new Map<string, SkillNode>(allSkills.map(s => [s.id, s]));
  const isLocked = skill.status === 'locked';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {skill.category.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {skill.grade} класс
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3">
          {skill.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-slate-300 mb-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Награда: <strong className="text-amber-300">+{skill.xpReward} XP</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Время: <strong>~20 мин</strong></span>
          </div>
        </div>

        {skill.prerequisites.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Необходимая база (Prerequisites):
            </h4>
            <div className="space-y-1.5">
              {skill.prerequisites.map(prereqId => {
                const parent = nodeMap.get(prereqId);
                const isParentMastered = parent?.status === 'mastered';
                return (
                  <div
                    key={prereqId}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/60 border border-slate-700/50"
                  >
                    <span className="text-slate-200 font-medium">
                      {parent?.title ?? prereqId}
                    </span>
                    {isParentMastered ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Освоено
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Lock className="w-3.5 h-3.5" /> Требуется
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
          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
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
