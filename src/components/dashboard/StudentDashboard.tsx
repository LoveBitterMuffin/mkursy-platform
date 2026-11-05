import React from 'react';
import { Flame, Zap, Award, Target, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { StudentProfile, SkillNode } from '../../types';

interface StudentDashboardProps {
  profile: StudentProfile;
  skills: SkillNode[];
  onOpenTopic: (skill: SkillNode) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  skills,
  onOpenTopic,
}) => {
  const masteredCount = skills.filter(s => s.status === 'mastered').length;
  const availableTopics = skills.filter(s => s.status === 'available' || s.status === 'in_progress');

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Student Hero Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">{profile.name}</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {profile.grade} класс
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Цель: <strong className="text-slate-200">ЕГЭ Профиль (Математика)</strong> • Центр «МКурсы»
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Прогноз балла ЕГЭ</span>
            <div className="text-3xl font-black text-emerald-400 flex items-center justify-end gap-1">
              {profile.forecastScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-bold uppercase">Стрик</span>
          </div>
          <div className="text-2xl font-black text-white">{profile.streakDays} дней</div>
          <p className="text-[10px] text-slate-400 mt-1">Регулярные занятия без пропусков</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Zap className="w-4 h-4 fill-indigo-400" />
            <span className="text-xs font-bold uppercase">Опыт XP</span>
          </div>
          <div className="text-2xl font-black text-white">{profile.totalXp} XP</div>
          <p className="text-[10px] text-slate-400 mt-1">За решенные формулы и квизы</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase">Темы</span>
          </div>
          <div className="text-2xl font-black text-white">{masteredCount} / {skills.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Освоено разделов курса</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase">Готовность</span>
          </div>
          <div className="text-2xl font-black text-white">
            {Math.round((masteredCount / Math.max(1, skills.length)) * 100)}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">По кодификатору ФИПИ</p>
        </div>
      </div>

      {/* Recommended Topics & Parent Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Next Topics */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Рекомендуемые темы для изучения
          </h3>
          <div className="space-y-2">
            {availableTopics.slice(0, 3).map(topic => (
              <div
                key={topic.id}
                onClick={() => onOpenTopic(topic)}
                className="p-3 bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{topic.title}</h4>
                  <span className="text-[10px] text-slate-400">{topic.grade} класс • +{topic.xpReward} XP</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Parent Summary Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> Сводка успеваемости для родителей
          </h3>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Сдано домашних заданий:</span>
              <strong className="text-emerald-400">100% вовремя</strong>
            </div>
            <div className="flex justify-between">
              <span>Посещаемость занятий:</span>
              <strong className="text-slate-100">8 из 8 уроков</strong>
            </div>
            <div className="flex justify-between">
              <span>Текущая динамика:</span>
              <strong className="text-emerald-400">+14 баллов за месяц</strong>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl transition-colors border border-slate-700"
          >
            Связаться с куратором «МКурсы»
          </button>
        </div>
      </div>
    </div>
  );
};
