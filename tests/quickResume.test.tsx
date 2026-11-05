import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickResumeCard } from '../src/components/dashboard/QuickResumeCard';
import { StudentKpiGrid } from '../src/components/dashboard/StudentKpiGrid';
import { generateParentReportText } from '../src/utils/parentReportGenerator';
import { SkillNode, StudentProfile } from '../src/types';

describe('QuickResume and ParentReport Modules', () => {
  const sampleSkill: SkillNode = {
    id: 'alg_1',
    title: 'Квадратные уравнения и теорема Виета',
    category: 'algebra',
    grade: 8,
    x: 100,
    y: 100,
    prerequisites: [],
    status: 'in_progress',
    progress: 50,
    xpReward: 120,
    lessonId: 'lesson_quad',
  };

  const sampleProfile: StudentProfile = {
    name: 'Александр И.',
    grade: 10,
    targetExam: 'ege_profile',
    streakDays: 14,
    totalXp: 850,
    forecastScore: 82,
  };

  it('renders QuickResumeCard and invokes onResume', () => {
    const handleResume = vi.fn();
    render(<QuickResumeCard skill={sampleSkill} onResume={handleResume} />);

    expect(screen.getByText(/Квадратные уравнения и теорема Виета/i)).toBeInTheDocument();
    expect(screen.getByText(/\+120 XP/i)).toBeInTheDocument();

    const resumeBtn = screen.getByRole('button', { name: /Продолжить урок/i });
    fireEvent.click(resumeBtn);
    expect(handleResume).toHaveBeenCalledWith(sampleSkill);
  });

  it('renders StudentKpiGrid with streak and XP', () => {
    render(<StudentKpiGrid profile={sampleProfile} masteredCount={4} totalSkills={10} />);
    expect(screen.getByText('14 дней')).toBeInTheDocument();
    expect(screen.getByText('850 XP')).toBeInTheDocument();
    expect(screen.getByText('4 / 10')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('generates parent report text with all critical indicators', () => {
    const text = generateParentReportText(sampleProfile, [sampleSkill]);
    expect(text).toContain('Александр И.');
    expect(text).toContain('Текущий прогноз балла ЕГЭ: 82 из 100');
    expect(text).toContain('Сдано домашних заданий: 100% вовремя');
  });
});
