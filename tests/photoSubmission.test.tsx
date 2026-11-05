import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoSubmissionBlock } from '../src/components/math/PhotoSubmissionBlock';
import { PhotoSubmissionBlock as PhotoSubmissionBlockType } from '../src/types';

describe('PhotoSubmissionBlock Component', () => {
  const sampleBlock: PhotoSubmissionBlockType = {
    id: 'ps_1',
    type: 'photo_submission',
    prompt: 'Решите уравнение в целых числах: $x^2 - y^2 = 7$',
    maxScore: 2,
    criteria: '1 балл за факторизацию, 2 балла за все пары корней.',
  };

  it('renders prompt and criteria', () => {
    render(<PhotoSubmissionBlock block={sampleBlock} />);
    expect(screen.getByText(/Развернутый ответ \(часть «С»\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Макс. 2 первичных балла/i)).toBeInTheDocument();
    expect(screen.getByText(/1 балл за факторизацию/i)).toBeInTheDocument();
  });

  it('simulates photo capture and triggers onSubmitted callback', () => {
    const handleSubmitted = vi.fn();
    render(<PhotoSubmissionBlock block={sampleBlock} onSubmitted={handleSubmitted} />);

    const demoButton = screen.getByRole('button', { name: /Сделать снимок \(демо\)/i });
    fireEvent.click(demoButton);

    expect(screen.getByText(/Прикреплено на проверку куратору/i)).toBeInTheDocument();
    expect(handleSubmitted).toHaveBeenCalledTimes(1);
  });
});
