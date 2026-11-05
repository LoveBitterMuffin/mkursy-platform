import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizBlock } from '../src/components/math/QuizBlock';
import { LessonBlock } from '../src/types';

describe('QuizBlock Component', () => {
  const choiceBlock: Extract<LessonBlock, { type: 'quiz' }> = {
    id: 'q1',
    type: 'quiz',
    question: 'Сколько корней имеет уравнение $x^2 - 4 = 0$?',
    options: ['Один корень', 'Два корня', 'Нет корней'],
    correctOptionIndex: 1,
    hints: ['Разложите как разность квадратов $(x-2)(x+2)=0$.'],
    explanation: 'Корни уравнения: $x_1 = 2, x_2 = -2$. Всего два корня.'
  };

  const inputBlock: Extract<LessonBlock, { type: 'quiz' }> = {
    id: 'q2',
    type: 'quiz',
    question: 'Вычислите значение дроби $1/4 + 1/4$:',
    options: [],
    correctOptionIndex: 0,
    mathAnswer: '0.5',
    hints: ['Сложите числители при одинаковом знаменателе: $2/4$.'],
    explanation: '$2/4$ сокращается до $1/2$ или $0.5$.'
  };

  it('renders choice quiz and handles correct selection', () => {
    const onComplete = vi.fn();
    render(<QuizBlock block={choiceBlock} onComplete={onComplete} />);

    expect(screen.getByText(/Сколько корней имеет уравнение/i)).toBeInTheDocument();
    const option = screen.getByText(/Два корня/i);
    fireEvent.click(option);

    const submitBtn = screen.getByText(/Проверить ответ/i);
    fireEvent.click(submitBtn);

    expect(onComplete).toHaveBeenCalledWith(true, 25);
    expect(screen.getByText(/Ответ абсолютно верный/i)).toBeInTheDocument();
  });

  it('handles math input with fractional equivalence', () => {
    const onComplete = vi.fn();
    render(<QuizBlock block={inputBlock} onComplete={onComplete} />);

    const input = screen.getByPlaceholderText(/Введите число или дробь/i);
    fireEvent.change(input, { target: { value: '1/2' } });

    const submitBtn = screen.getByText(/Ответить/i);
    fireEvent.click(submitBtn);

    expect(onComplete).toHaveBeenCalledWith(true, 25);
  });

  it('reveals hints sequentially', () => {
    render(<QuizBlock block={choiceBlock} />);

    const hintBtn = screen.getByText(/Подсказка \(1\/1\)/i);
    fireEvent.click(hintBtn);

    expect(screen.getByText(/Разложите как разность квадратов/i)).toBeInTheDocument();
  });
});
