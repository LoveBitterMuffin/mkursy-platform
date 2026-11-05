import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react';
import { SkillNode, SkillCategory } from '../../types';
import { SkillNodeCard } from './SkillNodeCard';
import { SkillTreeCanvas } from './SkillTreeCanvas';
import { SkillDetailModal } from './SkillDetailModal';

interface SkillTreeProps {
  skills: SkillNode[];
  onOpenLesson: (lessonId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skills, onOpenLesson }) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const categories: Array<{ id: SkillCategory | 'all'; label: string }> = [
    { id: 'all', label: 'Все разделы' },
    { id: 'algebra', label: 'Алгебра' },
    { id: 'geometry', label: 'Геометрия' },
    { id: 'calculus', label: 'Функции и Анализ' },
    { id: 'olympiad', label: 'ОГЭ / ЕГЭ Профиль' },
  ];

  return (
    <div className="relative w-full h-[640px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl backdrop-blur-md pointer-events-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 1.6))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Увеличить"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Уменьшить"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Сброс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Galaxy Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            width: '1000px',
            height: '700px',
          }}
        >
          <SkillTreeCanvas skills={filteredSkills} width={1000} height={700} />
          {filteredSkills.map(skill => (
            <SkillNodeCard
              key={skill.id}
              skill={skill}
              isSelected={selectedSkill?.id === skill.id}
              onSelect={setSelectedSkill}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
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
