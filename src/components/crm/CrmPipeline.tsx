import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { LeadCard } from './LeadCard';
import { crmService } from '../../services/crmService';

interface CrmPipelineProps {
  curators: Array<{ id: string; name: string }>;
  onLeadEnrolled?: () => void;
}

export const CrmPipeline: React.FC<CrmPipelineProps> = ({ curators, onLeadEnrolled }) => {
  const [leads, setLeads] = useState<Lead[]>(crmService.getAllLeads());
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');

  const summary = crmService.getPipelineSummary();

  const handleAdvance = (id: string, current: LeadStatus) => {
    const nextMap: Record<LeadStatus, LeadStatus | null> = {
      new: 'contacted',
      contacted: 'trial_scheduled',
      trial_scheduled: 'payment_pending',
      payment_pending: 'enrolled',
      enrolled: null,
      lost: null,
    };
    const next = nextMap[current];
    if (next) {
      crmService.updateLeadStatus(id, next);
      setLeads(crmService.getAllLeads());
      if (next === 'enrolled' && onLeadEnrolled) {
        onLeadEnrolled();
      }
    }
  };

  const handleAssignCurator = (id: string, curatorId: string) => {
    crmService.assignCurator(id, curatorId);
    setLeads(crmService.getAllLeads());
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Новые заявки</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.newCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Пробные уроки</div>
          <div className="text-2xl font-black text-[#0066FF] dark:text-[#0DA0E3] mt-1">{summary.trialCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ожидают оплаты</div>
          <div className="text-2xl font-black text-[#FF7A00] mt-1">{summary.paymentPendingCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Зачислено в группы</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{summary.enrolledCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-slate-400" /> Фильтр этапа:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'new', 'trial_scheduled', 'payment_pending', 'enrolled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-[#0066FF] text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Все лиды' : f === 'new' ? 'Новые' : f === 'trial_scheduled' ? 'Пробные' : f === 'payment_pending' ? 'Оплата' : 'Зачислены'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            curators={curators}
            onAdvanceStatus={handleAdvance}
            onAssignCurator={handleAssignCurator}
          />
        ))}
      </div>
    </div>
  );
};
