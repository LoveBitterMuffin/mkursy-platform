import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Lesson } from '../../types';
import { MathFormula, MathText, InteractivePlot, QuizBlock } from '../math';

interface LivePreviewPaneProps {
  lesson: Lesson;
}

export const LivePreviewPane: React.FC<LivePreviewPaneProps> = ({ lesson }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const getCalloutStyles = (type?: string) => {
    switch (type) {
      case 'theorem':
        return 'bg-indigo-950/30 border-l-4 border-indigo-500 text-indigo-100';
      case 'trap':
        return 'bg-rose-950/30 border-l-4 border-rose-500 text-rose-100';
      case 'property':
        return 'bg-amber-950/30 border-l-4 border-amber-500 text-amber-100';
      case 'info':
      default:
        return 'bg-slate-900/60 border-l-4 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Top Device Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-300">
          Предпросмотр для ученика (Live Preview)
        </span>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
              device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Десктоп
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
              device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Смартфон
          </button>
        </div>
      </div>

      {/* Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-slate-950/80">
        <div
          className={`w-full transition-all duration-300 ${
            device === 'mobile'
              ? 'max-w-[375px] bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl my-2'
              : 'max-w-2xl bg-transparent'
          }`}
        >
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-lg font-bold text-white mb-1">{lesson.title}</h2>
            <p className="text-xs text-slate-400">{lesson.description}</p>
          </div>

          <div className="space-y-4">
            {lesson.blocks.map(block => {
              if (block.type === 'text') {
                return (
                  <div key={block.id} className={`p-3.5 rounded-lg text-sm leading-relaxed ${getCalloutStyles(block.calloutType)}`}>
                    <MathText text={block.content} />
                  </div>
                );
              }
              if (block.type === 'math') {
                return (
                  <div key={block.id} className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-center">
                    <MathFormula latex={block.latex} displayMode />
                  </div>
                );
              }
              if (block.type === 'plot') {
                return (
                  <div key={block.id}>
                    <InteractivePlot
                      title={block.title}
                      fnExpression={block.fnExpression}
                      params={block.params}
                    />
                  </div>
                );
              }
              if (block.type === 'quiz') {
                return <QuizBlock key={block.id} block={block} />;
              }
              return (
                <div key={block.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                  Видеоразбор: <a href={block.url} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{block.title}</a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
