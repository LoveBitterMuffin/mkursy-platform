import { evaluateMathFunction } from './mathEvaluator';

export interface PlotRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface PlotDrawOptions {
  width: number;
  height: number;
  range: PlotRange;
  fnExpression: string;
  params: Record<string, number>;
  curveColor?: string;
}

function toScreen(x: number, y: number, w: number, h: number, r: PlotRange) {
  const sx = ((x - r.minX) / (r.maxX - r.minX)) * w;
  const sy = h - ((y - r.minY) / (r.maxY - r.minY)) * h;
  return { sx, sy };
}

function drawGridAndAxes(ctx: CanvasRenderingContext2D, w: number, h: number, r: PlotRange): void {
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.font = '10px ui-monospace, monospace';

  for (let x = Math.ceil(r.minX); x <= Math.floor(r.maxX); x += 2) {
    if (x === 0) continue;
    const { sx } = toScreen(x, 0, w, h, r);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, h);
    ctx.stroke();
    ctx.fillText(String(x), sx - 4, toScreen(0, 0, w, h, r).sy + 12);
  }

  for (let y = Math.ceil(r.minY); y <= Math.floor(r.maxY); y += 2) {
    if (y === 0) continue;
    const { sy } = toScreen(0, y, w, h, r);
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(w, sy);
    ctx.stroke();
    ctx.fillText(String(y), toScreen(0, 0, w, h, r).sx + 6, sy + 3);
  }

  const origin = toScreen(0, 0, w, h, r);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, origin.sy);
  ctx.lineTo(w, origin.sy);
  ctx.moveTo(origin.sx, 0);
  ctx.lineTo(origin.sx, h);
  ctx.stroke();
  ctx.fillText('0', origin.sx - 10, origin.sy + 12);
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  r: PlotRange,
  fn: string,
  params: Record<string, number>,
  color: string
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();

  let isDrawing = false;
  let lastSy = 0;
  const stepPixels = 1;

  for (let px = 0; px <= w; px += stepPixels) {
    const x = r.minX + (px / w) * (r.maxX - r.minX);
    const y = evaluateMathFunction(fn, x, params);
    if (!Number.isFinite(y)) {
      isDrawing = false;
      continue;
    }
    const { sy } = toScreen(x, y, w, h, r);
    const jump = Math.abs(sy - lastSy) > h * 0.75;
    if (!isDrawing || jump) {
      ctx.moveTo(px, sy);
      isDrawing = true;
    } else {
      ctx.lineTo(px, sy);
    }
    lastSy = sy;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawPlot(ctx: CanvasRenderingContext2D, opts: PlotDrawOptions): void {
  const { width: w, height: h, range: r, fnExpression, params } = opts;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  drawGridAndAxes(ctx, w, h, r);
  if (fnExpression.trim()) {
    drawCurve(ctx, w, h, r, fnExpression, params, opts.curveColor ?? '#a855f7');
  }
}
