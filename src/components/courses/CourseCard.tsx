import React from 'react';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Course } from '../../types/courses';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onNavigateSkillTree?: (skillId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onNavigateSkillTree,
}) => {
  return (
    <article className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-brand-primary dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            <GraduationCap className="w-3.5 h-3.5" />
            {course.gradeRange} классы
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {course.durationHours} ак. часов
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold text-brand-primary dark:text-blue-400 uppercase tracking-wide">
            {course.partnerStandard}
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
            {course.shortDescription}
          </p>
        </div>

        <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {course.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Стоимость:</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
            {course.pricePerMonth}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEnroll(course)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Записаться на тестирование
          </button>

          {course.skillTreeTargetId && onNavigateSkillTree && (
            <button
              type="button"
              onClick={() => onNavigateSkillTree(course.skillTreeTargetId!)}
              title="Открыть в карте знаний"
              aria-label={`Открыть тему ${course.title} в интерактивной карте знаний`}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-primary dark:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
