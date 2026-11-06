import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

describe('Payment Adapter and 10-student Groups UI (AC-02, AC-04)', () => {
  it('opens and completes payment modal via course catalog', async () => {
    render(<App />);

    const coursesNav = screen.getByRole('button', { name: /Программы курсов/i });
    fireEvent.click(coursesNav);

    const payBtn = screen.getByRole('button', { name: /Оплатить курс онлайн/i });
    fireEvent.click(payBtn);

    expect(screen.getByText(/Шлюз оплаты курса/i)).toBeInTheDocument();
    expect(screen.getByText(/Т-Банк/i)).toBeInTheDocument();

    const submitPay = screen.getByRole('button', { name: /Оплатить и вступить в группу/i });
    fireEvent.click(submitPay);

    await waitFor(() => {
      expect(screen.getByText(/Учебные группы центра/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays group capacity with 10 person maximum and assigned faculty', () => {
    render(<App />);

    const groupsNav = screen.getByRole('button', { name: /Группы \(10\)/i });
    fireEvent.click(groupsNav);

    expect(screen.getByText(/Учебные группы центра/i)).toBeInTheDocument();
    expect(screen.getByText(/8 \/ 10 мест/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Д\. С\. Воронов/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Анна Мельникова/i).length).toBeGreaterThanOrEqual(1);
  });
});
