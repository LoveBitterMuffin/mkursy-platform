import React, { useState } from 'react';
import { Send, CheckCircle2, PlayCircle, ExternalLink } from 'lucide-react';
import { HomeworkTask, HomeworkSubmission } from '../../types';
import { homeworkService } from '../../services/homeworkService';

interface HomeworkSubmitProps {
  task: HomeworkTask;
  studentId: string;
  studentName: string;
  groupId: string;
  onSubmitted: (submission: HomeworkSubmission) => void;
}

export const HomeworkSubmit: React.FC<HomeworkSubmitProps> = ({
  task,
  studentId,
  studentName,
  groupId,
  onSubmitted,
}) => {
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const sub = homeworkService.submitHomework(
      task.id,
      studentId,
      studentName,
      groupId,
      content.trim()
    );

    setIsSuccess(true);
    onSubmitted(sub);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-bold uppercase text-[#0066FF] dark:text-[#0DA0E3]">Задание для группы</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{task.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{task.description}</p>
      </div>

      {task.videoUrl && (
        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0066FF] dark:text-blue-300">
            <PlayCircle className="w-4 h-4 text-[#0066FF] dark:text-[#0DA0E3]" />
            <span>Видеоразбор от преподавателя ({task.teacherName})</span>
          </div>
          <a
            href={task.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-[#0066FF] dark:text-[#0DA0E3] hover:underline"
          >
            <span>Смотреть</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {task.criteria && task.criteria.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Критерии проверки:</div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5 list-disc list-inside">
            {task.criteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Ваше решение задачи (формулы, пояснения, ответ):
        </label>
        <textarea
          rows={4}
          required
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Шаг 1: Запишем ОДЗ уравнения... Шаг 2: Применим формулу..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
        />

        <button
          type="submit"
          className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#e06c00] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <Send className="w-4 h-4" /> Отправить на проверку куратору
        </button>

        {isSuccess && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Решение отправлено! Куратор группы проверит его в течение 24 часов.</span>
          </div>
        )}
      </form>
    </div>
  );
};
