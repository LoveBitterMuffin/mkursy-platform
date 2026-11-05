import React, { useState } from 'react';
import { Flame, Zap, Award, Target, TrendingUp, Users, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { StudentProfile, SkillNode } from '../../types';
import { CuratorModal } from './CuratorModal';

interface StudentDashboardProps {
  profile: StudentProfile;
  skills: SkillNode[];
  onOpenTopic: (skill: SkillNode) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile, skills, onOpenTopic }) => {
  const [showCuratorModal, setShowCuratorModal] = useState<boolean>(false);
  const masteredCount = skills.filter(s => s.status === 'mastered').length;
  const availableTopics = skills.filter(s => s.status === 'available' || s.status === 'in_progress');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-2xl shadow-indigo-950/20">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">{profile.name}</h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {profile.grade} класс
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Целевой экзамен: <strong className="text-slate-200">ЕГЭ Профиль (Математика)</strong> • Центр «МКурсы»
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Прогноз балла ЕГЭ</span>
            <div className="text-3xl font-black text-emerald-400 flex items-center justify-end gap-1">
              {profile.forecastScore} <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Стрик</span>
          </div>
          <div className="text-3xl font-black text-white">{profile.streakDays} дней</div>
          <p className="text-xs text-slate-400">Регулярные занятия без пропусков</p>
        </div>

        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Zap className="w-5 h-5 fill-indigo-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Опыт XP</span>
          </div>
          <div className="text-3xl font-black text-white">{profile.totalXp} XP</div>
          <p className="text-xs text-slate-400">За решенные формулы и квизы</p>
        </div>

        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Темы</span>
          </div>
          <div className="text-3xl font-black text-white">{masteredCount} / {skills.length}</div>
          <p className="text-xs text-slate-400">Освоено разделов курса</p>
        </div>

        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Готовность</span>
          </div>
          <div className="text-3xl font-black text-white">
            {Math.round((masteredCount / Math.max(1, skills.length)) * 100)}%
          </div>
          <p className="text-xs text-slate-400">По кодификатору ФИПИ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Рекомендуемые темы для изучения
          </h3>
          <div className="space-y-3">
            {availableTopics.slice(0, 3).map(topic => (
              <div
                key={topic.id}
                role="button"
                tabIndex={0}
                aria-label={`Перейти к теме ${topic.title}`}
                onClick={() => onOpenTopic(topic)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpenTopic(topic)}
                className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{topic.title}</h4>
                  <span className="text-xs text-slate-400">{topic.grade} класс • +{topic.xpReward} XP</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-900/70 border border-slate-800/80 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-400" /> Сводка успеваемости для родителей
          </h3>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Сдано домашних заданий:</span>
              <strong className="text-emerald-400 font-bold">100% вовремя</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> Посещаемость занятий:</span>
              <strong className="text-slate-100 font-bold">8 из 8 уроков</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> Текущая динамика:</span>
              <strong className="text-emerald-400 font-bold">+14 баллов за месяц</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCuratorModal(true)}
            className="w-full min-h-[44px] py-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-2xl transition-colors border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Связаться с куратором «МКурсы»
          </button>
        </div>
      </div>

      <CuratorModal isOpen={showCuratorModal} onClose={() => setShowCuratorModal(false)} />
    </div>
  );
};
