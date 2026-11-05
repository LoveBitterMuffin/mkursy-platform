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
        return 'bg-indigo-950/40 border-l-4 border-indigo-500 text-indigo-100 shadow-md shadow-indigo-950/20';
      case 'trap':
        return 'bg-rose-950/40 border-l-4 border-rose-500 text-rose-100 shadow-md shadow-rose-950/20';
      case 'property':
        return 'bg-amber-950/40 border-l-4 border-amber-500 text-amber-100 shadow-md shadow-amber-950/20';
      case 'info':
      default:
        return 'bg-slate-900/80 border-l-4 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
      {/* Top Device Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/80">
        <span className="text-xs font-bold text-slate-300">
          Предпросмотр для ученика (Live Preview)
        </span>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all ${
              device === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" /> Десктоп
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all ${
              device === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Смартфон
          </button>
        </div>
      </div>

      {/* Content Viewport */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-950/80">
        <div
          className={`w-full transition-all duration-300 ${
            device === 'mobile'
              ? 'max-w-[390px] bg-slate-900 border-4 border-slate-800 rounded-4xl p-6 shadow-2xl my-2'
              : 'max-w-2xl bg-transparent'
          }`}
        >
          <div className="border-b border-slate-800/80 pb-4 mb-6">
            <h2 className="text-xl font-black text-white mb-1.5">{lesson.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{lesson.description}</p>
          </div>

          <div className="space-y-5">
            {lesson.blocks.map(block => {
              if (block.type === 'text') {
                return (
                  <div key={block.id} className={`p-4 rounded-2xl text-sm leading-relaxed ${getCalloutStyles(block.calloutType)}`}>
                    <MathText text={block.content} />
                  </div>
                );
              }
              if (block.type === 'math') {
                return (
                  <div key={block.id} className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl flex justify-center shadow-md">
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
                <div key={block.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                  Видеоразбор: <a href={block.url} target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">{block.title}</a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
