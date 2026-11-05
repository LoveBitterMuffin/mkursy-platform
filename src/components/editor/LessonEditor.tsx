import React, { useState } from 'react';
import { Save, Download, ArrowLeft, Check, Columns, Edit3, Eye } from 'lucide-react';
import { Lesson } from '../../types';
import { BlockEditorList } from './BlockEditorList';
import { LivePreviewPane } from './LivePreviewPane';

interface LessonEditorProps {
  initialLesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onBack: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialLesson,
  onSave,
  onBack,
}) => {
  const [lesson, setLesson] = useState<Lesson>(initialLesson);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  const handleSave = () => {
    onSave(lesson);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lesson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mkursy-lesson-${lesson.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[680px] bg-slate-950 text-slate-100 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Назад к списку уроков"
            aria-label="Назад к списку уроков"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={lesson.title}
            onChange={e => setLesson({ ...lesson, title: e.target.value })}
            className="bg-slate-950 border border-slate-700/80 px-4 py-2 rounded-xl text-sm font-black text-white focus:outline-none focus:border-indigo-500 w-72 sm:w-80 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'split' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Сплит 50/50
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Редактор
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Превью
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportJson}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" /> Экспорт
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[44px] px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Сохранено!' : 'Сохранить урок'}
          </button>
        </div>
      </div>

      <div className={`flex-1 p-6 overflow-hidden ${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'flex justify-center'}`}>
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`overflow-y-auto pr-3 space-y-5 ${viewMode === 'editor' ? 'max-w-3xl w-full' : ''}`}>
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1.5">
              <label className="block text-xs font-bold text-slate-400">Краткое описание урока:</label>
              <input
                type="text"
                value={lesson.description}
                onChange={e => setLesson({ ...lesson, description: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200"
              />
            </div>
            <BlockEditorList
              blocks={lesson.blocks}
              onChange={blocks => setLesson({ ...lesson, blocks })}
            />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`h-full ${viewMode === 'preview' ? 'max-w-3xl w-full' : ''}`}>
            <LivePreviewPane lesson={lesson} />
          </div>
        )}
      </div>
    </div>
  );
};
