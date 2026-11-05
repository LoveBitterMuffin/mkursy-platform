import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MathFormula } from '../src/components/math/MathFormula';
import { MathSymbolPalette } from '../src/components/math/MathSymbolPalette';
import { InteractivePlot } from '../src/components/math/InteractivePlot';

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
  } as unknown as RenderingContext);
});

describe('MathFormula Component', () => {
  it('renders valid LaTeX formula without throwing', () => {
    const { container } = render(<MathFormula latex="\frac{a}{b}" />);
    expect(container.querySelector('.katex')).not.toBeNull();
  });

  it('renders block displayMode correctly', () => {
    const { container } = render(<MathFormula latex="x^2 + y^2 = r^2" displayMode />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });

  it('gracefully renders fallback on malformed LaTeX without crashing', () => {
    render(<MathFormula latex="\frac{incomplete" />);
    expect(screen.getByText('\\frac{incomplete')).toBeInTheDocument();
  });

  it('renders nothing when formula is empty', () => {
    const { container } = render(<MathFormula latex="" />);
    expect(container.firstChild).toBeNull();
  });
});

describe('MathSymbolPalette Component', () => {
  it('triggers onSelectSymbol when a symbol button is clicked', () => {
    const handleSelect = vi.fn();
    render(<MathSymbolPalette onSelectSymbol={handleSelect} />);
    const fracBtn = screen.getByText('a/b');
    fireEvent.click(fracBtn);
    expect(handleSelect).toHaveBeenCalledWith('\\frac{a}{b}');
  });

  it('allows switching categories in palette', () => {
    render(<MathSymbolPalette onSelectSymbol={() => {}} />);
    const functionsTab = screen.getByText('Функции и греческие');
    fireEvent.click(functionsTab);
    expect(screen.getByText('sin')).toBeInTheDocument();
    expect(screen.getByText('π')).toBeInTheDocument();
  });
});

describe('InteractivePlot Component', () => {
  it('renders canvas element and title', () => {
    render(
      <InteractivePlot
        title="Парабола"
        fnExpression="a * x^2 + b * x + c"
        params={[
          { name: 'a', label: 'Коэффициент a', min: -5, max: 5, step: 0.1, value: 1 },
        ]}
      />
    );
    expect(screen.getByText('Парабола')).toBeInTheDocument();
    expect(screen.getByText('Коэффициент a:')).toBeInTheDocument();
  });

  it('updates parameter when slider changes', () => {
    const handleParamChange = vi.fn();
    render(
      <InteractivePlot
        fnExpression="k * x"
        params={[{ name: 'k', label: 'Наклон', min: -10, max: 10, step: 1, value: 2 }]}
        onParamChange={handleParamChange}
      />
    );
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });
    expect(handleParamChange).toHaveBeenCalledWith('k', 5);
  });
});
