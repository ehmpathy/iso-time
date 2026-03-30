# self-review r2: triage open questions

## questions for wisher

### question 1: IsoDateStamp and IsoMonthStamp

> should we fix those too?

| triage check | result |
|--------------|--------|
| can answer via logic? | partially — same code pattern means same bug |
| can answer via docs/code? | JSDoc says "UTC" but no `Z` suffix in format |
| needs external research? | no |
| only wisher knows? | yes — this is scope decision |

**reason**: unlike `IsoTimeStamp` which has a `Z` suffix (contractually UTC), `IsoDateStamp` (`2026-03-30`) has no timezone indicator. the question is whether iso-time should be "UTC everywhere" or "timestamps are UTC, dates are local."

**verdict: [wisher]** — scope decision

### question 2: today() semantics

> should today() return UTC date or local date?

| triage check | result |
|--------------|--------|
| can answer via logic? | no — both interpretations are valid |
| can answer via docs/code? | JSDoc says "UTC" but that might be wrong |
| needs external research? | no |
| only wisher knows? | yes — intended design |

**reason**: "what day is it?" has two valid interpretations:
- UTC: useful for server logs, consistent across deployments
- local: useful for user-level features, "what day is it where I am"

the current JSDoc says "UTC" but we should verify this was intentional.

**verdict: [wisher]** — design intent

### question 3: semver strategy

> major version bump or patch?

| triage check | result |
|--------------|--------|
| can answer via logic? | partially — arguments both ways |
| can answer via docs/code? | no |
| needs external research? | no |
| only wisher knows? | yes — policy decision |

**reason**:
- **patch argument**: old behavior was a bug (wrong output), bug fixes are patch
- **major argument**: observable behavior changes, downstream code may break

both are valid semver interpretations.

**verdict: [wisher]** — policy decision

## external research

### item 1: date-fns/format uses local time

> confirmed via code read

**verdict: [answered]** — code shows `format(..., "...'Z'")`

### item 2: Date.toISOString returns UTC

> confirmed via JS spec

**verdict: [answered]** — ECMA-262 guarantees UTC output

### item 3: downstream consumers depend on buggy behavior

> need to check npm dependents

| triage check | result |
|--------------|--------|
| can answer via logic? | no |
| can answer via docs/code? | no |
| needs external research? | yes — npm search |
| only wisher knows? | no |

**verdict: [research]** — check `npm info iso-time` dependents

## summary

| question | verdict |
|----------|---------|
| IsoDateStamp/IsoMonthStamp scope | [wisher] |
| today() semantics | [wisher] |
| semver strategy | [wisher] |
| date-fns/format behavior | [answered] |
| toISOString behavior | [answered] |
| downstream dependents | [research] |

all questions are clearly triaged. no changes needed to vision — questions were already in "questions for wisher" section.
