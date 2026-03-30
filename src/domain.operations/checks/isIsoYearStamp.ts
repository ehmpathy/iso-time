import { parseISO } from 'date-fns/parseISO';
import { withAssure } from 'type-fns';

import type { IsoYearStamp } from '@src/domain.objects/IsoTimeStamp';
import { castInputToDate } from '@src/domain.operations/casts/castInputToDate';

/**
 * .what = casts input to IsoYearStamp format in UTC
 * .why = converts various input types to strict ISO year
 * .format = yyyy
 *
 * timezone is always 'utc' — years are extracted from UTC representation
 */
export const asIsoYearStamp = (
  input: Parameters<typeof castInputToDate>[0],
  options?: {
    /** output timezone — always 'utc' */
    timezone?: 'utc';
  },
): IsoYearStamp => {
  const date = castInputToDate(input);
  return date.toISOString().slice(0, 4) as IsoYearStamp;
};

/**
 * .what = validates string is IsoYearStamp format
 * .why = runtime validation for external input
 */
export const isIsoYearStamp = withAssure(
  (input: string): input is IsoYearStamp => {
    try {
      // must be exactly 4 digits
      if (!/^\d{4}$/.test(input)) return false;

      // parse as first day of year, then format back
      const parsed = parseISO(`${input}-01-01`);
      return asIsoYearStamp(parsed) === input;
    } catch {
      return false;
    }
  },
);
