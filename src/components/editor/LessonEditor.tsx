import React, { useState } from 'react';
import { Save, Download, ArrowLeft, Check } from 'lucide-react';
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
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Назад"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={lesson.title}
            onChange={e => setLesson({ ...lesson, title: e.target.value })}
            className="bg-slate-950 border border-slate-700/80 px-4 py-2 rounded-xl text-sm font-black text-white focus:outline-none focus:border-indigo-500 w-80 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportJson}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" /> Экспорт JSON
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Сохранено!' : 'Сохранить урок'}
          </button>
        </div>
      </div>

      {/* Split-View Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Left: Block Editor */}
        <div className="overflow-y-auto pr-3 space-y-5">
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

        {/* Right: Live Preview */}
        <div className="h-full">
          <LivePreviewPane lesson={lesson} />
        </div>
      </div>
    </div>
  );
};
