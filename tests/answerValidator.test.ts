import { describe, it, expect } from 'vitest';
import { validateMathAnswer } from '../src/utils/answerValidator';

describe('answerValidator', () => {
  it('validates integer answers', () => {
    expect(validateMathAnswer('4', '4')).toBe(true);
    expect(validateMathAnswer('4', ' 4 ')).toBe(true);
    expect(validateMathAnswer('-5', '-5')).toBe(true);
    expect(validateMathAnswer('4', '5')).toBe(false);
  });

  it('validates decimal answers with dot or comma', () => {
    expect(validateMathAnswer('3.5', '3.5')).toBe(true);
    expect(validateMathAnswer('3.5', '3,5')).toBe(true);
    expect(validateMathAnswer('0.25', '0,25')).toBe(true);
    expect(validateMathAnswer('-1.2', '-1,2')).toBe(true);
    expect(validateMathAnswer('3.5', '3.50')).toBe(true);
  });

  it('validates fractions and equivalent decimals', () => {
    expect(validateMathAnswer('1/2', '0.5')).toBe(true);
    expect(validateMathAnswer('0.5', '1/2')).toBe(true);
    expect(validateMathAnswer('2/4', '1/2')).toBe(true);
    expect(validateMathAnswer('3/4', '0.75')).toBe(true);
    expect(validateMathAnswer('-1/4', '-0.25')).toBe(true);
  });

  it('validates interval strings and mathematical notation fallback', () => {
    expect(validateMathAnswer('[2; 5)', '[2; 5)')).toBe(true);
    expect(validateMathAnswer('[2; 5)', ' [2; 5) ')).toBe(true);
    expect(validateMathAnswer('(-inf; 3]', '(-inf; 3]')).toBe(true);
  });

  it('handles invalid user input gracefully without throwing', () => {
    expect(validateMathAnswer('5', 'abc')).toBe(false);
    expect(validateMathAnswer('5', '')).toBe(false);
    expect(validateMathAnswer('1/2', '1/0')).toBe(false);
  });
});
