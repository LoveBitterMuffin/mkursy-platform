import React from 'react';
import { SkillNode } from '../../types';

interface SkillTreeCanvasProps {
  skills: SkillNode[];
  width: number;
  height: number;
}

export const SkillTreeCanvas: React.FC<SkillTreeCanvasProps> = ({ skills, width, height }) => {
  const nodeMap = new Map<string, SkillNode>(skills.map(s => [s.id, s]));

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="edge-gradient-active" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="edge-gradient-locked" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#64748B" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {skills.map(skill => {
        return skill.prerequisites.map(prereqId => {
          const parent = nodeMap.get(prereqId);
          if (!parent) return null;

          const isUnlocked = skill.status !== 'locked';
          const isMastered = parent.status === 'mastered' && skill.status === 'mastered';
          
          const stroke = isMastered
            ? '#10B981'
            : isUnlocked
            ? 'url(#edge-gradient-active)'
            : 'url(#edge-gradient-locked)';

          const strokeWidth = isUnlocked ? 2.5 : 1.5;
          const strokeDasharray = isUnlocked ? undefined : '5,5';

          // Bezier curve control points
          const dx = skill.x - parent.x;
          const cx1 = parent.x + dx * 0.5;
          const cy1 = parent.y;
          const cx2 = parent.x + dx * 0.5;
          const cy2 = skill.y;

          return (
            <g key={`${parent.id}->${skill.id}`}>
              <path
                d={`M ${parent.x} ${parent.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${skill.x} ${skill.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
              />
            </g>
          );
        });
      })}
    </svg>
  );
};
