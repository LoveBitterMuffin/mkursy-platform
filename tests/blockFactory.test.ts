import { describe, it, expect } from 'vitest';
import { createDefaultBlock } from '../src/utils/blockFactory';

describe('createDefaultBlock', () => {
  it('creates default math block', () => {
    const block = createDefaultBlock('math', 'b1');
    expect(block.type).toBe('math');
    expect(block.id).toBe('b1');
    if (block.type === 'math') {
      expect(block.latex).toBe('f(x) = x^2');
    }
  });

  it('creates default plot block with parameters', () => {
    const block = createDefaultBlock('plot', 'b2');
    expect(block.type).toBe('plot');
    if (block.type === 'plot') {
      expect(block.params).toHaveLength(3);
    }
  });

  it('creates default quiz block', () => {
    const block = createDefaultBlock('quiz', 'b3');
    expect(block.type).toBe('quiz');
    if (block.type === 'quiz') {
      expect(block.options).toHaveLength(3);
      expect(block.correctOptionIndex).toBe(0);
    }
  });

  it('creates default text block', () => {
    const block = createDefaultBlock('text', 'b4');
    expect(block.type).toBe('text');
  });
});
