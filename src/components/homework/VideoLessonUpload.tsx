import React, { useState } from 'react';
import { Video, PlusCircle } from 'lucide-react';
import { homeworkService } from '../../services/homeworkService';
import { HomeworkTask } from '../../types';

interface VideoLessonUploadProps {
  teacherId: string;
  teacherName: string;
  courseId: string;
  onTaskCreated: (task: HomeworkTask) => void;
}

export const VideoLessonUpload: React.FC<VideoLessonUploadProps> = ({
  teacherId,
  teacherName,
  courseId,
  onTaskCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [maxScore] = useState(100);
  const [criteriaText, setCriteriaText] = useState('Обоснованность решения\nВерные вычисления');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const criteria = criteriaText
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const task = homeworkService.createTask({
      lessonId: `lesson-${Date.now().toString(36)}`,
      courseId,
      teacherId,
      teacherName,
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim() || undefined,
      videoProvider: videoUrl.includes('vk.com') ? 'vk' : videoUrl.includes('rutube') ? 'rutube' : 'youtube',
      maxScore,
      deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      criteria,
    });

    onTaskCreated(task);
    setTitle('');
    setDescription('');
    setVideoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
        <Video className="w-5 h-5 text-[#0066FF]" />
        <span>Публикация видеоурока и выдача домашнего задания</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Тема занятия</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Например: Методы решения тригонометрических уравнений"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Ссылка на видеоролик (VK Video, RuTube, YouTube или прямой MP4)
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          placeholder="https://vk.com/video_ext.php?oid=..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Условие домашнего задания</label>
        <textarea
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Подробное задание для учеников группы..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Критерии проверки куратором (по одной строке на критерий)
        </label>
        <textarea
          rows={2}
          value={criteriaText}
          onChange={e => setCriteriaText(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
      >
        <PlusCircle className="w-4 h-4" /> Опубликовать видеоурок и ДЗ для групп
      </button>
    </form>
  );
};
