import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('MKursy App End-to-End Navigation', () => {
  it('renders navbar and initial skill tree view', () => {
    render(<App />);

    expect(screen.getByText('МКурсы')).toBeInTheDocument();
    expect(screen.getByText(/Интерактивная карта знаний/i)).toBeInTheDocument();
  });

  it('navigates to student dashboard and displays forecast score', () => {
    render(<App />);

    const dashboardTab = screen.getByRole('button', { name: /Личный кабинет/i });
    fireEvent.click(dashboardTab);

    expect(screen.getByText(/Прогноз балла ЕГЭ/i)).toBeInTheDocument();
    expect(screen.getByText(/Сводка успеваемости для родителей/i)).toBeInTheDocument();
  });

  it('navigates to lesson editor and switches back', () => {
    render(<App />);

    const editorTab = screen.getByRole('button', { name: /Конструктор/i });
    fireEvent.click(editorTab);

    expect(screen.getByText(/Предпросмотр для ученика/i)).toBeInTheDocument();

    const backBtn = screen.getByTitle(/Назад/i);
    fireEvent.click(backBtn);

    expect(screen.getByText(/Интерактивная карта знаний/i)).toBeInTheDocument();
  });
});
