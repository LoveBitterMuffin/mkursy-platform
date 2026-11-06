import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Homework and Video Lessons Workflow UI (AC-06, AC-07)', () => {
  it('allows teacher to publish video lesson and view review queue', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'teacher' } });

    const hwNav = screen.getByRole('button', { name: /ДЗ и Видео/i });
    fireEvent.click(hwNav);

    expect(screen.getByText(/Публикация видеоурока и выдача домашнего задания/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Например: Методы решения/i)).toBeInTheDocument();
    expect(screen.getByText(/Очередь работ/i)).toBeInTheDocument();
  });

  it('allows curator to review submitted homework and save feedback', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'curator' } });

    const hwNav = screen.getByRole('button', { name: /ДЗ и Видео/i });
    fireEvent.click(hwNav);

    expect(screen.getByText(/Очередь работ/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Иван Петров/i).length).toBeGreaterThanOrEqual(1);

    const approveBtn = screen.getByRole('button', { name: /Зачесть работу/i });
    expect(approveBtn).toBeInTheDocument();
  });
});
