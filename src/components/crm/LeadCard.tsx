import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onAdvanceStatus: (id: string, current: LeadStatus) => void;
  onAssignCurator: (id: string, curatorId: string) => void;
  curators: Array<{ id: string; name: string }>;
}

const nextStatusMap: Record<LeadStatus, LeadStatus | null> = {
  new: 'contacted',
  contacted: 'trial_scheduled',
  trial_scheduled: 'payment_pending',
  payment_pending: 'enrolled',
  enrolled: null,
  lost: null,
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'Новая заявка',
  contacted: 'Первичный контакт',
  trial_scheduled: 'Пробный урок',
  payment_pending: 'Ожидает оплаты',
  enrolled: 'Зачислен в группу',
  lost: 'Отказ',
};

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onAdvanceStatus,
  onAssignCurator,
  curators,
}) => {
  const nextStatus = nextStatusMap[lead.status];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-slate-100 space-y-3 hover:border-blue-400 dark:hover:border-slate-700 transition-colors shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{lead.studentName}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{lead.grade} класс • {lead.targetCourseTitle}</p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/15 text-[#0066FF] dark:text-[#0DA0E3] border border-blue-200 dark:border-blue-500/30">
          {statusLabels[lead.status]}
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Phone className="w-3.5 h-3.5" /> <span>{lead.contactPhone}</span>
        </div>
        {lead.notes && <p className="text-slate-500 dark:text-slate-400 italic text-[11px]">{lead.notes}</p>}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <select
          value={lead.assignedCuratorId || ''}
          onChange={e => onAssignCurator(lead.id, e.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-300 focus:outline-none"
        >
          <option value="">Назначить куратора</option>
          {curators.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {nextStatus && (
          <button
            onClick={() => onAdvanceStatus(lead.id, lead.status)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <span>{nextStatus === 'enrolled' ? 'Зачислить' : 'Далее'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
