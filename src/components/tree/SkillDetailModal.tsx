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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-indigo-950/40 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-2xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {skill.category.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 font-mono font-semibold">
            {skill.grade} класс
          </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 leading-tight tracking-tight">
          {skill.title}
        </h3>

        <div className="flex items-center gap-5 text-xs text-slate-300 mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Награда: <strong className="text-amber-300 font-bold">+{skill.xpReward} XP</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Время: <strong className="text-slate-100 font-bold">~20 мин</strong></span>
          </div>
        </div>

        {skill.prerequisites.length > 0 && (
          <div className="mb-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Необходимая база (Prerequisites):
            </h4>
            <div className="space-y-2">
              {skill.prerequisites.map(prereqId => {
                const parent = nodeMap.get(prereqId);
                const isParentMastered = parent?.status === 'mastered';
                return (
                  <div
                    key={prereqId}
                    className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50"
                  >
                    <span className="text-slate-200 font-semibold">
                      {parent?.title ?? prereqId}
                    </span>
                    {isParentMastered ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Check className="w-4 h-4 text-emerald-400" /> Освоено
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Lock className="w-4 h-4 text-amber-400" /> Требуется
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
          className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]'
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
