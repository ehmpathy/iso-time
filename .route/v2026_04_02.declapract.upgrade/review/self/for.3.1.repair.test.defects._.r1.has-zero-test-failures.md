# self-review: has-zero-test-failures (r1)

## verification

ran `THOROUGH=true npm run test` on 2026-04-02.

## test suite results

| check | result |
|-------|--------|
| test:commits | PASS |
| test:types | PASS |
| test:format | PASS |
| test:lint:biome | PASS |
| test:lint:cycles | PASS |
| test:lint:deps | PASS |
| test:unit | PASS (286 tests) |
| test:integration | PASS (16 tests) |
| test:acceptance:locally | PASS (25 tests) |

## why it holds

the test suite passes because:

1. **type errors were fixed in stone 2** - tsconfig target changed to es2022 to support Error.cause pattern introduced by the upgrade. the @jest/globals import was removed since @types/jest provides globals.

2. **depcheck now ignores rhachet-brains-xai** - the package is required for xai brain support. depcheck doesn't detect its dynamic import pattern, so it must be in the ignores list.

3. **dpdm now excludes node_modules** - the `--exclude 'node_modules'` pattern prevents dpdm from following imports into transitive dependencies and reporting their internal cycles as failures.

4. **no code logic changes** - all fixes were configuration changes (tsconfig, depcheckrc, package.json). the actual source code in src/ was not modified, so the 286 unit tests, 16 integration tests, and 25 acceptance tests continue to verify the same behavior.

## defects fixed

### defect #1: depcheck flags rhachet-brains-xai

**how diagnosed**: ran `npm run test:lint:deps`, depcheck reported `rhachet-brains-xai` as unused.

**root cause**: the package is required for xai brain support but depcheck doesn't detect its dynamic usage pattern. the practice template added the dependency but didn't add it to the depcheckrc ignores.

**how fixed**: added `rhachet-brains-xai` to `.depcheckrc.yml` ignores list, alongside the extant `rhachet-brains-anthropic` entry.

**lesson**: when a practice adds a new rhachet brain package, it should also add it to depcheckrc ignores.

### defect #2: lint:cycles fails on node_modules

**how diagnosed**: ran `npm run test:lint:cycles`, dpdm reported circular deps in node_modules paths (helpful-errors, type-fns).

**root cause**: the dpdm command used `--exclude '^$'` which is a no-op regex pattern. dpdm followed imports into node_modules when scanning `src/**/*.ts` and found internal cycles in transitive dependencies.

**how fixed**: changed `--exclude '^$'` to `--exclude 'node_modules'` in package.json test:lint:cycles command.

**lesson**: the `--exclude` pattern in dpdm must actually match paths to exclude. the `'^$'` pattern matches only empty strings, not file paths.

## practices defects to report upstream

| defect | required fix |
|--------|--------------|
| depcheck ignores | practice template should include `rhachet-brains-xai` in depcheckrc ignores |
| lint:cycles exclude | practice template should use `--exclude 'node_modules'` in dpdm command |

## conclusion

zero test failures. the test suite holds because all configuration defects were addressed without modifying source code. two practices defects identified for upstream template updates.
