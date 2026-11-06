import React, { useState } from 'react';
import { X, UserPlus, LogIn, CheckCircle } from 'lucide-react';
import { UserRole, User } from '../../types';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (tab === 'register') {
        const user = authService.register({ name, email, role });
        onAuthSuccess(user);
        onClose();
      } else {
        const user = authService.login({ email });
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка аутентификации';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Закрыть окно"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-5 text-sm font-semibold">
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
              tab === 'register' ? 'bg-[#0066FF] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Регистрация
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
              tab === 'login' ? 'bg-[#0066FF] text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" /> Вход в систему
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ФИО пользователя</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Иванов Петр Сергеевич"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Рабочий Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Роль в центре «МКурсы»</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="student">Ученик (обучение в группе)</option>
                <option value="curator">Куратор (сопровождение 10 учеников)</option>
                <option value="teacher">Преподаватель (видео, ДЗ, группы)</option>
                <option value="admin">Администратор (CRM и система)</option>
                <option value="developer">Разработчик (DevTools и шина данных)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#FF8800] hover:bg-[#e07800] text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {tab === 'register' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};
