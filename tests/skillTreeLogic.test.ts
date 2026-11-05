import { describe, it, expect } from 'vitest';
import {
  canUnlockSkill,
  calculateForecastScore,
  calculateCategoryProgress,
  updateSkillStatuses,
} from '../src/utils/skillTreeLogic';
import { SkillNode } from '../src/types';

const mockSkills: SkillNode[] = [
  {
    id: 'linear-eq',
    title: 'Линейные уравнения',
    category: 'algebra',
    grade: 7,
    x: 100,
    y: 100,
    prerequisites: [],
    status: 'mastered',
    progress: 100,
    xpReward: 100,
    lessonId: 'lesson-linear-eq',
  },
  {
    id: 'quad-eq',
    title: 'Квадратные уравнения',
    category: 'algebra',
    grade: 8,
    x: 250,
    y: 100,
    prerequisites: ['linear-eq'],
    status: 'in_progress',
    progress: 50,
    xpReward: 150,
    lessonId: 'lesson-quad-eq',
  },
  {
    id: 'functions-linear',
    title: 'Линейная функция',
    category: 'algebra',
    grade: 7,
    x: 100,
    y: 250,
    prerequisites: ['linear-eq'],
    status: 'available',
    progress: 0,
    xpReward: 120,
    lessonId: 'lesson-func-lin',
  },
  {
    id: 'parabola-quad',
    title: 'Квадратичная функция',
    category: 'algebra',
    grade: 9,
    x: 350,
    y: 200,
    prerequisites: ['quad-eq', 'functions-linear'],
    status: 'locked',
    progress: 0,
    xpReward: 200,
    lessonId: 'lesson-parabola',
  },
  {
    id: 'pythagoras',
    title: 'Теорема Пифагора',
    category: 'geometry',
    grade: 8,
    x: 500,
    y: 100,
    prerequisites: [],
    status: 'available',
    progress: 0,
    xpReward: 130,
    lessonId: 'lesson-pythagoras',
  },
];

describe('skillTreeLogic', () => {
  describe('canUnlockSkill', () => {
    it('returns true for root skills with empty prerequisites', () => {
      const rootSkill = mockSkills.find((s) => s.id === 'linear-eq')!;
      expect(canUnlockSkill(rootSkill, [])).toBe(true);
    });

    it('returns false when required prerequisite is missing', () => {
      const childSkill = mockSkills.find((s) => s.id === 'quad-eq')!;
      expect(canUnlockSkill(childSkill, [])).toBe(false);
      expect(canUnlockSkill(childSkill, ['other-id'])).toBe(false);
    });

    it('returns true when prerequisite is present in completed list', () => {
      const childSkill = mockSkills.find((s) => s.id === 'quad-eq')!;
      expect(canUnlockSkill(childSkill, ['linear-eq'])).toBe(true);
    });

    it('returns false when only a subset of prerequisites is completed', () => {
      const multiPrereqSkill = mockSkills.find((s) => s.id === 'parabola-quad')!;
      expect(canUnlockSkill(multiPrereqSkill, ['quad-eq'])).toBe(false);
      expect(canUnlockSkill(multiPrereqSkill, ['functions-linear'])).toBe(false);
    });

    it('returns true when all prerequisites are fulfilled', () => {
      const multiPrereqSkill = mockSkills.find((s) => s.id === 'parabola-quad')!;
      expect(canUnlockSkill(multiPrereqSkill, ['quad-eq', 'functions-linear'])).toBe(true);
    });
  });

  describe('calculateCategoryProgress', () => {
    it('returns 0 when category has no skills', () => {
      expect(calculateCategoryProgress(mockSkills, 'olympiad')).toBe(0);
    });

    it('returns 0 when no skills in category are mastered', () => {
      expect(calculateCategoryProgress(mockSkills, 'geometry')).toBe(0);
    });

    it('calculates rounded percentage for partially completed category', () => {
      // 4 algebra skills: linear-eq (mastered), quad-eq (in_progress), functions-linear (avail), parabola (locked)
      // 1 / 4 = 25%
      expect(calculateCategoryProgress(mockSkills, 'algebra')).toBe(25);
    });

    it('returns 100% when all skills in category are mastered', () => {
      const allMastered: SkillNode[] = mockSkills.map((s) => ({
        ...s,
        status: 'mastered',
        progress: 100,
      }));
      expect(calculateCategoryProgress(allMastered, 'algebra')).toBe(100);
    });
  });

  describe('calculateForecastScore', () => {
    it('returns 0 when no skills are completed', () => {
      expect(calculateForecastScore(mockSkills, [])).toBe(0);
    });

    it('returns 0 when empty skills list is provided', () => {
      expect(calculateForecastScore([], ['linear-eq'])).toBe(0);
    });

    it('calculates score proportion based on skill grade weights for EGE', () => {
      // Total weight: 7th=1, 8th=2, 7th=1, 9th=2, 8th=2 => total = 8
      // If linear-eq (weight 1) is completed: 1/8 * 100 = 12.5 -> 13
      const score = calculateForecastScore(mockSkills, ['linear-eq'], 'ege_profile');
      expect(score).toBe(13);
    });

    it('returns max 100 when all skills are completed for EGE', () => {
      const allIds = mockSkills.map((s) => s.id);
      expect(calculateForecastScore(mockSkills, allIds, 'ege_profile')).toBe(100);
    });

    it('scales to max 31 when targetExam is OGE', () => {
      const allIds = mockSkills.map((s) => s.id);
      expect(calculateForecastScore(mockSkills, allIds, 'oge')).toBe(31);
    });
  });

  describe('updateSkillStatuses', () => {
    it('updates statuses based on completed IDs and prerequisites', () => {
      const updated = updateSkillStatuses(mockSkills, ['linear-eq', 'quad-eq']);
      const linear = updated.find((s) => s.id === 'linear-eq')!;
      const quad = updated.find((s) => s.id === 'quad-eq')!;
      const funcLin = updated.find((s) => s.id === 'functions-linear')!;
      const parabola = updated.find((s) => s.id === 'parabola-quad')!;

      expect(linear.status).toBe('mastered');
      expect(quad.status).toBe('mastered');
      expect(funcLin.status).toBe('available');
      // Parabola requires both quad-eq and functions-linear; functions-linear is not completed
      expect(parabola.status).toBe('locked');
    });
  });

  describe('initialData validation', () => {
    it('verifies all prerequisite IDs refer to valid skill nodes', async () => {
      const { initialSkills, initialProfile, sampleLessonParabola } = await import(
        '../src/data/initialData'
      );
      const skillIds = new Set(initialSkills.map((s) => s.id));

      for (const skill of initialSkills) {
        for (const prereq of skill.prerequisites) {
          expect(skillIds.has(prereq)).toBe(true);
        }
      }

      expect(initialSkills.length).toBeGreaterThanOrEqual(8);
      expect(initialProfile.name).toBe('Александр');
      expect(sampleLessonParabola.blocks.length).toBeGreaterThanOrEqual(4);
    });
  });
});
