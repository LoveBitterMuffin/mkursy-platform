import { SkillCategory, SkillNode, TargetExam } from '../types';

/**
 * Checks whether a skill node can be unlocked given the set of completed skill IDs.
 * Root skills with no prerequisites are always unlockable.
 */
export function canUnlockSkill(skill: SkillNode, completedSkillIds: string[]): boolean {
  if (skill.prerequisites.length === 0) {
    return true;
  }
  return skill.prerequisites.every((prereqId) => completedSkillIds.includes(prereqId));
}

/**
 * Calculates completion percentage (0..100) for a given math category.
 */
export function calculateCategoryProgress(skills: SkillNode[], category: SkillCategory): number {
  const categorySkills = skills.filter((s) => s.category === category);
  if (categorySkills.length === 0) {
    return 0;
  }
  const completedCount = categorySkills.filter(
    (s) => s.status === 'mastered' || s.progress >= 100
  ).length;
  return Math.round((completedCount / categorySkills.length) * 100);
}

function getGradeWeight(grade: number): number {
  if (grade >= 10) return 3;
  if (grade >= 8) return 2;
  return 1;
}

/**
 * Calculates predicted exam score based on completed skills and grade difficulty weights.
 */
export function calculateForecastScore(
  skills: SkillNode[],
  completedSkillIds: string[],
  targetExam: TargetExam = 'ege_profile'
): number {
  if (skills.length === 0) {
    return 0;
  }
  const totalWeight = skills.reduce((sum, s) => sum + getGradeWeight(s.grade), 0);
  if (totalWeight === 0) {
    return 0;
  }
  const completedWeight = skills.reduce(
    (sum, s) => (completedSkillIds.includes(s.id) ? sum + getGradeWeight(s.grade) : sum),
    0
  );
  const maxScore = targetExam === 'oge' ? 31 : 100;
  return Math.min(maxScore, Math.round((completedWeight / totalWeight) * maxScore));
}

/**
 * Updates status of skills based on completed skill IDs.
 */
export function updateSkillStatuses(skills: SkillNode[], completedSkillIds: string[]): SkillNode[] {
  return skills.map((skill) => {
    if (completedSkillIds.includes(skill.id)) {
      return { ...skill, status: 'mastered', progress: 100 };
    }
    if (canUnlockSkill(skill, completedSkillIds)) {
      return {
        ...skill,
        status: skill.status === 'locked' ? 'available' : skill.status,
      };
    }
    return { ...skill, status: 'locked' };
  });
}
