import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Type, Sigma, LineChart, HelpCircle } from 'lucide-react';
import { LessonBlock } from '../../types';
import { BlockForm } from './BlockForm';

interface BlockEditorListProps {
  blocks: LessonBlock[];
  onChange: (blocks: LessonBlock[]) => void;
}

export const BlockEditorList: React.FC<BlockEditorListProps> = ({ blocks, onChange }) => {
  const addBlock = (type: LessonBlock['type']) => {
    const id = `b_${Date.now()}`;
    let newBlock: LessonBlock;

    switch (type) {
      case 'math':
        newBlock = { id, type: 'math', latex: 'f(x) = x^2' };
        break;
      case 'plot':
        newBlock = {
          id,
          type: 'plot',
          title: 'График функции',
          fnExpression: 'a * x^2 + b * x + c',
          params: [
            { name: 'a', label: 'Коэффициент a', min: -5, max: 5, step: 0.5, value: 1 },
            { name: 'b', label: 'Коэффициент b', min: -5, max: 5, step: 0.5, value: 0 },
            { name: 'c', label: 'Коэффициент c', min: -5, max: 5, step: 0.5, value: 0 },
          ],
        };
        break;
      case 'quiz':
        newBlock = {
          id,
          type: 'quiz',
          question: 'Вопрос по пройденной теме?',
          options: ['Вариант A', 'Вариант B', 'Вариант C'],
          correctOptionIndex: 0,
          hints: ['Подсказка к задаче'],
          explanation: 'Объяснение решения',
        };
        break;
      case 'video':
        newBlock = { id, type: 'video', title: 'Видеоразбор', url: 'https://youtube.com', durationMinutes: 10 };
        break;
      case 'text':
      default:
        newBlock = { id, type: 'text', content: 'Новый текстовый параграф с формулой $x^2$.', calloutType: 'info' };
        break;
    }

    onChange([...blocks, newBlock]);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updated: LessonBlock) => {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-sm">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5 pl-1">
          <Plus className="w-4 h-4 text-indigo-400" /> Добавить:
        </span>
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Type className="w-3.5 h-3.5 text-indigo-400" /> Текст
        </button>
        <button
          type="button"
          onClick={() => addBlock('math')}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Sigma className="w-3.5 h-3.5 text-emerald-400" /> Формулу
        </button>
        <button
          type="button"
          onClick={() => addBlock('plot')}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <LineChart className="w-3.5 h-3.5 text-amber-400" /> График
        </button>
        <button
          type="button"
          onClick={() => addBlock('quiz')}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Квиз
        </button>
      </div>

      <div className="space-y-3.5">
        {blocks.map((block, idx) => (
          <div key={block.id} className="p-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] text-indigo-300 font-mono">
                  {idx + 1}
                </span>
                {block.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveBlock(idx, 'up')}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-25 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Поднять выше"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === blocks.length - 1}
                  onClick={() => moveBlock(idx, 'down')}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-25 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Опустить ниже"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteBlock(idx)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors ml-1"
                  title="Удалить блок"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <BlockForm block={block} onChange={up => updateBlock(idx, up)} />
          </div>
        ))}
      </div>
    </div>
  );
};
