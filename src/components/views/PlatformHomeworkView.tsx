import React, { useState } from 'react';
import { VideoLessonUpload } from '../homework/VideoLessonUpload';
import { HomeworkQueue } from '../homework/HomeworkQueue';
import { HomeworkSubmit } from '../homework/HomeworkSubmit';
import { homeworkService } from '../../services/homeworkService';
import { User, HomeworkTask, HomeworkSubmission } from '../../types';

interface PlatformHomeworkViewProps {
  currentUser: User | null;
}

export const PlatformHomeworkView: React.FC<PlatformHomeworkViewProps> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<HomeworkTask[]>(homeworkService.getAllTasks());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(
    homeworkService.getSubmissionsByGroup('group-math-10-a')
  );

  const role = currentUser?.role || 'student';
  const currentTask = tasks[0];

  const handleTaskCreated = (_newTask: HomeworkTask) => {
    setTasks(homeworkService.getAllTasks());
  };

  const handleSubmitted = (newSub: HomeworkSubmission) => {
    setSubmissions(homeworkService.getSubmissionsByGroup(newSub.groupId));
  };

  const handleReview = (payload: Parameters<typeof homeworkService.reviewSubmission>[0]) => {
    homeworkService.reviewSubmission(payload);
    setSubmissions([...homeworkService.getSubmissionsByGroup('group-math-10-a')]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Видеоуроки и проверка домашних заданий</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Преподаватели записывают видео и выдают ДЗ. Кураторы групп проверяют работы и дают рецензии.
          </p>
        </div>
      </div>

      {role === 'teacher' && (
        <div className="space-y-6">
          <VideoLessonUpload
            teacherId={currentUser?.id || 'teacher-default'}
            teacherName={currentUser?.name || 'Преподаватель МКурсы'}
            courseId="ege-profile"
            onTaskCreated={handleTaskCreated}
          />
          <HomeworkQueue
            submissions={submissions}
            reviewerRole="teacher"
            reviewerId={currentUser?.id || 'teacher-default'}
            reviewerName={currentUser?.name || 'Преподаватель'}
            onReview={handleReview}
          />
        </div>
      )}

      {role === 'curator' && (
        <HomeworkQueue
          submissions={submissions}
          reviewerRole="curator"
          reviewerId={currentUser?.id || 'curator-default'}
          reviewerName={currentUser?.name || 'Куратор группы'}
          onReview={handleReview}
        />
      )}

      {role === 'student' && currentTask && (
        <HomeworkSubmit
          task={currentTask}
          studentId={currentUser?.id || 'student-default'}
          studentName={currentUser?.name || 'Ученик группы'}
          groupId={currentUser?.groupId || 'group-math-10-a'}
          onSubmitted={handleSubmitted}
        />
      )}

      {role === 'admin' && (
        <HomeworkQueue
          submissions={submissions}
          reviewerRole="teacher"
          reviewerId={currentUser?.id || 'admin-default'}
          reviewerName="Администратор"
          onReview={handleReview}
        />
      )}
    </div>
  );
};
