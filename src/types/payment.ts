export type PaymentStatus = 'pending' | 'succeeded' | 'canceled' | 'refunded';

export type PaymentProvider = 'mock' | 'tbank' | 'yookassa';

export interface PaymentInvoice {
  id: string;
  studentId: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: 'RUB';
  status: PaymentStatus;
  provider: PaymentProvider;
  externalPaymentId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface CreatePaymentPayload {
  studentId: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  provider?: PaymentProvider;
}

export interface WebhookPayload {
  eventId: string;
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  signature?: string;
}

export interface PaymentGatewayAdapter {
  createInvoice(payload: CreatePaymentPayload): Promise<PaymentInvoice>;
  processWebhook(payload: WebhookPayload): Promise<PaymentInvoice>;
  getInvoiceStatus(invoiceId: string): Promise<PaymentInvoice | null>;
  simulatePaymentSuccess(invoiceId: string): Promise<PaymentInvoice>;
}
