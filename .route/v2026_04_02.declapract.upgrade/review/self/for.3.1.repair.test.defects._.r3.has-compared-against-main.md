# self-review: has-compared-against-main (r3)

## verification

for each defect, confirmed:
1. "what changed?" was explicitly asked
2. `git diff origin/main -- <file>` was run
3. the diff informed the root cause analysis

## why this matters

the comparison against origin/main ensures we understand **why** the upgrade caused each defect, not just **that** a defect exists. without this step:
- we might fix symptoms rather than causes
- we might miss that the defect is a practice template issue
- we can't properly report the defect upstream

for both defects, the diff revealed the practice template introduced the problematic configuration. this confirms both are upstream issues that need template fixes.

## defect #1: depcheck flags rhachet-brains-xai

### what changed?

```sh
git diff origin/main -- .depcheckrc.yml
```

**diff shows**: only the line `- rhachet-brains-xai` was added by this fix. the practice template didn't add it to ignores when it added the dependency.

### how the diff informed root cause

the diff of package.json shows the practice upgrade added `rhachet-brains-xai` to devDependencies. but it didn't add a paired entry to `.depcheckrc.yml` ignores. the dependency and its ignore should be added together.

**lesson**: when a practice template adds a dynamically-loaded package, it must also add the depcheckrc ignore entry.

## defect #2: lint:cycles fails on node_modules

### what changed?

```sh
git diff origin/main -- package.json
```

**diff shows**:
- the practice upgrade added `test:lint:cycles` command
- the command used `--exclude '^$'` which is a no-op regex
- I changed it to `--exclude 'node_modules'`

relevant diff excerpt:
```diff
+    "test:lint:cycles": "dpdm --no-warning --no-tree --exit-code circular:1 --exclude 'node_modules' 'src/**/*.ts'",
```

### how the diff informed root cause

the diff shows the practice template introduced the `test:lint:cycles` command with an ineffective exclude pattern. the `'^$'` regex matches only empty strings, not file paths. when dpdm follows imports from `src/**/*.ts` into node_modules, it finds internal cycles in transitive dependencies.

**lesson**: the `--exclude` pattern must actually match paths. an empty-string regex like `'^$'` is effectively no exclude at all.

## other changes from upgrade

the diff also shows the practice upgrade changed:
- `declapract` 0.13.14 → 0.13.16
- `declapract-typescript-ehmpathy` 0.47.31 → 0.47.58
- `rhachet` 1.39.4 → 1.39.7
- `test-fns` 1.7.2 → 1.15.7
- `helpful-errors` 1.5.3 → 1.7.2
- added `dpdm` 4.0.1
- added `rhachet-brains-xai` 0.3.3
- added `domain-objects` 0.31.9 to dependencies

these changes are from the practice template and don't cause failures.

## conclusion

each defect was compared against origin/main. the diffs:
1. revealed the practice template introduced the problematic configurations
2. confirmed both are upstream issues (not codebase defects)
3. identified the specific template changes that need fixes
4. provided lessons for upstream practice improvement
