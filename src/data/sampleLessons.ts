import { Lesson } from '../types';

export const sampleLessonParabola: Lesson = {
  id: 'lesson-parabola',
  skillId: 'parabola-quad',
  title: 'Квадратичная функция и свойства параболы',
  description: 'Исследование графика y = ax² + bx + c, влияние коэффициентов и поиск вершины',
  estimatedMinutes: 25,
  blocks: [
    {
      id: 'block-1',
      type: 'text',
      calloutType: 'theorem',
      content:
        'Графиком квадратичной функции является парабола. Знак старшего коэффициента a определяет направление ветвей: вверх при a > 0 и вниз при a < 0.',
    },
    {
      id: 'block-2',
      type: 'math',
      latex: 'x_0 = -\\frac{b}{2a}, \\quad y_0 = f(x_0), \\quad D = b^2 - 4ac',
      caption: 'Координаты вершины параболы и дискриминант',
      explanation: 'Точка (x₀, y₀) является вершиной параболы и экстремумом функции на всей числовой оси.',
    },
    {
      id: 'block-3',
      type: 'plot',
      title: 'Интерактивная парабола f(x) = ax² + bx + c',
      fnExpression: 'a * x^2 + b * x + c',
      params: [
        { name: 'a', label: 'a (ветви и кривизна)', min: -3, max: 3, step: 0.1, value: 1 },
        { name: 'b', label: 'b (сдвиг вершины)', min: -6, max: 6, step: 0.5, value: 0 },
        { name: 'c', label: 'c (пересечение с Oy)', min: -5, max: 5, step: 0.5, value: -2 },
      ],
    },
    {
      id: 'block-4',
      type: 'quiz',
      question:
        'Как изменится график функции f(x) = ax² + bx + c, если старший коэффициент a изменится с 1 на -1?',
      options: [
        'Ветви параболы развернутся вниз',
        'Парабола сместится вправо на 2 единицы',
        'График превратится в прямую линию',
        'График не изменится',
      ],
      correctOptionIndex: 0,
      hints: ['Вспомните фундаментальное свойство старшего коэффициента квадратичной функции.'],
      explanation:
        'Старший коэффициент a отвечает за направление ветвей: при a > 0 ветви направлены вверх, а при a < 0 ветви направлены вниз.',
    },
  ],
};
