import React from 'react';
import { Shield, GraduationCap, UserCheck, BookOpen } from 'lucide-react';
import { UserRole, User } from '../../types';

interface RoleSwitcherProps {
  currentUser: User | null;
  onSwitchRole: (role: UserRole) => void;
}

const roles: Array<{ role: UserRole; label: string; icon: React.FC<{ className?: string }> }> = [
  { role: 'student', label: 'Ученик', icon: GraduationCap },
  { role: 'curator', label: 'Куратор', icon: UserCheck },
  { role: 'teacher', label: 'Преподаватель', icon: BookOpen },
  { role: 'admin', label: 'Администратор', icon: Shield },
];

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUser, onSwitchRole }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
      <span className="text-slate-400 px-2 hidden lg:inline">Роль:</span>
      {roles.map(({ role, label, icon: Icon }) => {
        const isActive = currentUser?.role === role;
        return (
          <button
            key={role}
            onClick={() => onSwitchRole(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#146CC4] text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={`Переключить роль на: ${label}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
