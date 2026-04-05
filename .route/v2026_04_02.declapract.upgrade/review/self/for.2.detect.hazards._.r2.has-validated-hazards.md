# self-review: has-validated-hazards (r2)

## hazards verified via tests

### hazard #4: tsconfig module changed — FIXED

**verified by**: `npm run test:types` after fix

**fix applied**:
- `tsconfig.json`: changed `target: es2020` → `es2022`
- `tsconfig.json`: added `es2022` to lib array (was only `DOM`)
- removed `import { jest } from '@jest/globals'` from jest env files (unnecessary — @types/jest declares globals)

**why fix works**: Error.cause requires ES2022 target and lib. the declapract upgrade introduced this pattern in jest.integration.env.ts line 84.

**lesson**: when a practice upgrade introduces new patterns, check if they require different tsconfig settings.

### hazard #7: test:lint:cycles — PRACTICES DEFECT

**verified by**: `npm run test:lint:cycles` output shows cycles only in node_modules

**analysis**: dpdm follows imports into node_modules when it scans `src/**/*.ts`. the circular deps are internal to `helpful-errors` and `type-fns` packages.

**action**: practices fix required — need `--exclude 'node_modules'` in dpdm command. not a codebase issue.

### hazard #1: slowtest reporter added — VERIFIED WORKS

**verified by**: `npm run test:unit` output showed:
```
slowtest report:
----------------------------------------------------------------------
total: 1s 83ms
files: 27
```

the reporter loads and runs without error. hazard dispelled.

### hazard #5: biome noThisInStatic rule — VERIFIED NO IMPACT

**verified by**: `npm run test:lint:biome:all` showed 44 prior warnings, but none from noThisInStatic rule.

the codebase has no `this` usage in static methods, so the new rule has no impact. hazard dispelled.

### hazards #2, #3, #6, #8, #9 — CI-TIME OR LOW-RISK

these hazards cannot be verified locally:
- #2 keyrack: human must set up keyrack for tests that need api keys
- #3 jest cli flag: `--testPathPatterns` is ci-only; local runs use `--changedSince`
- #6 prepare:rhachet in ci: only runs in workflow
- #8 branch protection: only matters at merge time
- #9 github app owner: only matters for non-ehmpathy forks

## test results after fixes

| check | result |
|-------|--------|
| test:types | PASS |
| build | PASS |
| test:format | PASS |
| test:lint:biome | PASS |
| test:unit (THOROUGH) | PASS (286 tests) |

## conclusion

hazard #4 was real and fixed. hazard #7 is a practices defect (requires upstream fix). other hazards are ci-time or low-risk. ready to proceed to stone 3.

## practices defects to report upstream

- **lint:cycles**: dpdm needs `--exclude 'node_modules'` to avoid false positives
- **rhachet-brains-xai**: practice template includes by default, but most repos don't use xai brains
