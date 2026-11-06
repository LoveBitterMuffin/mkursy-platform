import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

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
    <div
      className={`relative w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xl dark:shadow-2xl flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' : 'h-[680px] rounded-3xl'
      }`}
    >
      <div className="absolute top-5 left-5 right-5 z-30 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-2 p-2 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl backdrop-blur-xl shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2 text-slate-500 dark:text-slate-400 font-semibold text-xs">
            <Filter className="w-4 h-4 text-[#0066FF] dark:text-indigo-400" />
            <span>Разделы:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl backdrop-blur-xl shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(z + 0.15, 1.6))}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Увеличить масштаб"
            aria-label="Увеличить масштаб"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Уменьшить масштаб"
            aria-label="Уменьшить масштаб"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Сброс масштаба"
            aria-label="Сбросить масштаб"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(f => !f)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#0066FF] dark:text-indigo-400 hover:text-blue-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
            aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900/90 dark:via-slate-950 dark:to-black">
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
