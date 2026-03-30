import type { IsoTimeStamp } from '@src/domain.objects/IsoTimeStamp';
import { asIsoTimeStamp } from '@src/domain.operations/checks/isIsoTimeStamp';

/**
 * .what = returns current UTC timestamp
 * .why = provides type-safe access to current time
 * .format = yyyy-MM-ddTHH:mm:ssZ or yyyy-MM-ddTHH:mm:ss.SSSZ
 *
 * timezone is always 'utc' (the Z suffix in ISO 8601)
 *
 * precision modulates the precision of seconds:
 * - 'whole.x10^0' = whole seconds (strip milliseconds)
 * - 'milli.x10^-3' = milliseconds (include .SSS)
 * - undefined = auto-detect (include ms if non-zero)
 */
export const now = (options?: {
  /** output timezone — always 'utc' (the Z suffix in ISO 8601) */
  timezone?: 'utc';
  /** modulates precision of seconds: 'whole.x10^0' (seconds) or 'milli.x10^-3' (milliseconds) */
  precision?: 'milli.x10^-3' | 'whole.x10^0';
}): IsoTimeStamp => asIsoTimeStamp(new Date(), options);
