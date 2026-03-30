import { isIsoTimeStamp } from '@src/domain.operations/checks/isIsoTimeStamp';
import { now } from '@src/domain.operations/observe/now';

describe('now', () => {
  it('should return a valid IsoTimeStamp', () => {
    const result = now();
    expect(isIsoTimeStamp(result)).toBe(true);
  });

  it('should end with Z (UTC)', () => {
    const result = now();
    expect(result.endsWith('Z')).toBe(true);
  });

  it('should match IsoTimeStamp format (with or without milliseconds)', () => {
    const result = now();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
  });

  it('should return current time (within tolerance)', () => {
    const before = Date.now();
    const result = now();
    const after = Date.now();

    const resultMs = new Date(result).getTime();
    expect(resultMs).toBeGreaterThanOrEqual(before - 1000);
    expect(resultMs).toBeLessThanOrEqual(after + 1000);
  });

  it('should always include milliseconds when precision is milli.x10^-3', () => {
    const result = now({ precision: 'milli.x10^-3' });
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should always strip milliseconds when precision is whole.x10^0', () => {
    const result = now({ precision: 'whole.x10^0' });
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});
