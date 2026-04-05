# self-review: has-complete-defect-coverage (r1)

## verification

cross-referenced `3.1.repair.test.defects.v1.i1.md` against `3.2.reflect.test.defects.v1.i1.md` to verify each defect has a classification and root cause analysis.

## defect coverage matrix

| defect in 3.1 | covered in 3.2? | classification | root cause cited? | upstream fix documented? |
|---------------|-----------------|----------------|-------------------|-------------------------|
| #1 depcheck flags rhachet-brains-xai | yes | practice bug | yes | yes |
| #2 lint:cycles node_modules | yes | practice bug | yes | yes |

---

## defect #1: depcheck flags rhachet-brains-xai

### from 3.1 (repair inventory)

> **what**: depcheck fails — reports `rhachet-brains-xai` as unused
> **fix**: added `rhachet-brains-xai` to `.depcheckrc.yml` ignores
> **practices fix required**: practice template should include `rhachet-brains-xai` in depcheckrc ignores by default

### from 3.2 (reflection)

> **classification**: practice bug
>
> the rhachet best-practice adds the dependency:
> ```
> ehmpathy/declapract-typescript-ehmpathy:src/practices/rhachet/best-practice/package.json
> "rhachet-brains-xai": "@declapract{check.minVersion('0.3.1')}",
> ```
>
> but the lint best-practice depcheckrc only ignores anthropic, not xai:
> ```
> ehmpathy/declapract-typescript-ehmpathy:src/practices/lint/best-practice/.depcheckrc.yml
> - rhachet-brains-anthropic
> ```

### verification

the reflection correctly:
1. classifies as practice bug (not repo quirk — affects all repos with both practices)
2. cites the exact practice source files from `ehmpathy/declapract-typescript-ehmpathy`
3. identifies the inconsistency (rhachet adds dep, lint lacks ignore)
4. documents upstream fix (add to lint practice depcheckrc)

**coverage: complete**

---

## defect #2: lint:cycles node_modules

### from 3.1 (repair inventory)

> **what**: dpdm detects circular deps in node_modules, not src/
> **how**: `npm run test:lint:cycles` exits 1
> **why**: dpdm follows imports into node_modules when it scans `src/**/*.ts`. the `--exclude '^$'` pattern is a no-op.
> **fix**: changed `--exclude '^$'` to `--exclude 'node_modules'` in package.json
> **practices fix required**: practice template should use `--exclude 'node_modules'` in dpdm command

### from 3.2 (reflection)

> **classification**: practice bug
>
> the lint best-practice has an ineffective exclude pattern:
> ```
> ehmpathy/declapract-typescript-ehmpathy:src/practices/lint/best-practice/package.json
> "test:lint:cycles": "dpdm --no-warning --no-tree --exit-code circular:1 --exclude '^$' 'src/**/*.ts'",
> ```
>
> the `--exclude '^$'` regex matches only empty strings — a no-op.

### verification

the reflection correctly:
1. classifies as practice bug (not repo quirk — affects all repos with deps that have internal cycles)
2. cites the exact practice source file with the defective pattern
3. explains the technical root cause (`'^$'` is a no-op regex)
4. documents upstream fix (change to `--exclude 'node_modules'`)

**coverage: complete**

---

## why it holds

### all defects accounted for

3.1 documents 2 defects. 3.2 classifies 2 defects. count matches.

### classifications are sound

both defects classified as **practice bug**, not repo quirk or adoption candidate. this is correct because:

1. **not repo quirks**: both defects will affect any repo that adopts these practices. iso-time has no special characteristics that cause these failures.

2. **not adoption candidates**: these are defects in the practice templates themselves, not patterns iso-time uses that others should adopt.

3. **practice bugs**: the practice templates have internal inconsistencies (rhachet adds dep that lint doesn't ignore) and defective patterns (`'^$'` no-op regex).

### root cause analysis is complete

for each defect, the reflection:
- identifies the source practice file
- quotes the relevant code or configuration
- explains why the defect occurs
- documents the upstream fix needed

### evidence trail is intact

the citations from `gh search code --repo ehmpathy/declapract-typescript-ehmpathy` are verifiable. anyone can run the same searches and confirm the practice sources.

## conclusion

complete defect coverage verified. all 2 defects from 3.1 are present in 3.2 with:
- correct classification (practice bug)
- cited practice sources
- technical root cause analysis
- upstream fix documentation
