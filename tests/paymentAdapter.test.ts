import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentAdapter } from '../src/services/paymentAdapter';

describe('PaymentAdapter (AC-02)', () => {
  let adapter: PaymentAdapter;

  beforeEach(() => {
    adapter = new PaymentAdapter();
  });

  it('creates a pending payment invoice with valid details', async () => {
    const invoice = await adapter.createInvoice({
      studentId: 'stud-1',
      studentEmail: 'student@example.com',
      courseId: 'ege-profile',
      courseTitle: 'ЕГЭ Профиль 2026',
      amount: 4900,
    });

    expect(invoice.id).toMatch(/^inv-/);
    expect(invoice.amount).toBe(4900);
    expect(invoice.status).toBe('pending');
    expect(invoice.currency).toBe('RUB');
  });

  it('rejects invoice creation with non-positive amounts', async () => {
    await expect(
      adapter.createInvoice({
        studentId: 'stud-1',
        studentEmail: 'test@test.com',
        courseId: 'c-1',
        courseTitle: 'Title',
        amount: 0,
      })
    ).rejects.toThrow('Сумма платежа должна быть больше нуля');
  });

  it('processes webhook and transitions invoice to succeeded', async () => {
    const invoice = await adapter.createInvoice({
      studentId: 'stud-2',
      studentEmail: 'stud2@test.com',
      courseId: 'olympiad',
      courseTitle: 'Олимпиадная математика',
      amount: 5900,
    });

    const callback = vi.fn();
    adapter.onPaymentSuccess(callback);

    const updated = await adapter.processWebhook({
      eventId: 'evt-webhook-001',
      paymentId: invoice.id,
      status: 'succeeded',
      amount: 5900,
    });

    expect(updated.status).toBe('succeeded');
    expect(updated.paidAt).toBeDefined();
    expect(callback).toHaveBeenCalledWith(updated);
  });

  it('guarantees idempotency on duplicate webhook events', async () => {
    const invoice = await adapter.createInvoice({
      studentId: 'stud-3',
      studentEmail: 'stud3@test.com',
      courseId: 'c-3',
      courseTitle: 'Курс 3',
      amount: 3500,
    });

    const event = {
      eventId: 'evt-duplicate-1',
      paymentId: invoice.id,
      status: 'succeeded' as const,
      amount: 3500,
    };

    const firstRun = await adapter.processWebhook(event);
    const secondRun = await adapter.processWebhook(event);

    expect(firstRun.paidAt).toBe(secondRun.paidAt);
  });
});
