import { HomeworkTask, HomeworkSubmission } from '../types';

export const initialHomeworkTasks: HomeworkTask[] = [
  {
    id: 'task-parabola-1',
    lessonId: 'lesson-parabola',
    courseId: 'ege-profile',
    teacherId: 'user-teacher-voronov',
    teacherName: 'Д. С. Воронов',
    title: 'Исследование квадратичной функции и экстремумы',
    description: 'Постройте график функции f(x) = -2x^2 + 4x + 1. Найдите вершину параболы и ось симметрии.',
    videoUrl: 'https://vk.com/video_ext.php?oid=-123456&id=456239017',
    videoProvider: 'vk',
    maxScore: 100,
    deadline: '2026-11-15T23:59:00Z',
    criteria: [
      'Верное нахождение координат вершины (25 б.)',
      'Определение корней и точек пересечения с осями (25 б.)',
      'Построение графика с масштабом (25 б.)',
      'Вывод об интервалах монотонности (25 б.)',
    ],
    createdAt: '2026-11-01T12:00:00Z',
  },
];

export const initialHomeworkSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-001',
    taskId: 'task-parabola-1',
    taskTitle: 'Исследование квадратичной функции и экстремумы',
    studentId: 'user-student-ivan',
    studentName: 'Иван Петров',
    groupId: 'group-math-10-a',
    content: 'Вершина x0 = -b/(2a) = -4/(-4) = 1. y0 = f(1) = 3. Точки графика построены в тетради.',
    status: 'submitted',
    submittedAt: '2026-11-05T16:20:00Z',
  },
];
