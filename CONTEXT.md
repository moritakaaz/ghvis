# CONTEXT.md - ghvis

## Project Overview

An interactive CLI tool (npm package) that allows users to bulk-change the visibility of their GitHub repositories (public ↔ private) through a multiselect terminal interface.

- **npm package name**: `ghvis`
- **CLI command**: `ghvis` (runnable via `npx ghvis`)
- **Repository**: `moritakaaz/ghvis`

## Key Decisions

| Decision | Choice |
|----------|--------|
| Visibility directions | Both (public→private, private→public) |
| Authentication | GitHub PAT (interactive prompt) + `gh` CLI auth |
| Repo scope | Personal + Organization repos (admin access) |
| Terminal UI | Inquirer.js |
| Language | TypeScript (ESM) |
| CLI framework | Commander.js |
| Versioning | standard-version (conventional commits) |
| Commit enforcement | commitlint + husky |
| CI/CD | GitHub Actions (CI on push/PR, publish on tag) |
| Env files | None - token input at runtime only |
| Dependencies | Always use latest stable versions |

## Tech Stack

| Layer | Package |
|-------|---------|
| Language | TypeScript |
| Terminal UI | inquirer |
| GitHub API | @octokit/rest |
| CLI framework | commander |
| Versioning | standard-version |
| Commit lint | @commitlint/cli + @commitlint/config-conventional |
| Git hooks | husky |

## Features

1. Authenticate via interactive PAT prompt or `gh` CLI auth (auto-detect)
2. Fetch all repos (personal + org, paginated) where user has admin access
3. Multiselect repos with visibility filter (show current status)
4. Choose target visibility (public or private)
5. Confirmation prompt before applying changes
6. Batch API calls to change visibility
7. Success/failure summary

## Auth Flow (Runtime)

1. Check if `gh` CLI is authenticated → extract token from it
2. If not available, prompt user to input PAT directly in terminal
3. Token lives in memory only during session, never persisted to file

## Project Structure

```
mass-visibility-change/
├── src/
│   ├── index.ts          # CLI entry point (Commander)
│   ├── auth.ts           # Auth logic (PAT prompt + gh CLI detection)
│   ├── github.ts         # GitHub API (fetch repos, change visibility)
│   ├── prompts.ts        # Inquirer.js interactive prompts
│   └── types.ts          # TypeScript interfaces
├── .github/
│   └── workflows/
│       ├── ci.yml        # Lint + Build + Test on push/PR
│       └── publish.yml   # Publish to npm + GH Release on tag push (v*)
├── .husky/
│   └── commit-msg        # commitlint hook
├── package.json
├── tsconfig.json
├── .gitignore
├── .versionrc.json       # standard-version config
├── commitlint.config.js  # commitlint config
├── CONTEXT.md
└── README.md
```

## Versioning & Release

### Conventional Commit Format

```
feat: description     → minor bump (1.0.0 → 1.1.0)
fix: description      → patch bump (1.0.0 → 1.0.1)
feat!: description    → major bump (1.0.0 → 2.0.0)
chore: description    → no bump
docs: description     → no bump
refactor: description → no bump
```

### Release Workflow

```bash
# 1. Work on features with conventional commits
git commit -m "feat: add org repo support"
git commit -m "fix: handle pagination correctly"

# 2. When ready to release:
npx standard-version          # bumps version, updates CHANGELOG.md, creates git tag

# 3. Push to trigger CI + publish
git push --follow-tags

# GitHub Actions automatically:
#   → runs CI checks
#   → publishes to npm (triggered by v* tag)
#   → creates GitHub Release with changelog
```

## GitHub Actions

- **ci.yml**: Triggers on push/PR to any branch → install, lint, build
- **publish.yml**: Triggers on tag push (`v*`) → build, publish to npm, create GitHub Release

## Session Log

- **2026-06-01**: Project initialized. All decisions finalized. Implementation started.
