import React from 'react';
import { ShieldCheck, Award, Building2 } from 'lucide-react';

export const AcademicTrustBanner: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] dark:text-brand-primary-light uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Государственная образовательная лицензия
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Центр дополнительного образования «МКурсы»
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Официальная бессрочная лицензия № Л035-01298-77/01609816. Программы дополнительного образования и довузовской подготовки.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl text-xs">
            <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Стандарты МИФИ, МЭИ, МГТУ</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Преподаватели ведущих кафедр</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl text-xs">
            <Building2 className="w-4 h-4 text-[#0066FF] dark:text-brand-primary-light shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Очно в Москве и Онлайн</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Группы строго до 8 человек</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
