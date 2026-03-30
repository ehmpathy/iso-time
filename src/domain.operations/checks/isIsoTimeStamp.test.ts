import {
  asIsoTimeStamp,
  isIsoTimeStamp,
} from '@src/domain.operations/checks/isIsoTimeStamp';

describe('isIsoTimeStamp', () => {
  describe('asIsoTimeStamp', () => {
    it('should cast Date to IsoTimeStamp format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = asIsoTimeStamp(date);
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });

    it('should cast string to IsoTimeStamp format', () => {
      const result = asIsoTimeStamp('2024-01-15T14:30:00Z');
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });

    it('should cast { mse } to IsoTimeStamp format', () => {
      const mse = new Date('2024-01-15T14:30:00Z').getTime();
      const result = asIsoTimeStamp({ mse });
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });

    it('should cast { date } to IsoTimeStamp format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = asIsoTimeStamp({ date });
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });

    it('should output correct UTC regardless of input timezone representation', () => {
      // all of these represent the same instant in time
      const inputs = [
        new Date('2024-01-15T14:30:00Z'),
        '2024-01-15T14:30:00Z',
        '2024-01-15T09:30:00-05:00', // same instant in EST
        { mse: new Date('2024-01-15T14:30:00Z').getTime() },
      ];
      for (const input of inputs) {
        expect(asIsoTimeStamp(input)).toEqual('2024-01-15T14:30:00Z');
      }
    });

    it('should include milliseconds when precision is milli.x10^-3', () => {
      const date = new Date('2024-01-15T14:30:00.123Z');
      const result = asIsoTimeStamp(date, { precision: 'milli.x10^-3' });
      expect(result).toEqual('2024-01-15T14:30:00.123Z');
    });

    it('should include milliseconds when precision is milli.x10^-3 even if zero', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const result = asIsoTimeStamp(date, { precision: 'milli.x10^-3' });
      expect(result).toEqual('2024-01-15T14:30:00.000Z');
    });

    it('should strip milliseconds when precision is whole.x10^0', () => {
      const date = new Date('2024-01-15T14:30:00.999Z');
      const result = asIsoTimeStamp(date, { precision: 'whole.x10^0' });
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });

    it('should auto-include non-zero milliseconds by default', () => {
      const date = new Date('2024-01-15T14:30:00.123Z');
      const result = asIsoTimeStamp(date);
      expect(result).toEqual('2024-01-15T14:30:00.123Z');
    });

    it('should auto-strip zero milliseconds by default', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const result = asIsoTimeStamp(date);
      expect(result).toEqual('2024-01-15T14:30:00Z');
    });
  });

  describe('isIsoTimeStamp', () => {
    it('should return true for valid IsoTimeStamp format', () => {
      expect(isIsoTimeStamp('2024-01-15T14:30:00Z')).toBe(true);
    });

    it('should return true for midnight timestamp', () => {
      expect(isIsoTimeStamp('2024-01-15T00:00:00Z')).toBe(true);
    });

    it('should return true for end of day timestamp', () => {
      expect(isIsoTimeStamp('2024-01-15T23:59:59Z')).toBe(true);
    });

    it('should return false for timestamp without Z suffix', () => {
      expect(isIsoTimeStamp('2024-01-15T14:30:00')).toBe(false);
    });

    it('should return false for timestamp without seconds', () => {
      expect(isIsoTimeStamp('2024-01-15T14:30Z')).toBe(false);
    });

    it('should return false for timestamp with space instead of T', () => {
      expect(isIsoTimeStamp('2024-01-15 14:30:00Z')).toBe(false);
    });

    it('should return false for date only (no time)', () => {
      expect(isIsoTimeStamp('2024-01-15')).toBe(false);
    });

    it('should return true for timestamp with milliseconds', () => {
      expect(isIsoTimeStamp('2024-01-15T14:30:00.000Z')).toBe(true);
      expect(isIsoTimeStamp('2024-01-15T14:30:00.123Z')).toBe(true);
    });

    it('should return false for invalid string', () => {
      expect(isIsoTimeStamp('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isIsoTimeStamp('')).toBe(false);
    });
  });
});
