# Brief: Task 3 - Математическое ядро (KaTeX + Canvas Plotter + Palette)

**Directory:** `c:\mtest`
**Base Commit:** `5f015004ac5a013cce1109115a2c46b36fc36514`

## Task Goal
Build the specialized mathematics engine for «МКурсы»:
1. Fast, robust math formula evaluator for polynomials, rational functions, trigonometry, and parameters.
2. KaTeX formula renderer with error boundary / fallback.
3. Math symbol palette with 1-click insertion of common mathematical constructs.
4. Interactive function plotting canvas with coordinate grid, axis markings, curve rendering, and real-time parameter sliders.

## Files to Create
- `src/utils/mathEvaluator.ts` (Evaluates math expressions: supports `+`, `-`, `*`, `/`, `^`, `sin`, `cos`, `tan`, `sqrt`, `abs`, with variable `x` and parameter substitutions)
- `src/components/math/MathFormula.tsx` (Renders KaTeX using `katex.renderToString` with clean styling)
- `src/components/math/MathSymbolPalette.tsx` (Buttons for `\frac{a}{b}`, `\sqrt{x}`, `x^{2}`, `\pi`, `\pm`, `\le`, `\ge`, `\infty`, `\sin`, `\cos`, etc.)
- `src/components/math/InteractivePlot.tsx` (HTML5 Canvas component with reactive sliders for parameter tuning)
- `tests/mathEvaluator.test.ts` (Vitest tests for function evaluation)

## Specific Requirements
- All files <= 150 lines (Micro-modularity). If plotting or evaluator needs splitting, extract helper (e.g., `src/utils/canvasPlotDrawer.ts`).
- `evaluateMathFunction(fnExpression: string, x: number, params: Record<string, number>): number`:
  - Handles expressions like `a * x^2 + b * x + c`, `k * x + b`, `a * sin(b * x)`, `sqrt(x)`.
  - Handles NaN/Infinity safely (returns null or NaN without crashing).
- `InteractivePlot.tsx`:
  - Canvas size: responsive or default 500x320.
  - Draws coordinate axes $X$ and $Y$ with center $(0,0)$, subtle grid lines, arrows.
  - Plots the curve evaluated over $x \in [-10, 10]$.
  - Under the canvas: renders an interactive slider for each parameter in `params` with its current value display.
  - Smooth animation/update when sliders are dragged.
- `MathFormula.tsx`:
  - Handles inline or display mode (`displayMode: boolean`).
  - Safely falls back to plain text if LaTeX syntax is incomplete while author is typing.
- Tests in `tests/mathEvaluator.test.ts`:
  - Linear, quadratic, trigonometric, and parameter variation tests.
  - Edge cases: division by zero, square root of negative numbers.
- Verify: `npx vitest run` -> PASS, `npm run build` -> PASS.
- Commit: `git add .` and `git commit -m "feat: add katex formula renderer, math palette and interactive plot canvas"`.
