import { parseISO } from 'date-fns/parseISO';
import { withAssure } from 'type-fns';

import type { IsoTimeStamp } from '@src/domain.objects/IsoTimeStamp';
import { castInputToDate } from '@src/domain.operations/casts/castInputToDate';

/**
 * .what = casts input to IsoTimeStamp format in UTC
 * .why = converts various input types to strict ISO timestamp
 * .format = yyyy-MM-ddTHH:mm:ssZ or yyyy-MM-ddTHH:mm:ss.SSSZ
 *
 * timezone is always 'utc' (the Z suffix in ISO 8601)
 *
 * precision modulates the precision of seconds:
 * - 'whole.x10^0' = whole seconds (strip milliseconds)
 * - 'milli.x10^-3' = milliseconds (include .SSS)
 * - undefined = auto-detect (include ms if non-zero)
 *
 * @example
 * asIsoTimeStamp(new Date()) // auto-detect: includes ms if non-zero
 * asIsoTimeStamp(date, { precision: 'milli.x10^-3' }) // always include milliseconds
 * asIsoTimeStamp(date, { precision: 'whole.x10^0' }) // always strip milliseconds
 */
export const asIsoTimeStamp = (
  input: Parameters<typeof castInputToDate>[0],
  options?: {
    /** output timezone — always 'utc' (the Z suffix in ISO 8601) */
    timezone?: 'utc';
    /** modulates precision of seconds: 'whole.x10^0' (seconds) or 'milli.x10^-3' (milliseconds) */
    precision?: 'milli.x10^-3' | 'whole.x10^0';
  },
): IsoTimeStamp => {
  const date = castInputToDate(input);
  const iso = date.toISOString();

  // explicit precision overrides auto-detection
  if (options?.precision === 'milli.x10^-3') return iso as IsoTimeStamp;
  if (options?.precision === 'whole.x10^0')
    return iso.replace(/\.\d{3}Z$/, 'Z') as IsoTimeStamp;

  // auto-detect: include ms if non-zero
  const hasMs = date.getMilliseconds() !== 0;
  if (hasMs) return iso as IsoTimeStamp;
  return iso.replace(/\.\d{3}Z$/, 'Z') as IsoTimeStamp;
};

/**
 * .what = validates string is IsoTimeStamp format
 * .why = runtime validation for external input
 * .accepts = yyyy-MM-ddTHH:mm:ssZ or yyyy-MM-ddTHH:mm:ss.SSSZ
 */
export const isIsoTimeStamp = withAssure(
  (input: string): input is IsoTimeStamp => {
    try {
      const parsed = parseISO(input);
      const hasMs = /\.\d{3}Z$/.test(input);
      const expected = hasMs
        ? asIsoTimeStamp(parsed, { precision: 'milli.x10^-3' })
        : asIsoTimeStamp(parsed);
      return expected === input;
    } catch {
      return false;
    }
  },
);
