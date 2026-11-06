import React from 'react';
import { Compass, LayoutDashboard, Edit3, BookOpen, Users, Briefcase, FileCheck, LogIn, Terminal } from 'lucide-react';
import { StudentProfile, User, UserRole, AppView, getViewsForRole } from '../../types';
import logoIcon from '../../assets/logo-icon.png';
import { RoleDropdown } from '../auth/RoleDropdown';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  profile: StudentProfile;
  currentUser?: User | null;
  onSwitchRole?: (role: UserRole) => void;
  onOpenAuth?: () => void;
  isTeacherMode?: boolean;
  onToggleTeacherMode?: () => void;
}

const allViewConfigs: Record<AppView, { label: string; icon: React.FC<{ className?: string }> }> = {
  tree: { label: 'Карта знаний', icon: Compass },
  homework: { label: 'ДЗ и Видео', icon: FileCheck },
  groups: { label: 'Группы (10)', icon: Users },
  dashboard: { label: 'Личный кабинет', icon: LayoutDashboard },
  courses: { label: 'Программы курсов', icon: BookOpen },
  crm: { label: 'CRM', icon: Briefcase },
  editor: { label: 'Конструктор', icon: Edit3 },
  devtools: { label: 'DevTools', icon: Terminal },
  player: { label: 'Урок', icon: Compass },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  currentUser = null,
  onSwitchRole = () => {},
  onOpenAuth = () => {},
}) => {
  const role = currentUser?.role || 'student';
  const allowedViews = getViewsForRole(role).filter(v => v !== 'player');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
        <div
          role="button"
          tabIndex={0}
          aria-label="Главная страница МКурсы"
          className="flex items-center gap-3 cursor-pointer group focus-visible:outline-none"
          onClick={() => onViewChange('tree')}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onViewChange('tree')}
        >
          <div className="h-11 w-11 rounded-xl bg-white border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={logoIcon} alt="Логотип МКурсы" width="40" height="40" className="object-contain" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors">
              МКурсы
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Центр дополнительного образования
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-inner">
          {allowedViews.map(viewId => {
            const config = allViewConfigs[viewId];
            const Icon = config.icon;
            const isActive = currentView === viewId;
            return (
              <button
                key={viewId}
                onClick={() => onViewChange(viewId)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <RoleDropdown currentUser={currentUser} onSwitchRole={onSwitchRole} />
          <ThemeToggle />
          <button
            onClick={onOpenAuth}
            aria-label="Авторизация"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl transition-colors shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#0066FF]" />
            <span className="hidden md:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Вход'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
