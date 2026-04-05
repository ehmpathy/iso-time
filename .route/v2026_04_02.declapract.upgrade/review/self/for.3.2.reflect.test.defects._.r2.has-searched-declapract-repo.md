# self-review: has-searched-declapract-repo (r2)

## verification

reviewed `3.2.reflect.test.defects.v1.i1.md` to verify each practice bug citation is backed by `gh search code` results.

## what the guide asks

> did we search declapract-typescript-ehmpathy via gh cli for the exact practice?
> for each practice bug, cite the root cause with a link or search result.

---

## defect #1: depcheck flags rhachet-brains-xai

### what 3.2 claims

from `3.2.reflect.test.defects.v1.i1.md`:

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

### were gh searches done?

**search #1**: find where rhachet-brains-xai is added
```sh
gh search code --repo ehmpathy/declapract-typescript-ehmpathy "rhachet-brains-xai"
```

**actual result from search**:
```
ehmpathy/declapract-typescript-ehmpathy:src/practices/rhachet/best-practice/package.json: "rhachet-brains-xai": "@declapract{check.minVersion('0.3.1')}",
```

**matches 3.2 citation?** yes — exact match

**search #2**: find depcheckrc practice template
```sh
gh search code --repo ehmpathy/declapract-typescript-ehmpathy "rhachet-brains" filename:.depcheckrc
```

**actual result from search**:
```
ehmpathy/declapract-typescript-ehmpathy:src/practices/lint/best-practice/.depcheckrc.yml: - rhachet-brains-anthropic
```

**matches 3.2 citation?** yes — exact match (confirms xai is absent)

### verification result

defect #1 citations are backed by gh search results.

---

## defect #2: lint:cycles node_modules

### what 3.2 claims

from `3.2.reflect.test.defects.v1.i1.md`:

> the lint best-practice has an ineffective exclude pattern:
> ```
> ehmpathy/declapract-typescript-ehmpathy:src/practices/lint/best-practice/package.json
> "test:lint:cycles": "dpdm --no-warning --no-tree --exit-code circular:1 --exclude '^$' 'src/**/*.ts'",
> ```
>
> the `--exclude '^$'` regex matches only empty strings — a no-op.

### were gh searches done?

**search**: find lint:cycles practice source
```sh
gh search code --repo ehmpathy/declapract-typescript-ehmpathy "lint:cycles"
```

**actual result from search**:
```
ehmpathy/declapract-typescript-ehmpathy:src/practices/lint/best-practice/package.json: "test:lint:cycles": "dpdm --no-warning --no-tree --exit-code circular:1 --exclude '^$' 'src/**/*.ts'",
```

**matches 3.2 citation?** yes — exact match (confirms `--exclude '^$'` pattern)

### verification result

defect #2 citation is backed by gh search results.

---

## why it holds

### each practice bug has search evidence

| defect | claim in 3.2 | gh search done? | search result matches? |
|--------|--------------|-----------------|------------------------|
| #1 (depcheck) | rhachet adds rhachet-brains-xai | yes | yes - exact match |
| #1 (depcheck) | lint depcheckrc lacks xai ignore | yes | yes - confirms absent |
| #2 (lint:cycles) | lint has `--exclude '^$'` no-op | yes | yes - exact match |

### citations use full paths

3.2 includes the full repo:file:content format which makes them:
1. verifiable — anyone can run the same search
2. traceable — exact file path documented
3. reproducible — content matches what gh search returns

### search strategy was correct

the searches targeted the defect symptoms:
- defect #1: searched for the package name (`rhachet-brains-xai`) that depcheck flagged
- defect #1: searched for rhachet-brains in depcheckrc files to verify xai is absent
- defect #2: searched for the npm command name (`lint:cycles`) that failed

this ensures the practice source files are the actual root cause, not coincidental matches.

## conclusion

all practice bug citations in 3.2 are backed by `gh search code` results from `ehmpathy/declapract-typescript-ehmpathy`. the root causes were identified via targeted searches and the citations exactly match the search results.
