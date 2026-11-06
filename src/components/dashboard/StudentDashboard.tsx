import React, { useState } from 'react';
import { TrendingUp, Users, ArrowRight, CheckCircle2, Calendar, Share2 } from 'lucide-react';
import { StudentProfile, SkillNode } from '../../types';
import { CuratorModal } from './CuratorModal';
import { QuickResumeCard } from './QuickResumeCard';
import { ParentReportModal } from './ParentReportModal';
import { StudentKpiGrid } from './StudentKpiGrid';
import { generateParentReportText } from '../../utils/parentReportGenerator';

export const StudentDashboard: React.FC<{
  profile: StudentProfile;
  skills: SkillNode[];
  onOpenTopic: (skill: SkillNode) => void;
}> = ({ profile, skills, onOpenTopic }) => {
  const [showCuratorModal, setShowCuratorModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const masteredCount = skills.filter(s => s.status === 'mastered').length;
  const availableTopics = skills.filter(s => s.status === 'available' || s.status === 'in_progress');
  const activeSkill = skills.find(s => s.status === 'in_progress') || availableTopics[0] || null;
  const reportText = generateParentReportText(profile, skills);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-7">
      <div className="p-8 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-sm dark:shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.name}</h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 dark:bg-indigo-500/20 text-[#0066FF] dark:text-indigo-300 border border-blue-200 dark:border-indigo-500/40">
              {profile.grade} класс
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Целевой экзамен: <strong className="text-slate-800 dark:text-slate-200">ЕГЭ Профиль (Математика)</strong> • Центр «МКурсы»
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Прогноз балла ЕГЭ</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              {profile.forecastScore} <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <QuickResumeCard skill={activeSkill} onResume={onOpenTopic} />

      <StudentKpiGrid profile={profile} masteredCount={masteredCount} totalSkills={skills.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#0066FF] dark:text-indigo-400" /> Рекомендуемые темы для изучения
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
                className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-indigo-500/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{topic.title}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{topic.grade} класс • +{topic.xpReward} XP</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-500" /> Сводка успеваемости для родителей
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Домашние задания:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">100% вовремя</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" /> Посещаемость:</span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold">8 из 8 уроков</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Динамика:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">+14 баллов за месяц</strong>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="min-h-[44px] py-2.5 px-3 bg-[#0066FF] hover:bg-blue-600 text-xs font-bold text-white rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Отправить отчет
            </button>
            <button
              type="button"
              onClick={() => setShowCuratorModal(true)}
              className="min-h-[44px] py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
            >
              Связаться с куратором
            </button>
          </div>
        </div>
      </div>

      <CuratorModal isOpen={showCuratorModal} onClose={() => setShowCuratorModal(false)} />
      <ParentReportModal isOpen={showReportModal} reportText={reportText} onClose={() => setShowReportModal(false)} />
    </div>
  );
};
