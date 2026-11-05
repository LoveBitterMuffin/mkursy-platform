/**
 * Parses a numeric or fraction string into a number.
 * Supports: "4", "-3.5", "3,5", "1/2", "-3/4".
 */
export function parseMathValue(val: string): number | null {
  const trimmed = val.trim().replace(/\s+/g, '').replace(',', '.');
  if (!trimmed) return null;

  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length !== 2) return null;
    const num = Number(parts[0]);
    const den = Number(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return num / den;
  }

  const num = Number(trimmed);
  if (isNaN(num)) return null;
  return num;
}

/**
 * Validates whether user-entered answer matches expected answer.
 * Handles numeric/fraction equivalence and fallback string comparison.
 */
export function validateMathAnswer(expected: string, actual: string): boolean {
  if (!actual || typeof actual !== 'string') return false;

  const expNorm = expected.trim().toLowerCase().replace(',', '.');
  const actNorm = actual.trim().toLowerCase().replace(',', '.');

  if (expNorm === actNorm) return true;

  const expNum = parseMathValue(expected);
  const actNum = parseMathValue(actual);

  if (expNum !== null && actNum !== null) {
    return Math.abs(expNum - actNum) < 1e-6;
  }

  const cleanExp = expNorm.replace(/\s+/g, '');
  const cleanAct = actNorm.replace(/\s+/g, '');
  return cleanExp === cleanAct;
}
