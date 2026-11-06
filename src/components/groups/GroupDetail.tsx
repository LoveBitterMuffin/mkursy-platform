import React from 'react';
import { Users, BookOpen, UserCheck, UserPlus } from 'lucide-react';
import { StudyGroup, User } from '../../types';

interface GroupDetailProps {
  group: StudyGroup;
  allUsers: User[];
  onAddStudent?: (groupId: string) => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({
  group,
  allUsers,
  onAddStudent,
}) => {
  const students = group.studentIds.map(id => {
    const user = allUsers.find(u => u.id === id);
    return {
      id,
      name: user ? user.name : `Ученик (${id.substring(0, 8)})`,
      email: user ? user.email : 'student@mcourses.ru',
    };
  });

  const isFull = group.studentIds.length >= group.maxCapacity;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase text-[#0066FF] dark:text-[#0DA0E3]">{group.courseTitle}</span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{group.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {group.studentIds.length} из {group.maxCapacity} человек
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isFull ? 'Набор закрыт' : `Осталось мест: ${group.maxCapacity - group.studentIds.length}`}
            </div>
          </div>
          {onAddStudent && !isFull && (
            <button
              onClick={() => onAddStudent(group.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FF7A00] hover:bg-[#e06c00] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" /> Добавить ученика
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" /> Ведущий преподаватель
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{group.teacherName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Запись лекций, авторские ДЗ и экзамены</div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-4 h-4" /> Персональный куратор
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{group.curatorName}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Ежедневная проверка ДЗ, ответы на вопросы</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" /> Состав группы (строго до 10 человек):
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/40">
          {students.map((st, idx) => (
            <div key={st.id} className="p-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-400">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{st.name}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-mono">{st.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
