import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTree } from '../src/components/tree/SkillTree';
import { initialSkills } from '../src/data/initialData';

describe('SkillTree Component', () => {
  it('renders skill nodes from initialData', () => {
    const onOpenLesson = vi.fn();
    render(<SkillTree skills={initialSkills} onOpenLesson={onOpenLesson} />);

    expect(screen.getByText(/Линейные уравнения/i)).toBeInTheDocument();
    expect(screen.getByText(/Квадратные уравнения/i)).toBeInTheDocument();
  });

  it('filters nodes by category', () => {
    const onOpenLesson = vi.fn();
    render(<SkillTree skills={initialSkills} onOpenLesson={onOpenLesson} />);

    const geometryFilter = screen.getByRole('button', { name: /Геометрия/i });
    fireEvent.click(geometryFilter);

    expect(screen.getByText(/Теорема Пифагора/i)).toBeInTheDocument();
    expect(screen.queryByText(/Квадратные уравнения/i)).not.toBeInTheDocument();
  });

  it('opens detail modal when a node is clicked', () => {
    const onOpenLesson = vi.fn();
    render(<SkillTree skills={initialSkills} onOpenLesson={onOpenLesson} />);

    // Click node with prerequisites
    const node = screen.getByText(/Квадратные уравнения/i);
    fireEvent.click(node);

    expect(screen.getByText(/Необходимая база/i)).toBeInTheDocument();
  });

  it('supports mouse dragging to pan the tree canvas', () => {
    const onOpenLesson = vi.fn();
    const { container } = render(<SkillTree skills={initialSkills} onOpenLesson={onOpenLesson} />);

    const canvasArea = container.querySelector('.cursor-grab');
    expect(canvasArea).toBeInTheDocument();

    fireEvent.mouseDown(canvasArea!, { clientX: 100, clientY: 100, button: 0 });
    fireEvent.mouseMove(canvasArea!, { clientX: 250, clientY: 180 });
    fireEvent.mouseUp(canvasArea!);

    const pannedContainer = canvasArea?.firstElementChild;
    expect(pannedContainer).toHaveStyle('transform: translate(150px, 80px) scale(1)');
  });

  it('guarantees no skill cards overlap in initialSkills layout', () => {
    const cardWidth = 128;
    const cardHeight = 138;

    for (let i = 0; i < initialSkills.length; i++) {
      for (let j = i + 1; j < initialSkills.length; j++) {
        const a = initialSkills[i];
        const b = initialSkills[j];
        const overlapX = Math.max(0, Math.min(a.x + cardWidth / 2, b.x + cardWidth / 2) - Math.max(a.x - cardWidth / 2, b.x - cardWidth / 2));
        const overlapY = Math.max(0, Math.min(a.y + cardHeight / 2, b.y + cardHeight / 2) - Math.max(a.y - cardHeight / 2, b.y - cardHeight / 2));
        const hasOverlap = overlapX > 0 && overlapY > 0;
        expect(hasOverlap).toBe(false);
      }
    }
  });
});
