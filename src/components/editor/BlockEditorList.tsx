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
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Добавить:
        </span>
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
        >
          <Type className="w-3 h-3 text-indigo-400" /> Текст
        </button>
        <button
          type="button"
          onClick={() => addBlock('math')}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
        >
          <Sigma className="w-3 h-3 text-emerald-400" /> Формулу
        </button>
        <button
          type="button"
          onClick={() => addBlock('plot')}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
        >
          <LineChart className="w-3 h-3 text-amber-400" /> График
        </button>
        <button
          type="button"
          onClick={() => addBlock('quiz')}
          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3 text-purple-400" /> Квиз
        </button>
      </div>

      <div className="space-y-3">
        {blocks.map((block, idx) => (
          <div key={block.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                #{idx + 1} {block.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveBlock(idx, 'up')}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === blocks.length - 1}
                  onClick={() => moveBlock(idx, 'down')}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteBlock(idx)}
                  className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
