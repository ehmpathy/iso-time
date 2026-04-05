# self-review: has-complete-defect-entries (r4)

## verification

reviewed `.route/v2026_04_02.declapract.upgrade/3.1.repair.test.defects.v1.i1.md` for completeness.

for each defect entry, confirmed:
- what: the defect is described
- how: what changed? (diff against origin/main is documented)
- why: root cause is documented (why the change caused the defect)
- fix: how it was fixed is documented

## defect #1: depcheck flags rhachet-brains-xai

### what (describes the defect)
> "depcheck fails — reports `rhachet-brains-xai` as unused"

**quality**: clear and specific. identifies the tool (depcheck), the symptom (reports as unused), and the subject (rhachet-brains-xai).

### how (what changed — diff against main)
> ```diff
> + "rhachet-brains-xai": "0.3.3",
> ```
> the declapract upgrade added this dependency

**quality**: includes the actual diff. shows exactly what the practice upgrade introduced.

### why (root cause)
> "the package is required for xai brain support but depcheck doesn't detect its usage pattern"

**quality**: explains the mismatch — the package is needed but its dynamic usage pattern isn't detected by depcheck's static analysis.

### fix (how it was fixed)
> "added `rhachet-brains-xai` to `.depcheckrc.yml` ignores"

**quality**: specific and actionable. states the exact file and what was added.

## defect #2: lint:cycles fails on node_modules

### what (describes the defect)
> "dpdm detects circular deps in node_modules, not src/"

**quality**: clear. identifies the tool (dpdm), the symptom (detects cycles), and the key insight (in node_modules, not src/).

### how (what changed — diff against main)
> "`npm run test:lint:cycles` exits 1"
> "the `--exclude '^$'` pattern is a no-op"

**quality**: explains both the observable symptom (exit 1) and the root configuration issue (ineffective exclude pattern).

### why (root cause)
> "dpdm follows imports into node_modules when it scans `src/**/*.ts`. the `--exclude '^$'` pattern is a no-op. the circular deps are internal to external packages (helpful-errors, type-fns)."

**quality**: comprehensive. explains the behavior (follows imports), the configuration defect (no-op regex), and the source of the cycles (transitive deps).

### fix (how it was fixed)
> "changed `--exclude '^$'` to `--exclude 'node_modules'`"

**quality**: specific and actionable. shows the before/after change.

## why it holds

each defect entry exceeds minimum requirements:

1. **what** - both entries clearly identify the failure mode with specific tool and symptom
2. **how** - both entries document what changed, with defect #1 including the actual diff
3. **why** - both entries explain root cause with technical detail, not just symptoms
4. **fix** - both entries document specific file changes

additionally, both entries include a **practices fix required** field documenting what needs to be reported upstream.

## conclusion

all defect entries are complete and well-structured. the inventory provides sufficient detail for:
- future debugging (if the same defect recurs)
- upstream reporting (practice template fixes needed)
- knowledge transfer (why each fix was chosen)
