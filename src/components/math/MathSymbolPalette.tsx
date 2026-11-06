import React, { useState } from 'react';

export interface MathSymbolItem {
  label: string;
  insert: string;
  tooltip?: string;
}

export interface MathSymbolPaletteProps {
  onSelectSymbol: (symbol: string) => void;
  className?: string;
}

interface PaletteGroup {
  id: string;
  title: string;
  symbols: MathSymbolItem[];
}

const GROUPS: PaletteGroup[] = [
  {
    id: 'algebra',
    title: 'Алгебра',
    symbols: [
      { label: 'a/b', insert: '\\frac{a}{b}', tooltip: 'Дробь' },
      { label: 'x²', insert: 'x^{2}', tooltip: 'Квадрат' },
      { label: 'xⁿ', insert: 'x^{n}', tooltip: 'Степень n' },
      { label: '√x', insert: '\\sqrt{x}', tooltip: 'Квадратный корень' },
      { label: 'ⁿ√x', insert: '\\sqrt[n]{x}', tooltip: 'Корень n-й степени' },
      { label: '±', insert: '\\pm ', tooltip: 'Плюс-минус' },
      { label: '·', insert: '\\cdot ', tooltip: 'Умножение' },
    ],
  },
  {
    id: 'compare',
    title: 'Сравнение',
    symbols: [
      { label: '≤', insert: '\\le ', tooltip: 'Меньше или равно' },
      { label: '≥', insert: '\\ge ', tooltip: 'Больше или равно' },
      { label: '≠', insert: '\\neq ', tooltip: 'Не равно' },
      { label: '≈', insert: '\\approx ', tooltip: 'Приблизительно' },
      { label: '∞', insert: '\\infty ', tooltip: 'Бесконечность' },
    ],
  },
  {
    id: 'functions',
    title: 'Функции и греческие',
    symbols: [
      { label: 'sin', insert: '\\sin(x)', tooltip: 'Синус' },
      { label: 'cos', insert: '\\cos(x)', tooltip: 'Косинус' },
      { label: 'tan', insert: '\\tan(x)', tooltip: 'Тангенс' },
      { label: 'π', insert: '\\pi ', tooltip: 'Число Пи' },
      { label: 'α', insert: '\\alpha ', tooltip: 'Альфа' },
      { label: 'β', insert: '\\beta ', tooltip: 'Бета' },
    ],
  },
];

export const MathSymbolPalette: React.FC<MathSymbolPaletteProps> = ({
  onSelectSymbol,
  className = '',
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('algebra');
  const currentGroup = GROUPS.find((g) => g.id === activeGroup) ?? GROUPS[0];

  return (
    <div className={`p-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md backdrop-blur ${className}`}>
      <div className="flex gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-2 overflow-x-auto">
        {GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroup(group.id)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeGroup === group.id
                ? 'bg-brand-purple text-white shadow-sm shadow-brand-purple/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {currentGroup.symbols.map((sym, idx) => (
          <button
            key={`${sym.label}-${idx}`}
            type="button"
            title={sym.tooltip ?? sym.insert}
            onClick={() => onSelectSymbol(sym.insert)}
            className="px-2.5 py-1.5 min-w-[38px] text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center"
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
};
