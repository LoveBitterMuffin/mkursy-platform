import { StudentProfile, SkillNode } from '../types';

export const generateParentReportText = (profile: StudentProfile, skills: SkillNode[]): string => {
  const mastered = skills.filter(s => s.status === 'mastered').length;
  const percent = Math.round((mastered / Math.max(1, skills.length)) * 100);

  return [
    `Отчет об успеваемости ученика: ${profile.name}`,
    `Центр дополнительного образования «МКурсы» (Математика)`,
    `Класс: ${profile.grade} | Цель: ЕГЭ Профиль (Математика)`,
    ``,
    `Ключевые показатели:`,
    `- Текущий прогноз балла ЕГЭ: ${profile.forecastScore} из 100`,
    `- Освоено тем курса: ${mastered} из ${skills.length} (${percent}% кодификатора ФИПИ)`,
    `- Серия регулярных занятий (стрик): ${profile.streakDays} дней`,
    `- Набрано баллов опыта (XP): ${profile.totalXp} XP`,
    `- Сдано домашних заданий: 100% вовремя`,
    `- Посещаемость онлайн-занятий: 8 из 8 уроков`,
    ``,
    `Преподаватель-наставник: Екатерина Михайловна В.`,
    `Обратная связь куратора: динамика стабильно положительная (+14 баллов за месяц).`,
  ].join('\n');
};
