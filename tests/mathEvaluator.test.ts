import { describe, it, expect } from 'vitest';
import { evaluateMathFunction } from '../src/utils/mathEvaluator';

describe('mathEvaluator', () => {
  describe('linear and polynomial expressions', () => {
    it('evaluates simple linear function k * x + b', () => {
      const result = evaluateMathFunction('k * x + b', 4, { k: 2, b: 3 });
      expect(result).toBe(11);
    });

    it('evaluates quadratic function a * x^2 + b * x + c', () => {
      const result = evaluateMathFunction('a * x^2 + b * x + c', 3, { a: 1, b: -2, c: 1 });
      expect(result).toBe(4);
    });

    it('supports implicit multiplication like 2x', () => {
      const result = evaluateMathFunction('2x + 5', 3);
      expect(result).toBe(11);
    });

    it('supports higher powers x^3 - 2*x^2 + 4', () => {
      const result = evaluateMathFunction('x^3 - 2*x^2 + 4', 2);
      expect(result).toBe(4);
    });
  });

  describe('functions and constants', () => {
    it('evaluates trigonometric functions sin, cos, tan', () => {
      expect(evaluateMathFunction('sin(0)', 0)).toBeCloseTo(0);
      expect(evaluateMathFunction('cos(0)', 0)).toBeCloseTo(1);
      expect(evaluateMathFunction('sin(pi / 2)', 0)).toBeCloseTo(1);
      expect(evaluateMathFunction('tan(0)', 0)).toBeCloseTo(0);
    });

    it('evaluates a * sin(b * x)', () => {
      const result = evaluateMathFunction('a * sin(b * x)', Math.PI / 2, { a: 3, b: 1 });
      expect(result).toBeCloseTo(3);
    });

    it('evaluates sqrt and abs', () => {
      expect(evaluateMathFunction('sqrt(x)', 16)).toBe(4);
      expect(evaluateMathFunction('abs(x)', -7.5)).toBe(7.5);
      expect(evaluateMathFunction('abs(k * x)', 3, { k: -2 })).toBe(6);
    });

    it('supports mathematical constants pi and e', () => {
      expect(evaluateMathFunction('pi', 0)).toBeCloseTo(Math.PI);
      expect(evaluateMathFunction('e', 0)).toBeCloseTo(Math.E);
    });
  });

  describe('unary operators and parentheses', () => {
    it('evaluates unary minus -(x + 2)', () => {
      expect(evaluateMathFunction('-(x + 2)', 3)).toBe(-5);
      expect(evaluateMathFunction('-x^2', 3)).toBe(-9);
    });

    it('evaluates nested parentheses ((x + 1) * (x - 1))', () => {
      expect(evaluateMathFunction('((x + 1) * (x - 1))', 4)).toBe(15);
    });
  });

  describe('safety and edge cases', () => {
    it('returns NaN on negative sqrt safely', () => {
      const result = evaluateMathFunction('sqrt(x)', -4);
      expect(Number.isNaN(result)).toBe(true);
    });

    it('handles division by zero without crashing', () => {
      const result = evaluateMathFunction('1 / x', 0);
      expect(result === Infinity || Number.isNaN(result)).toBe(true);
    });

    it('returns NaN on syntax error without throwing', () => {
      expect(Number.isNaN(evaluateMathFunction('x +', 2))).toBe(true);
      expect(Number.isNaN(evaluateMathFunction('***', 2))).toBe(true);
      expect(Number.isNaN(evaluateMathFunction('', 2))).toBe(true);
      expect(Number.isNaN(evaluateMathFunction('foo(x)', 2))).toBe(true);
    });

    it('handles case-insensitive variable X', () => {
      expect(evaluateMathFunction('X^2', 5)).toBe(25);
    });
  });
});
