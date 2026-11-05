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
    <div className="flex flex-col h-[calc(100vh-80px)] min-h-[650px] bg-slate-950 text-slate-100">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Назад"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={lesson.title}
            onChange={e => setLesson({ ...lesson, title: e.target.value })}
            className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-indigo-500 w-80"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportJson}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Экспорт JSON
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {savedSuccess ? 'Сохранено!' : 'Сохранить урок'}
          </button>
        </div>
      </div>

      {/* Split-View Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Left: Block Editor */}
        <div className="overflow-y-auto pr-2 space-y-4">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Краткое описание урока:</label>
            <input
              type="text"
              value={lesson.description}
              onChange={e => setLesson({ ...lesson, description: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
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
