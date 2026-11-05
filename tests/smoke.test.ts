import { describe, it, expect } from 'vitest';

describe('Smoke test environment', () => {
  it('correctly executes math assertion in test runner', () => {
    expect(1 + 1).toBe(2);
  });
});
