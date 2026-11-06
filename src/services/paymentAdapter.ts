import {
  PaymentGatewayAdapter,
  PaymentInvoice,
  CreatePaymentPayload,
  WebhookPayload,
} from '../types';

export class PaymentAdapter implements PaymentGatewayAdapter {
  private invoices: Map<string, PaymentInvoice> = new Map();
  private processedWebhookEvents: Set<string> = new Set();
  private onPaymentSuccessCallbacks: Array<(invoice: PaymentInvoice) => void> = [];

  public async createInvoice(payload: CreatePaymentPayload): Promise<PaymentInvoice> {
    if (payload.amount <= 0) {
      throw new Error('Сумма платежа должна быть больше нуля');
    }
    const invoiceId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const invoice: PaymentInvoice = {
      id: invoiceId,
      studentId: payload.studentId,
      studentEmail: payload.studentEmail,
      courseId: payload.courseId,
      courseTitle: payload.courseTitle,
      amount: payload.amount,
      currency: 'RUB',
      status: 'pending',
      provider: payload.provider ?? 'mock',
      externalPaymentId: `ext-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.invoices.set(invoiceId, invoice);
    return invoice;
  }

  public async processWebhook(payload: WebhookPayload): Promise<PaymentInvoice> {
    if (this.processedWebhookEvents.has(payload.eventId)) {
      const existing = this.invoices.get(payload.paymentId);
      if (!existing) throw new Error(`Инвойс ${payload.paymentId} не найден`);
      return existing;
    }

    const invoice = this.invoices.get(payload.paymentId);
    if (!invoice) {
      throw new Error(`Инвойс ${payload.paymentId} не найден`);
    }

    const updated: PaymentInvoice = {
      ...invoice,
      status: payload.status,
      paidAt: payload.status === 'succeeded' ? new Date().toISOString() : undefined,
    };
    this.invoices.set(invoice.id, updated);
    this.processedWebhookEvents.add(payload.eventId);

    if (payload.status === 'succeeded') {
      this.notifySuccess(updated);
    }
    return updated;
  }

  public async getInvoiceStatus(invoiceId: string): Promise<PaymentInvoice | null> {
    return this.invoices.get(invoiceId) ?? null;
  }

  public async simulatePaymentSuccess(invoiceId: string): Promise<PaymentInvoice> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) throw new Error(`Инвойс ${invoiceId} не найден`);

    return this.processWebhook({
      eventId: `sim-evt-${Date.now()}`,
      paymentId: invoiceId,
      status: 'succeeded',
      amount: invoice.amount,
    });
  }

  public onPaymentSuccess(cb: (invoice: PaymentInvoice) => void): () => void {
    this.onPaymentSuccessCallbacks.push(cb);
    return () => {
      this.onPaymentSuccessCallbacks = this.onPaymentSuccessCallbacks.filter(c => c !== cb);
    };
  }

  private notifySuccess(invoice: PaymentInvoice): void {
    for (const cb of this.onPaymentSuccessCallbacks) {
      cb(invoice);
    }
  }

  public getAllInvoices(): PaymentInvoice[] {
    return Array.from(this.invoices.values());
  }
}

export const paymentAdapter = new PaymentAdapter();
