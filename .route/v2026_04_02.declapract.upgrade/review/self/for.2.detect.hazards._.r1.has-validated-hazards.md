# self-review: has-validated-hazards

## verification results

ran verification commands to prove/disprove each hazard.

### hazard #4: tsconfig module changed — CONFIRMED

**command**: `npm run test:types`
**result**: exit code 2

**errors found**:
```
jest.acceptance.env.ts(5,22): error TS2307: Cannot find module '@jest/globals'
jest.integration.env.ts(6,22): error TS2307: Cannot find module '@jest/globals'
jest.integration.env.ts(84,7): error TS2554: Expected 0-1 arguments, but got 2.
blackbox/iso-time.acceptance.test.ts(55,8): error TS2307: Cannot find module '../dist'
```

**analysis**:
1. `@jest/globals` — the new jest env files import this, but types not found. need `@types/jest` to include it or change import strategy.
2. `Error(..., { cause })` — this 2-arg Error constructor requires ES2022+ target. the tsconfig change to `module: node16` doesn't change target, so this is a new pattern introduced by declapract that's incompatible with current target.
3. `../dist` — acceptance test imports from dist, which doesn't exist until build. this is expected and not a new issue.

**verdict**: hazard #4 is REAL. requires fixes.

### hazard #7: test:lint:cycles added — PRACTICES DEFECT

**command**: `npm run test:lint:cycles`
**result**: exit code 1

**errors found**:
```
• Circular Dependencies
  1) node_modules/.pnpm/helpful-errors@1.5.3/.../HelpfulError.js -> .../withHelpfulError.js
  2) node_modules/.pnpm/helpful-errors@1.5.3/.../index.js -> ... -> node_modules/.pnpm/type-fns@1.20.2/...
```

**analysis**:
- circular deps are in `node_modules/`, not in `src/`
- these are internal to external packages (helpful-errors, type-fns)
- dpdm follows imports into node_modules when it checks `src/**/*.ts`
- this is a **practices configuration defect**, not a codebase issue

**verdict**: hazard #7 is a PRACTICES DEFECT. the lint:cycles command needs `--exclude 'node_modules'` or similar. requires upstream fix to practices.

### other hazards — not yet verifiable

hazards #1-3, #5-6, #8-9 require:
- test execution (blocked by type errors)
- ci execution (premature at this stage)
- pr merge (not applicable yet)

will be validated in stone 3 (repair) after type errors are fixed.

## summary

| hazard | status | action |
|--------|--------|--------|
| #1 slowtest reporter | unverified | blocked by type errors |
| #2 keyrack replaces apikeys | unverified | blocked by type errors |
| #3 jest cli flag renamed | unverified | ci-only |
| #4 tsconfig module changed | **CONFIRMED** | fix in stone 3 |
| #5 biome rule added | likely fine | low risk |
| #6 prepare:rhachet in ci | unverified | ci-only |
| #7 test:lint:cycles | **FALSE POSITIVE** | report to infra |
| #8 branch protection context | likely fine | ci-only |
| #9 github app owner dynamic | likely fine | ci-only |

## fixes applied

1. **@jest/globals import** — removed unnecessary import from jest.integration.env.ts and jest.acceptance.env.ts. @types/jest declares jest globally.
2. **Error 2-arg constructor** — updated tsconfig.json: `target: es2020` → `es2022`, added `es2022` to lib array
3. **helpful-errors** — upgraded 1.5.3 → 1.7.2

## verification after fixes

- `npm run test:types` — **PASS**
- `npm run build` — **PASS**
- `npm run test:format` — **PASS**
- `npm run test:lint:biome` — **PASS**
- `npm run test:unit` (THOROUGH) — **PASS** (286 tests)

## practices defects to report upstream

- **lint:cycles**: dpdm needs `--exclude 'node_modules'` to avoid false positives from transitive deps
- **rhachet-brains-xai**: practice template includes by default, but most repos don't use xai brains — make conditional or opt-in
