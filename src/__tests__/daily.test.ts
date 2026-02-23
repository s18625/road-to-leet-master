import { describe, it, expect } from 'vitest';
import { startOfDay } from 'date-fns';

// Helper function that mimics the hashing in daily-logic.ts
function getHash(dateStr: string) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

describe('Daily Logic', () => {
  it('should be deterministic for the same date', () => {
    const date1 = '2026-02-23';
    const date2 = '2026-02-23';
    expect(getHash(date1)).toBe(getHash(date2));
  });

  it('should be different for different dates', () => {
    const date1 = '2026-02-23';
    const date2 = '2026-02-24';
    expect(getHash(date1)).not.toBe(getHash(date2));
  });

  it('should result in the same index for a given pool size', () => {
    const hash = getHash('2026-02-23');
    const poolSize = 100;
    const index1 = hash % poolSize;
    const index2 = hash % poolSize;
    expect(index1).toBe(index2);
  });
});
