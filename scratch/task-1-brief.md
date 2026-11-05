# Brief: Task 1 - Scaffolding проекта и окружения

**Directory:** `c:\mtest`
**Base Commit:** `e46da155dd2196f3e1577c13b0312d54a52863c9`

## Task Goal
Scaffold a clean, modern Vite + React 18/19 + TypeScript + Tailwind CSS project with Vitest and KaTeX support for «МКурсы».

## Files to Create / Modify
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json` (if needed)
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `src/main.tsx`
- `src/index.css`
- `src/App.tsx` (simple placeholder placeholder for now)
- `tests/setup.ts`
- `tests/smoke.test.ts`

## Specific Requirements
1. **Dependencies in `package.json`:**
   - `react`, `react-dom`, `katex`, `lucide-react`
   - Dev dependencies: `typescript`, `@types/react`, `@types/react-dom`, `@types/katex`, `vite`, `@vitejs/plugin-react`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `tailwindcss`, `postcss`, `autoprefixer`
2. **Tailwind Config:**
   - Configure colors:
     - `brand-dark`: `#0B132B`
     - `brand-navy`: `#1C2541`
     - `brand-surface`: `#243054`
     - `brand-accent`: `#6366F1`
     - `brand-purple`: `#8B5CF6`
     - `brand-emerald`: `#10B981`
     - `brand-amber`: `#F59E0B`
     - `brand-rose`: `#EF4444`
3. **KaTeX CSS:**
   - Import `katex/dist/katex.min.css` in `src/index.css` or link it via CDN in `index.html` as fallback so KaTeX math renders flawlessly.
4. **Smoke test:**
   - `tests/smoke.test.ts` verifying Vitest runner works with a simple math assertion `assert.equal(1 + 1, 2)`.
5. **Commands to verify:**
   - Run: `npm install` (with `--no-audit --prefer-offline` or standard `npm install`)
   - Run: `npx vitest run` -> PASS
6. **Commit:**
   - `git add .`
   - `git commit -m "chore: scaffold vite react typescript project with tailwind and vitest"`
