import React from 'react';
import { LessonBlock } from '../../types';
import { MathSymbolPalette } from '../math/MathSymbolPalette';

export const BlockForm: React.FC<{ block: LessonBlock; onChange: (updated: LessonBlock) => void }> = ({
  block,
  onChange,
}) => {
  if (block.type === 'text') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Тип выделения:</label>
          <select
            value={block.calloutType || 'info'}
            onChange={e => onChange({ ...block, calloutType: e.target.value as any })}
            className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200"
          >
            <option value="info">Обычный текст</option>
            <option value="theorem">Теорема</option>
            <option value="trap">Ловушка на ЕГЭ/ОГЭ</option>
            <option value="property">Свойство / Правило</option>
          </select>
        </div>
        <textarea
          value={block.content}
          onChange={e => onChange({ ...block, content: e.target.value })}
          placeholder="Текст с формулами $a^2 + b^2 = c^2$..."
          rows={3}
          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-sans"
        />
      </div>
    );
  }

  if (block.type === 'math') {
    return (
      <div className="space-y-2">
        <textarea
          value={block.latex}
          onChange={e => onChange({ ...block, latex: e.target.value })}
          placeholder="LaTeX формула, например: f(x) = \frac{-b \pm \sqrt{D}}{2a}"
          rows={2}
          className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-indigo-300"
        />
        <MathSymbolPalette onSelectSymbol={(sym: string) => onChange({ ...block, latex: block.latex + sym })} />
      </div>
    );
  }

  if (block.type === 'plot') {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={block.title}
          onChange={e => onChange({ ...block, title: e.target.value })}
          placeholder="Заголовок графика"
          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
        />
        <input
          type="text"
          value={block.fnExpression}
          onChange={e => onChange({ ...block, fnExpression: e.target.value })}
          placeholder="Формула функции: a * x^2 + b * x + c"
          className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2 text-amber-300"
        />
      </div>
    );
  }

  if (block.type === 'quiz') {
    return (
      <div className="space-y-2 text-xs">
        <input
          type="text"
          value={block.question}
          onChange={e => onChange({ ...block, question: e.target.value })}
          placeholder="Вопрос квиза (поддерживает $формулы$)"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
        />
        {block.options && block.options.length > 0 ? (
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Варианты ответа (отметьте верный):</span>
            {block.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name={`correct-${block.id}`}
                  checked={block.correctOptionIndex === i}
                  onChange={() => onChange({ ...block, correctOptionIndex: i })}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => {
                    const next = [...block.options];
                    next[i] = e.target.value;
                    onChange({ ...block, options: next });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={block.mathAnswer || ''}
            onChange={e => onChange({ ...block, mathAnswer: e.target.value })}
            placeholder="Точный ответ (число или дробь, например: 0.5 или 1/2)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-emerald-300 font-mono"
          />
        )}
      </div>
    );
  }

  if (block.type === 'photo_submission') {
    return (
      <div className="space-y-2 text-xs">
        <label className="block text-slate-400 font-semibold">Условие задачи части «С» для решения в тетради:</label>
        <textarea
          value={block.prompt}
          onChange={e => onChange({ ...block, prompt: e.target.value })}
          rows={2}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
        />
        <input
          type="text"
          value={block.criteria || ''}
          onChange={e => onChange({ ...block, criteria: e.target.value })}
          placeholder="Критерии ФИПИ (макс. первичных баллов)"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      value={block.url}
      onChange={e => onChange({ ...block, url: e.target.value })}
      placeholder="Ссылка на видео (YouTube / Rutube)"
      className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
    />
  );
};
