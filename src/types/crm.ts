export type LeadStatus = 'new' | 'contacted' | 'trial_scheduled' | 'payment_pending' | 'enrolled' | 'lost';

export interface Lead {
  id: string;
  studentName: string;
  parentName?: string;
  contactPhone: string;
  email: string;
  grade: number;
  targetCourseId: string;
  targetCourseTitle: string;
  status: LeadStatus;
  assignedCuratorId?: string;
  paymentInvoiceId?: string;
  notes: string;
  amountExpected: number;
  createdAt: string;
  updatedAt: string;
}

export interface CrmPipelineSummary {
  newCount: number;
  contactedCount: number;
  trialCount: number;
  paymentPendingCount: number;
  enrolledCount: number;
  conversionRate: number;
}
