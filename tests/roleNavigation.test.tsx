import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Role-specific Screen Configuration (AC-03)', () => {
  it('displays tailored navigation screens for student', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'student' } });

    expect(screen.getByRole('button', { name: /Карта знаний/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Личный кабинет/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Программы курсов/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^CRM$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /DevTools/i })).not.toBeInTheDocument();
  });

  it('displays tailored navigation screens for curator', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'curator' } });

    expect(screen.getByRole('button', { name: /Группы \(10\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ДЗ и Видео/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^CRM$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /DevTools/i })).not.toBeInTheDocument();
  });

  it('displays tailored navigation screens for teacher', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'teacher' } });

    expect(screen.getByRole('button', { name: /Конструктор/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ДЗ и Видео/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^CRM$/i })).not.toBeInTheDocument();
  });

  it('displays tailored navigation screens for developer including DevTools', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'developer' } });

    expect(screen.getByRole('button', { name: /DevTools/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^CRM$/i })).toBeInTheDocument();
    expect(screen.getByText(/Инженерная консоль разработчика/i)).toBeInTheDocument();
  });
});
