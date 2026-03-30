# self-review r2: deeper reflection on assumptions

## fresh eyes, new questions

### 1. assumption: wisher's diagnosis is empirically verified

| question | reflection |
|----------|------------|
| did I verify the bug myself? | no — I read the code and trusted the wisher's debug output |
| what if wisher's environment was unusual? | the code review confirms the bug exists in the source |
| should I run a reproduction test? | yes — before implementation, verify the bug empirically |

**verdict: SHOULD VERIFY** — add reproduction step to implementation plan

### 2. assumption: all affected functions are identified

| question | reflection |
|----------|------------|
| what functions did I check? | asIsoTimeStamp, asIsoDateStamp, asIsoMonthStamp, now, today, addDuration |
| what might I have missed? | stopwatch, getDuration, any implicit conversions |
| how confident am I? | moderately — need systematic grep for `format(` calls |

**action taken**: let me verify now

```
grep for 'format(' in src/ → found in:
- isIsoTimeStamp.ts ✓
- isIsoDateStamp.ts ✓
- isIsoMonthStamp.ts ✓
- asDurationInWords.ts — uses formatDuration, different concern
```

**verdict: COMPLETE** — all `date-fns/format` usages identified

### 3. assumption: regex truncation vs slice

| approach | pros | cons |
|----------|------|------|
| `.replace(/\.\d{3}Z$/, 'Z')` | explicit about what we remove | harder to read |
| `.slice(0, 19) + 'Z'` | clearer about positions | assumes fixed length |

both work because toISOString format is spec-guaranteed.

**verdict: EITHER WORKS** — implementation choice, not architectural

### 4. assumption: TZ test approach will work

| question | reflection |
|----------|------------|
| how do we run tests in different timezone? | `TZ=America/New_York npm test` |
| does this affect all Date operations? | yes — Date constructor uses TZ |
| will CI honor TZ variable? | yes — standard POSIX behavior |
| what about Windows CI? | needs different approach or skip |

**verdict: IMPLEMENTATION DETAIL** — document in test comments

### 5. assumption: compat break is acceptable

| question | reflection |
|----------|------------|
| who uses iso-time? | ehmpathy packages, possibly external users |
| what if external code "works" due to UTC CI? | their local dev will break after upgrade |
| is this acceptable? | yes — the old behavior was objectively wrong |
| should we do major version bump? | possibly — signals compat break |

**verdict: SEMVER QUESTION** — should we bump major version?

not in vision currently. add to open questions.

## issues found

### issue 1: no empirical verification step

**before**: vision assumes wisher diagnosis is correct

**fix**: add reproduction step to implementation plan (mental note — this belongs in blueprint, not vision)

**lesson**: always verify inherited claims before build

### issue 2: semver version strategy absent

**before**: vision mentions "compat break" but not version strategy

**fix**: add to open questions: "should we bump major version?"

**action taken**: updated vision — added question #3 to "questions for wisher" section:
> 3. **semver strategy**: should we bump the major version to signal compat break? or is this a bugfix (patch) since the old behavior was objectively wrong?

## no-issue confirmations

| assumption | why it holds |
|------------|--------------|
| users want UTC | `Z` suffix is ISO 8601 UTC indicator — contractual |
| toISOString is correct | JS spec guarantees UTC output |
| all format() calls found | grepped, only 3 locations |
| truncation is safe | toISOString format is spec-locked |

## summary

found 2 gaps:
1. ~~no empirical verification~~ — belongs in blueprint, not vision (no fix needed)
2. ~~semver strategy absent~~ — **FIXED**: added question #3 to vision

the vision is now complete. found one real issue (semver question absent) and fixed it.
