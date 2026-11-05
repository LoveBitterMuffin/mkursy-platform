# План реализации: Образовательная платформа «МКурсы» (Phase 1 MVP)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать современную специализированную веб-платформу для центра математики «МКурсы» (школьники 5–11 классов), включающую интерактивную карту знаний (RPG Skill-Tree), Split-View конструктор математических уроков с KaTeX и динамическими графиками, плеер уроков и личный кабинет со стриками и прогнозом баллов ОГЭ/ЕГЭ.

**Architecture:** Модульный SPA на React + TypeScript + Vite + Tailwind CSS. Разделение на математическое ядро (KaTeX + Canvas Function Plotter), движок интерактивной карты знаний со связями тем, Split-View редактор с мгновенным Live-превью и плеер уроков для ученика с системой начисления опыта (XP).

**Tech Stack:** React 18/19, TypeScript 5, Vite, Tailwind CSS, KaTeX, Lucide React, Vitest.

## Global Constraints

- Runtime: Node.js 22.x, npm 10.x.
- Code Standards: Strict TypeScript, no `any`, hard limit 150 lines per production module (Micro-modularity law).
- Design Identity: Фирменный стиль «МКурсы» (логотипы `Logo big M.png`, палитра deep navy/indigo `#0B132B`, `#1C2541`, акцент фиолетовый `#6366F1`, изумрудный `#10B981` для освоенных тем).
- Test Coverage: Unit-тесты на Vitest для проверки математических формул, логики разблокировки узлов дерева навыков, валидации ответов квизов и вычисления прогноза баллов.

---

### Task 1: Scaffolding проекта и окружения (Vite + React + TS + Tailwind + Vitest + KaTeX)

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Test: `tests/setup.ts`

**Interfaces:**
- Produces: Рабочая среда сборки и тестирования, стили Tailwind и стили KaTeX.

- [ ] **Step 1: Создать конфигурационные файлы проекта и зависимости**
  Установить `react`, `react-dom`, `katex`, `lucide-react`, `tailwindcss`, `vite`, `vitest`, `@testing-library/react`.
- [ ] **Step 2: Настроить `vite.config.ts` с поддержкой Vitest**
- [ ] **Step 3: Настроить `tailwind.config.js` с математической цветовой палитрой «МКурсы»**
- [ ] **Step 4: Подключить KaTeX CSS в `src/index.css` и `index.html`**
- [ ] **Step 5: Запустить smoke test тестового раннера**
  Run: `npm test`
  Expected: PASS
- [ ] **Step 6: Зафиксировать коммитом**
  ```bash
  git add .
  git commit -m "chore: scaffold vite react typescript project with tailwind and vitest"
  ```

---

### Task 2: Модели данных и логика дерева навыков (Domain Core)

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/skillTreeLogic.ts`
- Create: `src/data/initialData.ts`
- Test: `tests/skillTreeLogic.test.ts`

**Interfaces:**
- Produces: `SkillNode`, `Lesson`, `LessonBlock`, `StudentProfile`, `canUnlockSkill(skill, completedSkillIds)`, `calculateForecastScore(masteredSkills)`.

- [ ] **Step 1: Написать failing test для `canUnlockSkill` и `calculateForecastScore`**
  Тест проверяет:
  1. Узел со статусом `locked` переходит в `available`, если все его `prerequisites` присутствуют в списке освоенных.
  2. Прогноз баллов ЕГЭ/ОГЭ корректно суммирует вес закрытых тем (базовые темы дают до 60 баллов, олимпиадные/сложные — до 100).
- [ ] **Step 2: Запустить тест и убедиться в FAIL**
  Run: `npx vitest run tests/skillTreeLogic.test.ts`
  Expected: FAIL (modules not found)
- [ ] **Step 3: Реализовать типы в `src/types/index.ts` и логику в `src/utils/skillTreeLogic.ts`**
- [ ] **Step 4: Создать демонстрационные данные математических тем 5–11 классов в `src/data/initialData.ts`**
  (Линейные уравнения, Квадратные уравнения и т. Виета, Графики функций, Тригонометрическая окружность, Планиметрия ОГЭ/ЕГЭ, Задачи с параметром).
- [ ] **Step 5: Запустить тест и убедиться в PASS**
  Run: `npx vitest run tests/skillTreeLogic.test.ts`
  Expected: PASS
- [ ] **Step 6: Зафиксировать коммитом**
  ```bash
  git add src/ types/ tests/
  git commit -m "feat: add domain types, skill tree logic and initial math curriculum"
  ```

---

### Task 3: Математическое ядро (KaTeX Renderer + Интерактивный Canvas-график с ползунками)

**Files:**
- Create: `src/components/math/MathFormula.tsx`
- Create: `src/components/math/MathSymbolPalette.tsx`
- Create: `src/components/math/InteractivePlot.tsx`
- Create: `src/utils/mathEvaluator.ts`
- Test: `tests/mathEvaluator.test.ts`

**Interfaces:**
- Consumes: `LessonBlock` (`type: 'math'`, `type: 'plot'`).
- Produces:
  - `<MathFormula latex={string} />` — быстрый рендеринг формул KaTeX.
  - `<MathSymbolPalette onInsert={(symbol: string) => void} />` — панель частых символов (дроби, корни, степени, пределы).
  - `<InteractivePlot fnExpression={string} params={paramList} />` — координатная сетка с графиком, реагирующим на ползунки в реальном времени.

- [ ] **Step 1: Написать failing test для `evaluateFunction(fnExpression, x, params)`**
  Проверяет корректное вычисление $y = kx + b$, $y = ax^2 + bx + c$, $y = a \cdot \sin(x)$ при изменении параметров.
- [ ] **Step 2: Запустить тест и убедиться в FAIL**
  Run: `npx vitest run tests/mathEvaluator.test.ts`
- [ ] **Step 3: Реализовать безопасный парсер и вычислитель функций в `src/utils/mathEvaluator.ts`**
- [ ] **Step 4: Реализовать компонент `MathFormula.tsx` и `MathSymbolPalette.tsx`**
- [ ] **Step 5: Реализовать компонент `InteractivePlot.tsx` на HTML5 Canvas с сеткой и ползунками параметров**
- [ ] **Step 6: Запустить тест и убедиться в PASS**
  Run: `npx vitest run tests/mathEvaluator.test.ts`
  Expected: PASS
- [ ] **Step 7: Зафиксировать коммитом**
  ```bash
  git add src/components/math tests/
  git commit -m "feat: add katex formula renderer, math palette and interactive plot canvas"
  ```

---

### Task 4: Движок интерактивных квизов и проверки математических ответов

**Files:**
- Create: `src/components/math/QuizBlock.tsx`
- Create: `src/utils/answerValidator.ts`
- Test: `tests/answerValidator.test.ts`

**Interfaces:**
- Consumes: `LessonBlock` (`type: 'quiz'`).
- Produces: `<QuizBlock block={quizBlock} onComplete={(success: boolean, xp: number) => void} />`.

- [ ] **Step 1: Написать failing test для `validateMathAnswer(expected, actual)`**
  Проверка эквивалентности математических ответов:
  - Обыкновенные дроби: `1/2` эквивалентно `0.5` и `2/4`.
  - Числа с запятой/точкой: `3,5` и `3.5`.
  - Отрицательные числа: `-4`.
- [ ] **Step 2: Запустить тест и убедиться в FAIL**
- [ ] **Step 3: Реализовать `validateMathAnswer` в `src/utils/answerValidator.ts`**
- [ ] **Step 4: Реализовать компонент `QuizBlock.tsx` с поддержкой:**
  - Тестов с выбором варианта (с формулами KaTeX в опциях);
  - Ввода математического ответа;
  - Ступенчатых подсказок (Подсказка 1 $\rightarrow$ Подсказка 2 $\rightarrow$ Полное решение);
  - Анимации начисления XP при успехе.
- [ ] **Step 5: Запустить тест и убедиться в PASS**
  Run: `npx vitest run tests/answerValidator.test.ts`
  Expected: PASS
- [ ] **Step 6: Зафиксировать коммитом**
  ```bash
  git add src/components/math src/utils tests/
  git commit -m "feat: add interactive math quiz block with step hints and answer validator"
  ```

---

### Task 5: Интерактивная карта знаний (RPG Skill-Tree)

**Files:**
- Create: `src/components/SkillTree.tsx`
- Create: `src/components/SkillNodeCard.tsx`
- Create: `src/components/SkillDetailModal.tsx`
- Test: `tests/skillTreeRendering.test.ts`

**Interfaces:**
- Consumes: `SkillNode[]`, `completedSkillIds`, `onSelectSkill(skill: SkillNode)`.
- Produces: Полноэкранная интерактивная карта созвездий тем математики со светящимися связями между темами, статусами (🔒/🟡/🟢/💎) и открытием карточки урока.

- [ ] **Step 1: Написать failing test для расчета координат и связей дерева навыков**
- [ ] **Step 2: Реализовать компонент `SkillTree.tsx` с поддержкой зума, перетаскивания (Pan) и светящихся связей на SVG/Canvas**
- [ ] **Step 3: Реализовать компонент карточки узла `SkillNodeCard.tsx` со значками категорий (Алгебра, Геометрия, Функции, ОГЭ/ЕГЭ)**
- [ ] **Step 4: Реализовать модальное окно темы `SkillDetailModal.tsx` с описанием, списком уроков и кнопкой «Начать урок»**
- [ ] **Step 5: Запустить тесты и убедиться в PASS**
- [ ] **Step 6: Зафиксировать коммитом**
  ```bash
  git add src/components/ tests/
  git commit -m "feat: add interactive rpg skill tree galaxy with glow connections and node drawer"
  ```

---

### Task 6: Split-View Конструктор уроков (Authoring Engine)

**Files:**
- Create: `src/components/editor/LessonEditor.tsx`
- Create: `src/components/editor/BlockEditorList.tsx`
- Create: `src/components/editor/BlockForm.tsx`
- Create: `src/components/editor/LivePreviewPane.tsx`

**Interfaces:**
- Consumes: `Lesson`, `onSaveLesson(lesson: Lesson)`.
- Produces: Разделенное рабочее пространство:
  - Слева: добавление блоков, быстрые кнопки математических формул, настройка параметров графика и квиза.
  - Справа: живой предпросмотр урока в реальном времени с переключателем Desktop / Mobile.

- [ ] **Step 1: Реализовать `BlockEditorList.tsx` с возможностью менять порядок блоков, удалять и добавлять новые**
- [ ] **Step 2: Реализовать формы редактирования блоков `BlockForm.tsx` для каждого типа (`text`, `math`, `plot`, `video`, `quiz`)**
- [ ] **Step 3: Реализовать `LivePreviewPane.tsx`, который рендерит текущее состояние урока без задержки**
- [ ] **Step 4: Собрать `LessonEditor.tsx` в Split-View лэйаут с кнопками сохранения и экспорта в JSON**
- [ ] **Step 5: Зафиксировать коммитом**
  ```bash
  git add src/components/editor/
  git commit -m "feat: add split-view math lesson authoring engine with live student preview"
  ```

---

### Task 7: Плеер уроков, Личный кабинет студента и интеграция бренда «МКурсы»

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/LessonPlayer.tsx`
- Create: `src/components/StudentDashboard.tsx`
- Modify: `src/App.tsx`
- Assets: скопировать логотипы в `public/assets/`

**Interfaces:**
- Интеграция всех подсистем в единый интерфейс:
  - Навбар с переключением ролей: «Режим ученика» / «Режим преподавателя».
  - Дашборд ученика: стрик 🔥, опыт XP, прогноз баллов ЕГЭ, сводка для родителей.
  - Плеер уроков: фокусный режим чтения, решение квизов, анимация завершения урока и начисления XP.

- [ ] **Step 1: Скопировать и подключить логотипы «МКурсы» в `public/assets/`**
- [ ] **Step 2: Реализовать `Navbar.tsx` с профилем, стриком, очками опыта и переключателем режимов (Ученик / Преподаватель)**
- [ ] **Step 3: Реализовать `StudentDashboard.tsx` с карточками метрик, прогнозом баллов и блоком для родителей**
- [ ] **Step 4: Реализовать `LessonPlayer.tsx` с пошаговым прохождением и отметкой прогресса в дереве навыков**
- [ ] **Step 5: Собрать главное приложение `App.tsx` с бесшовной навигацией между Картой навыков, Плеером уроков, Дашбордом и Редактором**
- [ ] **Step 6: Зафиксировать коммитом**
  ```bash
  git add src/ public/
  git commit -m "feat: integrate student dashboard, lesson player and navbar with mkursy branding"
  ```

---

### Task 8: Комплексная верификация, сборка и приемочное тестирование

**Files:**
- Test: `tests/integration.test.ts`

- [ ] **Step 1: Запустить полный набор unit-тестов Vitest**
  Run: `npm test`
  Expected: All tests pass.
- [ ] **Step 2: Запустить production сборку Vite**
  Run: `npm run build`
  Expected: Чистая сборка без ошибок TypeScript и бандлинга.
- [ ] **Step 3: Проверить запуск и отзывчивость интерфейса**
- [ ] **Step 4: Итоговый коммит релиза**
  ```bash
  git add .
  git commit -m "release: v1.0.0-mvp mkursy next-gen math lms platform"
  ```
