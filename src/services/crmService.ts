import { Lead, LeadStatus, CrmPipelineSummary } from '../types';
import { initialLeads } from '../data/initialPlatformData';
import { groupManager } from './groupManager';

export class CrmService {
  private leads: Lead[];

  constructor(seedLeads: Lead[] = initialLeads) {
    this.leads = [...seedLeads];
  }

  public getAllLeads(): Lead[] {
    return [...this.leads];
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  public createLead(payload: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...payload,
      id: `lead-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  public updateLeadStatus(id: string, nextStatus: LeadStatus): Lead {
    const lead = this.getLeadById(id);
    if (!lead) throw new Error(`Лид ${id} не найден`);

    const updated: Lead = {
      ...lead,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };
    this.leads = this.leads.map(l => (l.id === id ? updated : l));

    if (nextStatus === 'enrolled') {
      groupManager.enrollStudentIntoCourse(lead.targetCourseId, lead.id);
    }
    return updated;
  }

  public assignCurator(leadId: string, curatorId: string): Lead {
    const lead = this.getLeadById(leadId);
    if (!lead) throw new Error(`Лид ${leadId} не найден`);

    const updated: Lead = {
      ...lead,
      assignedCuratorId: curatorId,
      updatedAt: new Date().toISOString(),
    };
    this.leads = this.leads.map(l => (l.id === leadId ? updated : l));
    return updated;
  }

  public getPipelineSummary(): CrmPipelineSummary {
    const total = this.leads.length;
    const enrolled = this.leads.filter(l => l.status === 'enrolled').length;
    return {
      newCount: this.leads.filter(l => l.status === 'new').length,
      contactedCount: this.leads.filter(l => l.status === 'contacted').length,
      trialCount: this.leads.filter(l => l.status === 'trial_scheduled').length,
      paymentPendingCount: this.leads.filter(l => l.status === 'payment_pending').length,
      enrolledCount: enrolled,
      conversionRate: total > 0 ? Math.round((enrolled / total) * 100) : 0,
    };
  }
}

export const crmService = new CrmService();
