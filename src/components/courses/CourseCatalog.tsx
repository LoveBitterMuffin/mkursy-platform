import React, { useState, useMemo } from 'react';
import { BookOpen, Filter } from 'lucide-react';
import { Course, SubjectType } from '../../types/courses';
import { CourseCard } from './CourseCard';
import { AcademicTrustBanner } from './AcademicTrustBanner';
import { CourseEnrollModal } from './CourseEnrollModal';

interface CourseCatalogProps {
  courses: Course[];
  onNavigateSkillTree?: (skillId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onNavigateSkillTree,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSubject = selectedSubject === 'all' || c.subject === selectedSubject;
      const matchGrade = selectedGrade === 'all' || c.gradeRange === selectedGrade;
      return matchSubject && matchGrade;
    });
  }, [courses, selectedSubject, selectedGrade]);

  return (
    <div className="space-y-6">
      <AcademicTrustBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-[#0066FF] dark:text-brand-primary-light" />
          <span>Фильтр программ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            {(['all', 'math', 'physics', 'informatics'] as const).map(subj => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedSubject === subj
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {subj === 'all' && 'Все'}
                {subj === 'math' && 'Математика'}
                {subj === 'physics' && 'Физика'}
                {subj === 'informatics' && 'Информатика'}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            {(['all', '5-8', '9', '10-11'] as const).map(gr => (
              <button
                key={gr}
                type="button"
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedGrade === gr
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {gr === 'all' ? 'Все классы' : `${gr} кл.`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            По выбранным фильтрам курсы не найдены. Попробуйте сбросить фильтры.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={c => setEnrollingCourse(c)}
              onNavigateSkillTree={onNavigateSkillTree}
            />
          ))}
        </div>
      )}

      <CourseEnrollModal
        course={enrollingCourse}
        isOpen={Boolean(enrollingCourse)}
        onClose={() => setEnrollingCourse(null)}
      />
    </div>
  );
};
