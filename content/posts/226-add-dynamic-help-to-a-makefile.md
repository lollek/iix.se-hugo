---
title: Add Dynamic Help to a Makefile
slug: "226"
date: 2026-09-11
categories: "Programming"
tags:
- makefile
- build-tools
summary: Keep Makefile help output synchronized with annotated public targets.
---

## When to Use This

Use this pattern when a Makefile has several user-facing targets and its help output should stay synchronized as targets are added or removed.

Each public target carries its own `##` description. The `help` target extracts those annotations instead of maintaining a separate list.

## Add the Help Target

```makefile
.DEFAULT_GOAL := help

.PHONY: help build test clean

help: ## Show available targets
	@awk 'BEGIN { FS = ":.*## "; printf "Usage:\n  make <target>\n\nTargets:\n" } /^[[:alnum:]_-]+:.*## / { printf "  %-10s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

build: ## Build the project
	build-command

test: ## Run the test suite
	test-command

clean: ## Remove generated files
	clean-command

internal-cache:
	internal-command
```

Recipe lines must begin with a tab, including the line containing `awk`.

## How It Works

- `.DEFAULT_GOAL := help` makes plain `make` display the help text.
- `##` distinguishes public targets from internal implementation targets.
- `FS = ":.*## "` splits each annotated line into its target and description.
- The regular expression accepts letters, numbers, underscores, and hyphens in target names.
- `$(MAKEFILE_LIST)` scans the main Makefile and any included Makefiles.
- `$$1` and `$$2` escape the dollar signs so Make passes `$1` and `$2` to `awk`.

Targets without a `##` annotation, such as `internal-cache`, remain available but do not appear in the generated help.

## Add or Remove Targets

Add a public target by placing its description on the target line:

```makefile
deploy: build ## Deploy the built project
	deploy-command
```

`make help` will include `deploy` automatically. Removing the target removes it
from the output. No separate help list needs updating.

Leave off the annotation for internal targets:

```makefile
.cache-ready: dependencies.lock
	install-command
	@touch $@
```

## Verification

Run:

```sh
make help
```

Confirm that every annotated target appears once, internal targets are absent, and descriptions align correctly. Use `make -n <target>` to inspect a target's commands without running them when the recipe supports a dry run.

## Troubleshooting

### A target is missing

Ensure its definition contains a space after `##`:

```makefile
target: dependencies ## Description
```

### The recipe reports an `awk` syntax error

Use `$$1` and `$$2` inside the Makefile. A single dollar sign is interpreted by
Make before the command reaches `awk`.

### A target appears more than once

Only annotate one definition of a target. This matters when a target is extended across multiple included Makefiles.