import React, { useState, useEffect, useRef } from 'react';
import { PlotParam } from '../../types';
import { drawPlot, PlotRange } from '../../utils/canvasPlotDrawer';

export interface InteractivePlotProps {
  fnExpression: string;
  params?: PlotParam[];
  title?: string;
  width?: number;
  height?: number;
  rangeX?: [number, number];
  rangeY?: [number, number];
  className?: string;
  onParamChange?: (name: string, value: number) => void;
}

export const InteractivePlot: React.FC<InteractivePlotProps> = ({
  fnExpression,
  params = [],
  title,
  width = 500,
  height = 320,
  rangeX = [-10, 10],
  rangeY = [-10, 10],
  className = '',
  onParamChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    params.forEach((p) => { init[p.name] = p.value; });
    return init;
  });

  useEffect(() => {
    setValues((prev) => {
      const next = { ...prev };
      params.forEach((p) => {
        if (!(p.name in next)) next[p.name] = p.value;
      });
      return next;
    });
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const range: PlotRange = {
      minX: rangeX[0],
      maxX: rangeX[1],
      minY: rangeY[0],
      maxY: rangeY[1],
    };

    drawPlot(ctx, { width, height, range, fnExpression, params: values });
  }, [fnExpression, values, width, height, rangeX, rangeY]);

  const handleSliderChange = (name: string, val: number) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    onParamChange?.(name, val);
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-4 shadow-sm dark:shadow-xl ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{title}</h4>
          <span className="text-xs font-mono text-indigo-600 dark:text-purple-400 bg-indigo-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-purple-800/50">
            f(x) = {fnExpression}
          </span>
        </div>
      )}

      <div className="flex justify-center bg-slate-50 dark:bg-slate-950/80 rounded-lg p-1.5 border border-slate-200 dark:border-slate-800/60 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded max-w-full h-auto block"
        />
      </div>

      {params.length > 0 && (
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Параметры функции</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {params.map((p) => {
              const currentVal = values[p.name] ?? p.value;
              return (
                <div key={p.name} className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.label || p.name}:</span>
                    <span className="font-mono text-[#0066FF] dark:text-purple-300 font-semibold">{currentVal.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={currentVal}
                    onChange={(e) => handleSliderChange(p.name, parseFloat(e.target.value))}
                    className="w-full accent-purple-500 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{p.min}</span>
                    <span>{p.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
