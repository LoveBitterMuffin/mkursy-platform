import React, { useState, useEffect } from 'react';
import { SkillNode, SkillCategory } from '../../types';
import { SkillNodeCard } from './SkillNodeCard';
import { SkillTreeCanvas } from './SkillTreeCanvas';
import { SkillDetailModal } from './SkillDetailModal';
import { SkillTreeControls } from './SkillTreeControls';

interface SkillTreeProps {
  skills: SkillNode[];
  onOpenLesson: (lessonId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skills, onOpenLesson }) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const nx = e.clientX - dragStart.x;
    const ny = e.clientY - dragStart.y;
    if (Math.abs(nx - pan.x) > 4 || Math.abs(ny - pan.y) > 4) setHasDragged(true);
    setPan({ x: nx, y: ny });
  };

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div
      className={`relative w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xl dark:shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' : 'h-[680px] rounded-3xl'
      }`}
    >
      <SkillTreeControls
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onZoomIn={() => setZoom(z => Math.min(z + 0.15, 1.6))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.15, 0.6))}
        onResetZoom={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(f => !f)}
      />

      <div
        className={`relative flex-1 w-full h-full overflow-hidden bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900/90 dark:via-slate-950 dark:to-black select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            width: '1050px',
            height: '750px',
          }}
        >
          <SkillTreeCanvas skills={filteredSkills} width={1050} height={750} />
          {filteredSkills.map(skill => (
            <SkillNodeCard
              key={skill.id}
              skill={skill}
              isSelected={selectedSkill?.id === skill.id}
              onSelect={s => { if (!hasDragged) setSelectedSkill(s); }}
            />
          ))}
        </div>
      </div>

      <SkillDetailModal
        skill={selectedSkill}
        allSkills={skills}
        onClose={() => setSelectedSkill(null)}
        onOpenLesson={lessonId => {
          setSelectedSkill(null);
          onOpenLesson(lessonId);
        }}
      />
    </div>
  );
};
