import React from 'react';
import { Shield, GraduationCap, UserCheck, BookOpen, Terminal, ChevronDown } from 'lucide-react';
import { UserRole, User } from '../../types';

interface RoleDropdownProps {
  currentUser: User | null;
  onSwitchRole: (role: UserRole) => void;
}

const roleConfigs: Record<UserRole, { label: string; badge: string; icon: React.FC<{ className?: string }> }> = {
  student: { label: 'Ученик', badge: 'Обучение', icon: GraduationCap },
  curator: { label: 'Куратор', badge: '10 учеников', icon: UserCheck },
  teacher: { label: 'Преподаватель', badge: 'Видео и ДЗ', icon: BookOpen },
  admin: { label: 'Администратор', badge: 'CRM и группы', icon: Shield },
  developer: { label: 'Разработчик', badge: 'DevTools', icon: Terminal },
};

export const RoleDropdown: React.FC<RoleDropdownProps> = ({ currentUser, onSwitchRole }) => {
  const currentRole = currentUser?.role || 'student';
  const CurrentIcon = roleConfigs[currentRole]?.icon || GraduationCap;

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#0066FF]">
        <CurrentIcon className="w-4 h-4 text-[#0066FF] shrink-0" />
        <span className="text-xs font-semibold hidden md:inline text-slate-500 dark:text-slate-400">
          Роль:
        </span>
        <select
          value={currentRole}
          onChange={e => onSwitchRole(e.target.value as UserRole)}
          aria-label="Выбор роли пользователя"
          className="bg-transparent text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none appearance-none pr-5 py-0.5"
        >
          {Object.entries(roleConfigs).map(([rKey, { label }]) => (
            <option key={rKey} value={rKey} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
              {label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-4" />
      </div>
    </div>
  );
};
