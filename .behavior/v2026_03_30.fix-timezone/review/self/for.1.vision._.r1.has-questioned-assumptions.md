# self-review: has-questioned-assumptions

## assumptions examined

### 1. assumption: users want UTC

| question | answer |
|----------|--------|
| evidence? | wisher said "true timezone conversions" which implies correct UTC |
| what if opposite? | some users might want local time for display |
| did wisher say this? | implied, not explicit |
| counterexamples? | display use-cases where local time matters |

**assessment**: the `Z` suffix in IsoTimeStamp is a contract — it promises UTC. if the output is not UTC, the contract is violated. users who want local time should not use IsoTimeStamp.

**verdict: HOLDS** — UTC is the contract, not an assumption

### 2. assumption: toISOString is the right fix

| question | answer |
|----------|--------|
| evidence? | wisher explicitly suggested `toISOString().replace(/\.\d{3}Z$/, 'Z')` as option 1 |
| alternatives? | date-fns-tz (adds dependency), manual UTC calculation |
| did wisher say this? | yes, explicitly as recommended approach |

**verdict: NOT AN ASSUMPTION** — wisher specified this approach

### 3. assumption: no new dependencies is better

| question | answer |
|----------|--------|
| evidence? | wisher listed "no new dependency" as advantage |
| what if opposite? | date-fns-tz provides more timezone utilities |
| did wisher say this? | yes, in recommendation |

**verdict: NOT AN ASSUMPTION** — wisher specified this preference

### 4. assumption: date-fns/format outputs local time

| question | answer |
|----------|--------|
| evidence? | date-fns documentation, wisher confirmation |
| verified? | yes, code review shows literal `'Z'` in format string |
| what if wrong? | fix would be unnecessary |

**verdict: VERIFIED FACT** — not an assumption

### 5. assumption: IsoDateStamp also has the bug ⚠️

| question | answer |
|----------|--------|
| evidence? | same code pattern: `format(..., 'yyyy-MM-dd')` |
| what if opposite? | maybe dates without timezone are intentionally local? |
| did wisher say this? | no — wisher focused on timestamps |
| counterexamples? | a user in Tokyo asks "what's today?" — they want Tokyo's date |

**assessment**: this is ambiguous. a date string like `2026-03-30` has no timezone indicator. unlike timestamps with `Z`, there's no contract that says "this date is UTC."

two valid interpretations:
- `today()` returns "what day is it in UTC" — useful for server logs
- `today()` returns "what day is it where I am" — useful for user display

the current docs say "UTC date" but this may not match user expectations.

**verdict: SURFACED AMBIGUITY** — vision correctly flags this for wisher

### 6. assumption: the fix is straightforward

| question | answer |
|----------|--------|
| edge cases? | pre-1970 dates, invalid dates, DST |
| evidence? | toISOString handles negative timestamps; castInputToDate validates; UTC has no DST |
| what if wrong? | tests would fail |

**verdict: HOLDS** — edge cases are handled

### 7. hidden assumption: CI runs in UTC ⚠️

| question | answer |
|----------|--------|
| evidence? | wisher said "CI runs in UTC" in vision |
| what if not? | tests might already fail in some CI environments |
| verified? | should check CI environment config |

**assessment**: the assumption that CI runs in UTC is why the bug wasn't caught. the fix includes timezone-varied tests to prevent this.

**verdict: ACKNOWLEDGED** — vision addresses this with new test coverage

### 8. hidden assumption: truncation is safe

| question | answer |
|----------|--------|
| evidence? | toISOString always returns `YYYY-MM-DDTHH:mm:ss.sssZ` format |
| what if wrong? | regex might not match |
| alternatives? | `date.toISOString().slice(0, 19) + 'Z'` |

**assessment**: the regex `.replace(/\.\d{3}Z$/, 'Z')` assumes exactly 3 decimal places. this is guaranteed by the JS spec for toISOString.

**verdict: HOLDS** — format is spec-guaranteed

## summary

| assumption | status |
|------------|--------|
| users want UTC | HOLDS (contractual) |
| toISOString approach | NOT AN ASSUMPTION (wisher specified) |
| no new dependencies | NOT AN ASSUMPTION (wisher specified) |
| date-fns outputs local | VERIFIED FACT |
| IsoDateStamp bug | AMBIGUOUS (flagged for wisher) |
| fix is straightforward | HOLDS |
| CI runs in UTC | ACKNOWLEDGED (addressed by tests) |
| truncation is safe | HOLDS (spec-guaranteed) |

one ambiguous assumption (IsoDateStamp semantics) was correctly surfaced in the vision for wisher decision.
