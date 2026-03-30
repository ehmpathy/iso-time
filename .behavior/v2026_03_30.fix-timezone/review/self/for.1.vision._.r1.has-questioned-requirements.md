# self-review: has-questioned-requirements

## requirements examined

### 1. fix asIsoTimeStamp to output true UTC

| question | answer |
|----------|--------|
| who said this was needed? | wisher, based on real keyrack bug |
| evidence? | debug output shows `nowIso: 2026-03-30T09:42:25.648Z` (correct) vs `expiresAt: 2026-03-30T05:12:25Z` (wrong local time with fake Z) |
| what if we didn't? | users in non-UTC timezones get wrong timestamps, tokens expire early, audit logs wrong |
| scope too large/small? | right-sized — fix the root cause |
| simpler way? | no — toISOString is already the simplest correct solution |

**verdict: HOLDS** — clearly needed, well-evidenced, correctly scoped

### 2. fix IsoDateStamp and IsoMonthStamp too

| question | answer |
|----------|--------|
| who said? | I proposed this as a question in vision |
| evidence? | same code pattern = same bug |
| what if we didn't? | date boundary bugs near midnight |
| scope? | reasonable extension of same fix |

**verdict: CORRECTLY FLAGGED AS QUESTION** — awaits wisher confirmation

### 3. use native toISOString() instead of date-fns/format

| question | answer |
|----------|--------|
| who said? | I proposed this as the fix approach |
| evidence? | JS spec guarantees toISOString returns UTC |
| alternatives? | date-fns-tz would add a dependency |
| simpler? | toISOString is simpler, no deps, spec-guaranteed |

**verdict: HOLDS** — simplest correct solution

### 4. today() should return UTC date

| question | answer |
|----------|--------|
| who said? | extant docs say "UTC date" |
| evidence? | JSDoc comment in code says ".what = returns current UTC date" |
| what if local? | would violate UTC-everywhere principle |

**verdict: CORRECTLY FLAGGED AS QUESTION** — semantics need wisher confirmation

### 5. test coverage with timezone variation

| question | answer |
|----------|--------|
| who said? | wisher explicitly in wish.md |
| quote | "we must also cover these defects with tests to ensure it can never happen again! (e.g., change the timezone for the test and prove it works)" |
| what if we didn't? | regression possible, latent bugs remain |

**verdict: HOLDS** — explicitly requested by wisher

## gaps I discovered

### 6. backwards compat / migration path

**issue**: vision mentions compat-break but dismisses it quickly. should we provide:
- a deprecation period?
- a flag to opt into old behavior?
- a migration guide?

**assessment**: code that "worked" was working by accident. the old behavior was objectively wrong — it produced timestamps that lie about their timezone. a flag to preserve wrong behavior would be harmful.

**verdict: NO ACTION NEEDED** — compat-break is the right choice. the changelog should be clear.

### 7. are there any functions that already use toISOString correctly?

**issue**: I should verify the full scope. are there any functions that already work correctly that we shouldn't touch?

**checked**: scanned `src/**/*.ts` — all format functions use `date-fns/format`. no extant correct implementations to preserve.

**verdict: SCOPE IS COMPLETE** — all affected functions identified

## summary

| requirement | status |
|-------------|--------|
| fix asIsoTimeStamp | HOLDS |
| fix IsoDateStamp/IsoMonthStamp | QUESTION FOR WISHER |
| use toISOString | HOLDS |
| today() UTC semantics | QUESTION FOR WISHER |
| timezone-varied tests | HOLDS |
| migration path | NOT NEEDED |
| scope verification | COMPLETE |

the vision correctly identifies the core fix and flags the ambiguous areas for wisher decision. no unexamined requirements remain.
