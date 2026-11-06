import React from 'react';
import { UserCheck, BookOpen } from 'lucide-react';
import { StudyGroup } from '../../types';

interface GroupListProps {
  groups: StudyGroup[];
  onSelectGroup: (group: StudyGroup) => void;
  selectedGroupId?: string;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  onSelectGroup,
  selectedGroupId,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map(group => {
        const isSelected = group.id === selectedGroupId;
        const count = group.studentIds.length;
        const percent = Math.min(100, Math.round((count / group.maxCapacity) * 100));
        const isFull = count >= group.maxCapacity;

        return (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              isSelected
                ? 'bg-blue-50/60 dark:bg-slate-900 border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20'
                : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] dark:text-blue-400">
                  {group.courseTitle}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{group.title}</h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isFull
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
                    : 'bg-blue-500/10 text-[#0066FF] dark:text-blue-300 border-blue-500/30'
                }`}
              >
                {count} / {group.maxCapacity} мест
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    isFull ? 'bg-amber-500' : 'bg-[#0066FF]'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{isFull ? 'Группа укомплектована' : 'Идет набор'}</span>
                <span>{percent}% заполнено</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">{group.teacherName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{group.curatorName}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
