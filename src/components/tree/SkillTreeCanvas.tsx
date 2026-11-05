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
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="edge-gradient-locked" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.3" />
        </linearGradient>
        <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
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
              {isUnlocked && (
                <path
                  d={`M ${parent.x} ${parent.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${skill.x} ${skill.y}`}
                  fill="none"
                  stroke={isMastered ? '#10B981' : '#6366F1'}
                  strokeWidth={5}
                  strokeOpacity={0.25}
                  filter="url(#glow-edge)"
                />
              )}
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
