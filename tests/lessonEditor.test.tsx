import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonEditor } from '../src/components/editor/LessonEditor';
import { sampleParabolaLesson } from '../src/data/sampleLessons';

describe('LessonEditor Split-View Component', () => {
  it('renders initial lesson data in split-view', () => {
    const onSave = vi.fn();
    const onBack = vi.fn();
    render(<LessonEditor initialLesson={sampleParabolaLesson} onSave={onSave} onBack={onBack} />);

    expect(screen.getByDisplayValue(sampleParabolaLesson.title)).toBeInTheDocument();
    expect(screen.getByText(/Предпросмотр для ученика/i)).toBeInTheDocument();
  });

  it('allows adding a new math formula block', () => {
    const onSave = vi.fn();
    const onBack = vi.fn();
    render(<LessonEditor initialLesson={sampleParabolaLesson} onSave={onSave} onBack={onBack} />);

    const addFormulaBtn = screen.getByRole('button', { name: /Формулу/i });
    fireEvent.click(addFormulaBtn);

    const saveBtn = screen.getByRole('button', { name: /Сохранить урок/i });
    fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalled();
    const savedLesson = onSave.mock.calls[0][0];
    expect(savedLesson.blocks.length).toBe(sampleParabolaLesson.blocks.length + 1);
  });

  it('switches between desktop and mobile preview modes', () => {
    const onSave = vi.fn();
    const onBack = vi.fn();
    render(<LessonEditor initialLesson={sampleParabolaLesson} onSave={onSave} onBack={onBack} />);

    const mobileBtn = screen.getByRole('button', { name: /Смартфон/i });
    fireEvent.click(mobileBtn);

    expect(mobileBtn).toHaveClass('bg-indigo-600');
  });
});
