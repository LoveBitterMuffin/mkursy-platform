import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCatalog } from '../src/components/courses/CourseCatalog';
import { mcoursesList } from '../src/data/coursesData';

describe('CourseCatalog Component & mcourses.ru Integration', () => {
  it('renders academic trust banner with official license', () => {
    render(<CourseCatalog courses={mcoursesList} />);

    expect(screen.getByText(/№ Л035-01298-77\/01609816/i)).toBeInTheDocument();
    expect(screen.getByText(/Стандарты МИФИ, МЭИ, МГТУ/i)).toBeInTheDocument();
  });

  it('renders all course cards by default', () => {
    render(<CourseCatalog courses={mcoursesList} />);

    expect(screen.getByText(/Олимпиадная математика: логика и теория чисел/i)).toBeInTheDocument();
    expect(screen.getByText(/ЕГЭ Профиль: программа стандартов НИЯУ МИФИ/i)).toBeInTheDocument();
    expect(screen.getByText(/Физика: инженерная школа МГТУ им. Баумана/i)).toBeInTheDocument();
  });

  it('filters courses by subject', () => {
    render(<CourseCatalog courses={mcoursesList} />);

    const physicsFilter = screen.getByRole('button', { name: 'Физика' });
    fireEvent.click(physicsFilter);

    expect(screen.getByText(/Физика: инженерная школа МГТУ им. Баумана/i)).toBeInTheDocument();
    expect(screen.queryByText(/ЕГЭ Профиль: программа стандартов НИЯУ МИФИ/i)).not.toBeInTheDocument();
  });

  it('opens enrollment modal and allows submission', () => {
    render(<CourseCatalog courses={mcoursesList} />);

    const enrollButtons = screen.getAllByRole('button', { name: /Записаться на тестирование/i });
    fireEvent.click(enrollButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Запись на бесплатное вводное занятие/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/Например, Алексей/i);
    const phoneInput = screen.getByPlaceholderText(/\+7 \(999\) 000-00-00/i);

    fireEvent.change(nameInput, { target: { value: 'Иван' } });
    fireEvent.change(phoneInput, { target: { value: '+7 (999) 111-22-33' } });

    const submitBtn = screen.getByRole('button', { name: /Отправить заявку методисту/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Заявка успешно принята!/i)).toBeInTheDocument();
  });

  it('closes modal on Escape key', () => {
    render(<CourseCatalog courses={mcoursesList} />);

    const enrollButtons = screen.getAllByRole('button', { name: /Записаться на тестирование/i });
    fireEvent.click(enrollButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onNavigateSkillTree when arrow button clicked', () => {
    const handleNavigate = vi.fn();
    render(<CourseCatalog courses={mcoursesList} onNavigateSkillTree={handleNavigate} />);

    const navigateButtons = screen.getAllByLabelText(/Открыть тему .* в интерактивной карте знаний/i);
    fireEvent.click(navigateButtons[0]);

    expect(handleNavigate).toHaveBeenCalledWith('linear-eq');
  });

  it('does not contain forbidden em dash character in rendered UI', () => {
    const { container } = render(<CourseCatalog courses={mcoursesList} />);
    const textContent = container.textContent || '';
    expect(textContent.includes('—')).toBe(false);
  });
});
