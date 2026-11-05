# Brief: Task 4 - Интерактивный квиз и валидация математических ответов

**Directory:** `c:\mtest`
**Base Commit:** `1f7672b273e1ac0c94ae1320fd7c3db200aecff6`

## Task Goal
Implement the math quiz system for «МКурсы»:
1. Smart math answer equivalence validator (`answerValidator.ts`) supporting fractions (`1/2 == 0.5`), commas/dots (`3,5 == 3.5`), integers, intervals.
2. Interactive React quiz component (`QuizBlock.tsx`) with choice options, formula rendering, step-by-step hints, explanation disclosure, and XP reward triggers.

## Files to Create / Modify
- `src/utils/answerValidator.ts`
- `src/components/math/QuizBlock.tsx`
- `src/components/math/index.ts` (export QuizBlock)
- `tests/answerValidator.test.ts`
- `tests/quizBlock.test.tsx`

## Specific Requirements
- All files <= 150 lines (Micro-modularity). If QuizBlock gets large, extract subcomponent (e.g. `src/components/math/QuizHints.tsx`).
- `validateMathAnswer(expected: string, actual: string): boolean`:
  - Trims and normalizes inputs (replaces `,` with `.`).
  - Evaluates simple fraction representations: `1/2` -> `0.5`, `-3/4` -> `-0.75`.
  - Floating point comparison with epsilon `1e-6`.
  - Case-insensitive string fallback for textual answers (e.g. intervals `[0; 1]`).
- `QuizBlock.tsx`:
  - Renders question text (renders math formulas if enclosed in `$...$` or LaTeX blocks).
  - Choice mode (when `options` is non-empty): interactive radio/button list with KaTeX in options.
  - Math input mode (when `mathAnswer` is provided): input field with placeholder "Введите число или дробь (например, 0.5 или 1/2)".
  - Feedback states:
    - Neutral
    - Correct (green border, celebration badge, +25 XP callback)
    - Incorrect (rose border, try again button, hint button)
  - Progressive hints:
    - Button "Нужна подсказка? (1/N)"
    - Reveals hints sequentially
  - Solution explanation:
    - Revealed on correct answer or when user requests full solution
- Tests:
  - Unit tests for `answerValidator.test.ts` covering integers, decimals, fractions, equivalences, edge cases.
  - Component test for `QuizBlock.tsx` verifying submission and hint unlocking.
- Verify: `npx vitest run` -> PASS, `npm run build` -> PASS.
- Commit: `git add .` and `git commit -m "feat: add interactive math quiz block with step hints and answer validator"`.
