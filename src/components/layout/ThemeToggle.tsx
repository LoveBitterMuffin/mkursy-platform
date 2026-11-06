import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Переключить тему оформления"
      title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
      className="p-2 rounded-xl border transition-all flex items-center justify-center bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 shadow-sm"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-[#0066FF] animate-in fade-in" />
      )}
    </button>
  );
};
