import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Maximize2, Minimize2 } from 'lucide-react';
import { SkillCategory } from '../../types';

interface SkillTreeControlsProps {
  selectedCategory: SkillCategory | 'all';
  onSelectCategory: (cat: SkillCategory | 'all') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const categories: Array<{ id: SkillCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Все разделы' },
  { id: 'algebra', label: 'Алгебра' },
  { id: 'geometry', label: 'Геометрия' },
  { id: 'calculus', label: 'Функции и Анализ' },
  { id: 'olympiad', label: 'ОГЭ / ЕГЭ Профиль' },
];

export const SkillTreeControls: React.FC<SkillTreeControlsProps> = ({
  selectedCategory,
  onSelectCategory,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
}) => (
  <div className="absolute top-5 left-5 right-5 z-30 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
    <div className="flex items-center gap-2 p-2 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-lg pointer-events-auto">
      <div className="flex items-center gap-1.5 px-2 text-slate-500 dark:text-slate-400 font-semibold text-xs">
        <Filter className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" />
        <span>Разделы:</span>
      </div>
      {categories.map(cat => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelectCategory(cat.id)}
          className={`min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl ${
            selectedCategory === cat.id
              ? 'bg-[#0066FF] text-white shadow-md font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-1.5 p-1.5 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-lg pointer-events-auto">
      <button
        type="button"
        onClick={onZoomIn}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
        title="Увеличить масштаб"
        aria-label="Увеличить масштаб"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
        title="Уменьшить масштаб"
        aria-label="Уменьшить масштаб"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onResetZoom}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
        title="Сброс масштаба"
        aria-label="Сбросить масштаб"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#0066FF] dark:text-indigo-400 hover:text-blue-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl"
        title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
        aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  </div>
);
