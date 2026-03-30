import { parseISO } from 'date-fns/parseISO';
import { withAssure } from 'type-fns';

import type { IsoDateStamp } from '@src/domain.objects/IsoTimeStamp';
import { castInputToDate } from '@src/domain.operations/casts/castInputToDate';

/**
 * .what = casts input to IsoDateStamp format in UTC
 * .why = converts various input types to strict ISO date
 * .format = yyyy-MM-dd
 *
 * timezone is always 'utc' — dates are extracted from UTC representation
 */
export const asIsoDateStamp = (
  input: Parameters<typeof castInputToDate>[0],
  options?: {
    /** output timezone — always 'utc' */
    timezone?: 'utc';
  },
): IsoDateStamp => {
  const date = castInputToDate(input);
  return date.toISOString().slice(0, 10) as IsoDateStamp;
};

/**
 * .what = validates string is IsoDateStamp format
 * .why = runtime validation for external input
 */
export const isIsoDateStamp = withAssure(
  (input: string): input is IsoDateStamp => {
    try {
      return asIsoDateStamp(parseISO(input)) === input;
    } catch {
      return false;
    }
  },
);
