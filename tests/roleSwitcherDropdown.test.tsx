import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Role Dropdown Switcher (AC-04)', () => {
  it('renders dropdown select with all 5 system roles', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    expect(roleSelect).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    const optionValues = options.map(o => (o as HTMLOptionElement).value);

    expect(optionValues).toContain('student');
    expect(optionValues).toContain('curator');
    expect(optionValues).toContain('teacher');
    expect(optionValues).toContain('admin');
    expect(optionValues).toContain('developer');
  });

  it('updates role and changes active screens on dropdown change', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    expect(screen.getByRole('button', { name: /^CRM$/i })).toBeInTheDocument();
  });
});
