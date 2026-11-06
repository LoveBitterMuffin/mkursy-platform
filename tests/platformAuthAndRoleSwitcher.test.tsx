import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Platform Auth and Role Navigation (AC-01)', () => {
  it('allows user to switch roles via RoleSwitcher', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'teacher' } });
    expect(screen.getByRole('button', { name: /ДЗ и Видео/i })).toBeInTheDocument();

    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    expect(screen.getByRole('button', { name: /CRM/i })).toBeInTheDocument();
  });

  it('opens AuthModal on login click', () => {
    render(<App />);

    const loginBtn = screen.getByRole('button', { name: /Авторизация/i });
    fireEvent.click(loginBtn);

    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
    expect(screen.getByText(/Вход в систему/i)).toBeInTheDocument();
    expect(screen.getByText(/Роль в центре «МКурсы»/i)).toBeInTheDocument();
  });
});
