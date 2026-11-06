import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

describe('Developer DevTools and Webhook Simulator (AC-01, AC-02)', () => {
  it('renders DevTools panel and simulates payment succeeded webhook', async () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'developer' } });

    expect(screen.getByText(/Инженерная консоль разработчика/i)).toBeInTheDocument();
    expect(screen.getByText(/Симулятор платежных вебхуков/i)).toBeInTheDocument();

    const successWebhookBtn = screen.getByRole('button', { name: /Вебхук: Успешная оплата/i });
    fireEvent.click(successWebhookBtn);

    await waitFor(() => {
      expect(screen.getByText(/Вебхук обработан: статус -> succeeded/i)).toBeInTheDocument();
    });
  });

  it('tests group overflow invariant protection in DevTools', () => {
    render(<App />);

    const roleSelect = screen.getByLabelText(/Выбор роли пользователя/i);
    fireEvent.change(roleSelect, { target: { value: 'developer' } });

    const overflowBtn = screen.getByRole('button', { name: /Смоделировать переполнение группы/i });
    fireEvent.click(overflowBtn);

    expect(
      screen.getByText(/Инвариант подтвержден|Успех: группа заполнена/i)
    ).toBeInTheDocument();
  });
});
