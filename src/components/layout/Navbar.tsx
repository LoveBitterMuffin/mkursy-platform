import React from 'react';
import { Compass, LayoutDashboard, Edit3, Flame, Zap, UserCheck, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../../types';

interface NavbarProps {
  currentView: 'tree' | 'dashboard' | 'editor';
  onViewChange: (view: 'tree' | 'dashboard' | 'editor') => void;
  profile: StudentProfile;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  profile,
  isTeacherMode,
  onToggleTeacherMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-xl select-none transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <div
          role="button"
          tabIndex={0}
          aria-label="Главная страница МКурсы"
          className="flex items-center gap-3.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl"
          onClick={() => onViewChange('tree')}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onViewChange('tree')}
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 p-2 shadow-lg shadow-indigo-500/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img
              src="/assets/logo-icon.png"
              alt="Логотип МКурсы"
              width="48"
              height="48"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                МКурсы
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded-full border border-indigo-500/30">
                LMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Центр дополнительного образования
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => onViewChange('tree')}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              currentView === 'tree'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-300" />
            Карта знаний
          </button>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-300" />
            Личный кабинет
          </button>
          <button
            onClick={() => onViewChange('editor')}
            className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              currentView === 'editor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-300" />
            Конструктор
          </button>
        </nav>

        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-400" title="Стрик активности (дней подряд)">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{profile.streakDays} дн</span>
            </div>
            <span className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-indigo-400" title="Набранный опыт (XP)">
              <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
              <span>{profile.totalXp} XP</span>
            </div>
          </div>

          <button
            onClick={onToggleTeacherMode}
            className={`min-h-[44px] px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              isTeacherMode
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/40'
                : 'bg-slate-900/90 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Переключить режим интерфейса"
          >
            {isTeacherMode ? (
              <UserCheck className="w-4 h-4 text-purple-400" />
            ) : (
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            )}
            <span>{isTeacherMode ? 'Преподаватель' : 'Ученик'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
