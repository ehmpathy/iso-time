import { parseISO } from 'date-fns/parseISO';
import { withAssure } from 'type-fns';

import type { IsoMonthStamp } from '@src/domain.objects/IsoTimeStamp';
import { castInputToDate } from '@src/domain.operations/casts/castInputToDate';

/**
 * .what = casts input to IsoMonthStamp format in UTC
 * .why = converts various input types to strict ISO month
 * .format = yyyy-MM
 *
 * timezone is always 'utc' — months are extracted from UTC representation
 */
export const asIsoMonthStamp = (
  input: Parameters<typeof castInputToDate>[0],
  options?: {
    /** output timezone — always 'utc' */
    timezone?: 'utc';
  },
): IsoMonthStamp => {
  const date = castInputToDate(input);
  return date.toISOString().slice(0, 7) as IsoMonthStamp;
};

/**
 * .what = validates string is IsoMonthStamp format
 * .why = runtime validation for external input
 */
export const isIsoMonthStamp = withAssure(
  (input: string): input is IsoMonthStamp => {
    try {
      // parse as first day of month, then format back
      const parsed = parseISO(`${input}-01`);
      return asIsoMonthStamp(parsed) === input;
    } catch {
      return false;
    }
  },
);
