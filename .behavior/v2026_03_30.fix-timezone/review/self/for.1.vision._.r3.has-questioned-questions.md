# self-review r3: final triage of questions

## what I found

reviewed the vision's "open questions & assumptions" section.

### issues found

**issue 1: questions lacked verdict tags**

the questions were listed but not triaged with `[wisher]`, `[answered]`, or `[research]` tags.

**fix applied**: added verdict tags to all questions in vision.

**issue 2: question 1 (IsoDateStamp scope) was mis-triaged**

I initially marked question 1 as `[wisher]`, but re-read the wish:

> "we must eliminate that and do true timezone conversions **everywhere**"

the wisher said "everywhere" — not just asIsoTimeStamp. so the scope question is answered by the wish itself.

**fix applied**: update vision to mark question 1 as `[answered]` with explanation.

### confirmations

**why question 1 (IsoDateStamp scope) is now [answered]**:
- the wish says "everywhere" — explicit scope directive
- IsoDateStamp and IsoMonthStamp are part of "everywhere"
- no wisher input needed — they already said the scope

**why question 2 (today() semantics) is [wisher]**:
- "what day is it?" is ambiguous by nature
- both UTC and local interpretations are valid
- the JSDoc says "UTC" but that could have been a mistake
- only the wisher knows the intended design

**why question 3 (semver) is [wisher]**:
- semver policy is an org decision
- both patch (bug fix) and major (compat break) are defensible
- only the wisher can set this policy

**why research item 3 (downstream dependents) is [research]**:
- cannot answer without npm registry query
- not urgent — can be done in research phase
- may affect semver decision

## summary

| issue | status |
|-------|--------|
| questions unlabeled | FIXED — all have verdict tags |
| question 1 mis-triaged | FIXED — changed from `[wisher]` to `[answered]` |

| question | verdict |
|----------|---------|
| question 1 (scope) | [answered] — wisher said "everywhere" |
| question 2 (today semantics) | [wisher] — design intent |
| question 3 (semver) | [wisher] — policy decision |

**all fixes applied**. the vision now has:
- question 1: `[answered]` with explanation from wish
- questions 2-3: `[wisher]` with justification
- external research: `[answered]` or `[research]` tags

the vision is ready for wisher review on the 2 open `[wisher]` questions.
