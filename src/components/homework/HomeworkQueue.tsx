import React, { useState } from 'react';
import { HomeworkSubmission, HomeworkStatus, UserRole } from '../../types';

interface HomeworkQueueProps {
  submissions: HomeworkSubmission[];
  reviewerRole: UserRole;
  reviewerId: string;
  reviewerName: string;
  onReview: (payload: {
    submissionId: string;
    score: number;
    status: HomeworkStatus;
    feedback: string;
    reviewerId: string;
    reviewerName: string;
    reviewedByRole: 'curator' | 'teacher';
  }) => void;
}

export const HomeworkQueue: React.FC<HomeworkQueueProps> = ({
  submissions,
  reviewerRole,
  reviewerId,
  reviewerName,
  onReview,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(submissions[0]?.id || null);
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('');

  const current = submissions.find(s => s.id === selectedId);

  const handleSave = (status: HomeworkStatus) => {
    if (!selectedId) return;
    onReview({
      submissionId: selectedId,
      score,
      status,
      feedback,
      reviewerId,
      reviewerName,
      reviewedByRole: reviewerRole === 'teacher' ? 'teacher' : 'curator',
    });
    setFeedback('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Очередь работ ({submissions.length})
        </h4>
        {submissions.map(sub => (
          <div
            key={sub.id}
            onClick={() => {
              setSelectedId(sub.id);
              setScore(sub.score || 90);
              setFeedback(sub.feedback || '');
            }}
            className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
              selectedId === sub.id
                ? 'bg-blue-50/80 dark:bg-slate-800 border-[#0066FF] text-slate-900 dark:text-white shadow-sm ring-1 ring-[#0066FF]/20'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="font-bold truncate text-slate-900 dark:text-white">{sub.studentName}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{sub.taskTitle}</div>
            <div className="mt-1 flex justify-between text-[10px]">
              <span className={sub.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                {sub.status === 'approved' ? 'Проверено' : 'На проверке'}
              </span>
              {sub.score !== undefined && <span className="font-bold text-slate-900 dark:text-white">{sub.score} б.</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        {current ? (
          <>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-[#0066FF] dark:text-indigo-400 uppercase">{current.taskTitle}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Ученик: {current.studentName}</h3>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
              <span className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">Решение ученика:</span>
              <p className="whitespace-pre-wrap leading-relaxed">{current.content}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Оценка (0-100 баллов):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Рецензия и рекомендации куратора:
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Укажите сильные стороны и ошибки в оформлении решения..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSave('approved')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Зачесть работу
                </button>
                <button
                  onClick={() => handleSave('revision_requested')}
                  className="py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  На доработку
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
            Нет доступных работ для проверки
          </div>
        )}
      </div>
    </div>
  );
};
