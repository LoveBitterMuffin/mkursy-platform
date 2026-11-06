import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Light and Dark Theme Toggling (AC-05)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('toggles theme between light and dark modes and persists to storage', () => {
    render(<App />);

    const toggleBtn = screen.getByLabelText(/Переключить тему оформления/i);
    expect(toggleBtn).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('mcourses_theme')).toBe('dark');

    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('mcourses_theme')).toBe('light');
  });

  it('restores dark theme from localStorage on initial render', () => {
    localStorage.setItem('mcourses_theme', 'dark');
    render(<App />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
