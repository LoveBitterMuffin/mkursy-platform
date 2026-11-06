import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Course, EnrollmentFormData } from '../../types/courses';

interface CourseEnrollModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseEnrollModal: React.FC<CourseEnrollModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    studentName: '',
    parentContact: '',
    grade: '',
    courseId: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (course) {
      setFormData(prev => ({
        ...prev,
        courseId: course.id,
        grade: course.gradeRange,
      }));
      setIsSubmitted(false);
      setErrorMessage('');
    }
  }, [course]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.parentContact.trim()) {
      setErrorMessage('Пожалуйста, заполните имя и контактный телефон.');
      return;
    }
    setErrorMessage('');
    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enroll-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Заявка успешно принята!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Методист центра свяжется с вами по номеру <strong className="font-semibold">{formData.parentContact}</strong> для согласования времени бесплатного тестирования.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-blue-600 text-white font-medium text-xs transition-colors"
            >
              Понятно
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-brand-primary dark:text-blue-400">
                Запись на бесплатное вводное занятие
              </span>
              <h2 id="enroll-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {course.title}
              </h2>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Имя ученика:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например, Алексей"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Телефон родителя:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 000-00-00"
                  value={formData.parentContact}
                  onChange={e => setFormData({ ...formData, parentContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Отправить заявку методисту
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
