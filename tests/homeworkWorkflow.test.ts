import { describe, it, expect, beforeEach } from 'vitest';
import { HomeworkService } from '../src/services/homeworkService';

describe('HomeworkWorkflow (AC-06, AC-07)', () => {
  let hw: HomeworkService;

  beforeEach(() => {
    hw = new HomeworkService([], []);
  });

  it('allows teacher to publish homework task with video lesson', () => {
    const task = hw.createTask({
      lessonId: 'lesson-101',
      courseId: 'ege-profile',
      teacherId: 'teacher-voronov',
      teacherName: 'Воронов Д. С.',
      title: 'Свойства логарифмов и ОДЗ',
      description: 'Решить уравнения №1-5 из методички МИФИ.',
      videoUrl: 'https://vk.com/video_ext.php?oid=-1&id=100',
      videoProvider: 'vk',
      maxScore: 100,
      deadline: '2026-11-20T18:00:00Z',
      criteria: ['Верное ОДЗ (40 б.)', 'Решение уравнения (60 б.)'],
    });

    expect(task.id).toBeDefined();
    expect(task.videoUrl).toContain('vk.com');
    expect(hw.getAllTasks().length).toBe(1);
  });

  it('allows student to submit solution to homework task', () => {
    const task = hw.createTask({
      lessonId: 'lesson-101',
      courseId: 'ege-profile',
      teacherId: 'teacher-voronov',
      teacherName: 'Воронов Д. С.',
      title: 'Задание 1',
      description: 'Тест',
      maxScore: 100,
      deadline: '2026-11-20T18:00:00Z',
      criteria: [],
    });

    const sub = hw.submitHomework(
      task.id,
      'student-ivan',
      'Иван Петров',
      'group-math-10-a',
      'ОДЗ: x > 3. Решение x = 5.'
    );

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe('submitted');
    expect(hw.getSubmissionsByGroup('group-math-10-a').length).toBe(1);
  });

  it('allows curator to review student submission with score and detailed feedback', () => {
    const sub = hw.submitHomework(
      'task-1',
      'student-ivan',
      'Иван Петров',
      'group-math-10-a',
      'x = 5'
    );

    const reviewed = hw.reviewSubmission({
      submissionId: sub.id,
      score: 95,
      status: 'approved',
      feedback: 'Отличное обоснование ОДЗ, оформлено строго по критериям ФИПИ.',
      reviewerId: 'curator-melnikova',
      reviewerName: 'Анна Мельникова',
      reviewedByRole: 'curator',
    });

    expect(reviewed.status).toBe('approved');
    expect(reviewed.score).toBe(95);
    expect(reviewed.feedback).toContain('ФИПИ');
    expect(reviewed.reviewedByRole).toBe('curator');
  });
});
