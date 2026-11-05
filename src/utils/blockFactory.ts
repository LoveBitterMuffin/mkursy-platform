import { LessonBlock } from '../types';

export const createDefaultBlock = (type: LessonBlock['type'], id: string): LessonBlock => {
  switch (type) {
    case 'math':
      return { id, type: 'math', latex: 'f(x) = x^2' };
    case 'plot':
      return {
        id,
        type: 'plot',
        title: 'График функции',
        fnExpression: 'a * x^2 + b * x + c',
        params: [
          { name: 'a', label: 'Коэффициент a', min: -5, max: 5, step: 0.5, value: 1 },
          { name: 'b', label: 'Коэффициент b', min: -5, max: 5, step: 0.5, value: 0 },
          { name: 'c', label: 'Коэффициент c', min: -5, max: 5, step: 0.5, value: 0 },
        ],
      };
    case 'quiz':
      return {
        id,
        type: 'quiz',
        question: 'Вопрос по пройденной теме?',
        options: ['Вариант A', 'Вариант B', 'Вариант C'],
        correctOptionIndex: 0,
        hints: ['Подсказка к задаче'],
        explanation: 'Объяснение решения',
      };
    case 'video':
      return { id, type: 'video', title: 'Видеоразбор', url: 'https://youtube.com', durationMinutes: 10 };
    case 'text':
    default:
      return { id, type: 'text', content: 'Новый текстовый параграф с формулой $x^2$.', calloutType: 'info' };
  }
};
