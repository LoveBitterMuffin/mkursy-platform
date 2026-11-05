import React from 'react';
import { Compass, LayoutDashboard, Edit3, Flame, Zap, UserCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800 backdrop-blur-md select-none">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('tree')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/logo-m.png"
              alt="МКурсы"
              className="w-full h-full object-contain"
              onError={e => {
                // Fallback text if image cannot be loaded
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-extrabold text-white text-lg">М</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">МКурсы</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                LMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Центр математики (5–11 кл)</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onViewChange('tree')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentView === 'tree'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Карта знаний
          </button>
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Личный кабинет
          </button>
          <button
            onClick={() => onViewChange('editor')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentView === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Конструктор
          </button>
        </nav>

        {/* User Stats & Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-400" title="Стрик активности (дней подряд)">
              <Flame className="w-4 h-4 fill-amber-400" /> {profile.streakDays} дн
            </span>
            <span className="w-px h-3.5 bg-slate-700" />
            <span className="flex items-center gap-1 text-indigo-400" title="Набранный опыт (XP)">
              <Zap className="w-4 h-4 fill-indigo-400" /> {profile.totalXp} XP
            </span>
          </div>

          <button
            onClick={onToggleTeacherMode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTeacherMode
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Переключить интерфейс"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {isTeacherMode ? 'Преподаватель' : 'Ученик'}
          </button>
        </div>
      </div>
    </header>
  );
};
