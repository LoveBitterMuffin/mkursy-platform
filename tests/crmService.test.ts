import { describe, it, expect, beforeEach } from 'vitest';
import { CrmService } from '../src/services/crmService';
import { Lead } from '../src/types';

describe('CrmService (AC-03, AC-05)', () => {
  let crm: CrmService;

  const mockLead: Lead = {
    id: 'lead-test-1',
    studentName: 'Никита Орлов',
    contactPhone: '+7 900 123-45-67',
    email: 'nikita@example.com',
    grade: 11,
    targetCourseId: 'ege-profile',
    targetCourseTitle: 'ЕГЭ Профиль 2026: Математика',
    status: 'new',
    notes: 'Интересует группа Бауманка',
    amountExpected: 4900,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    crm = new CrmService([mockLead]);
  });

  it('progresses lead through sales funnel stages', () => {
    const contacted = crm.updateLeadStatus('lead-test-1', 'contacted');
    expect(contacted.status).toBe('contacted');

    const trial = crm.updateLeadStatus('lead-test-1', 'trial_scheduled');
    expect(trial.status).toBe('trial_scheduled');

    const paymentPending = crm.updateLeadStatus('lead-test-1', 'payment_pending');
    expect(paymentPending.status).toBe('payment_pending');
  });

  it('assigns a curator to an active lead', () => {
    const updated = crm.assignCurator('lead-test-1', 'curator-melnikova');
    expect(updated.assignedCuratorId).toBe('curator-melnikova');
  });

  it('calculates pipeline funnel summary with accurate conversion rate', () => {
    crm.createLead({
      studentName: 'Мария Федорова',
      contactPhone: '+7 911 000-00-00',
      email: 'maria@test.com',
      grade: 10,
      targetCourseId: 'olympiad',
      targetCourseTitle: 'Олимпиады',
      status: 'enrolled',
      notes: '',
      amountExpected: 5900,
    });

    const summary = crm.getPipelineSummary();
    expect(summary.enrolledCount).toBe(1);
    expect(summary.conversionRate).toBe(50);
  });
});
