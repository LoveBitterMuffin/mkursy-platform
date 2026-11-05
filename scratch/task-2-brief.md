# Brief: Task 2 - Domain Core: Модели данных, логика дерева навыков и куррикулум

**Directory:** `c:\mtest`
**Base Commit:** `1a74406581b7c57a737d8c6ef9c11c0d0c55060f`

## Task Goal
Implement the TypeScript domain models and core business logic for the RPG skill tree (prerequisites unlocking, exam score forecast calculator) and initial math curriculum for 5–11th grade (OGE/EGE/Olympiad).

## Files to Create / Modify
- `src/types/index.ts` (All types: `SkillNode`, `SkillCategory`, `SkillStatus`, `Lesson`, `LessonBlock`, `StudentProfile`, etc.)
- `src/utils/skillTreeLogic.ts` (`canUnlockSkill`, `calculateForecastScore`, `calculateCategoryProgress`)
- `src/data/initialData.ts` (High quality math topics with coordinates for the RPG galaxy, prerequisites, sample lessons with KaTeX math & interactive plot definitions)
- `tests/skillTreeLogic.test.ts` (Vitest tests)

## Specific Requirements
1. **Types in `src/types/index.ts`:**
   - Follow the spec from `docs/superpowers/specs/2026-11-05-mkursy-lms-design.md`:
     - `SkillCategory`: `'algebra' | 'geometry' | 'probability' | 'calculus' | 'olympiad'`
     - `SkillStatus`: `'locked' | 'available' | 'in_progress' | 'mastered'`
     - `SkillNode`: `{ id, title, category, grade, x, y, prerequisites, status, progress, xpReward, lessonId }`
     - `LessonBlock`: discriminated union of `text`, `math`, `plot`, `video`, `quiz`
     - `Lesson`: `{ id, skillId, title, description, estimatedMinutes, blocks }`
     - `StudentProfile`: `{ name, grade, targetExam, streakDays, totalXp, forecastScore }`
2. **Logic in `src/utils/skillTreeLogic.ts`:**
   - `canUnlockSkill(skill: SkillNode, completedSkillIds: string[]): boolean`:
     - If `skill.prerequisites.length === 0`, returns `true`.
     - Otherwise returns `true` only if every prerequisite ID is in `completedSkillIds`.
   - `calculateForecastScore(skills: SkillNode[], completedSkillIds: string[]): number`:
     - Base score starts at 0 (or baseline minimum), completed skills add points scaled by their grade/tier (max 100 for EGE, max 31/32 for OGE).
   - `calculateCategoryProgress(skills: SkillNode[], category: SkillCategory): number`:
     - Returns percentage (0-100) of completed topics in the category.
3. **Data in `src/data/initialData.ts`:**
   - Rich, curated set of 8-12 math topics connecting in a logical learning graph:
     - Root 1: `linear-eq` (Линейные уравнения, 7 класс)
     - Child of Root 1: `quad-eq` (Квадратные уравнения и теорема Виета, 8 класс)
     - Child of Root 1: `functions-linear` (Линейная функция и угловой коэффициент k, 7 класс)
     - Child of `quad-eq` & `functions-linear`: `parabola-quad` (Квадратичная функция и свойства параболы, 8-9 класс, ОГЭ №11, ЕГЭ №10)
     - Root 2: `pythagoras` (Теорема Пифагора и метрические соотношения, 8 класс)
     - Child of `pythagoras`: `trig-circle` (Единичная тригонометрическая окружность и формулы приведения, 9-10 класс, ЕГЭ №13)
     - Advanced: `param-intro` (Введение в задачи с параметром, 10-11 класс, ЕГЭ №18)
   - Initial student profile: "Александр (10 класс)", стрик 7 дней, целевой экзамен ЕГЭ Профиль, начальный опыт 450 XP.
   - Initial lesson with actual KaTeX formulas and plot definitions for `parabola-quad` ($f(x) = a \cdot x^2 + b \cdot x + c$).
4. **Tests in `tests/skillTreeLogic.test.ts`:**
   - Verify prerequisite unlocking (locked when missing parent, unlocked when parent present).
   - Verify category progress and score forecast calculation.
   - Run: `npx vitest run tests/skillTreeLogic.test.ts` -> PASS.
5. **Commit:**
   - `git add .`
   - `git commit -m "feat: add domain types, skill tree logic and initial math curriculum"`
