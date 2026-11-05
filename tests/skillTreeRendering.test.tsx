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
});
