# ghvis

Bulk-change GitHub repository visibility (public ↔ private) through an interactive terminal interface.

## Features

- Interactive multiselect to pick repositories
- Supports both directions: public → private and private → public
- Auto-detects GitHub CLI (`gh`) authentication or prompts for a Personal Access Token
- Handles personal and organization repositories (requires admin access)
- Paginated repository fetching
- Confirmation prompt before applying changes
- Success/failure summary after execution

## Installation

```bash
# Install globally
npm install -g ghvis

# Or run directly with npx
npx ghvis
```

## Usage

Simply run the command and follow the interactive prompts:

```bash
ghvis
```

The tool will guide you through:

1. **Authentication** — automatically uses `gh` CLI auth if available, otherwise prompts for a PAT
2. **Select target visibility** — choose whether to make repos public or private
3. **Select repositories** — multiselect from eligible repos (only shows repos that can be changed)
4. **Confirm** — review your selection before applying
5. **Apply** — changes visibility and displays a summary

## Authentication

### GitHub CLI (recommended)

If you have the [GitHub CLI](https://cli.github.com/) installed and authenticated, `ghvis` will automatically use your existing session:

```bash
gh auth login
ghvis
```

### Personal Access Token

If `gh` CLI is not available, you will be prompted to enter a PAT directly in the terminal. The token requires the `repo` scope for full repository access.

The token is only held in memory during the session and is never written to disk.

## Requirements

- Node.js >= 18.0.0
- GitHub account with admin access to target repositories
- Either `gh` CLI authenticated or a PAT with `repo` scope

## Development

```bash
# Clone the repository
git clone git@github.com:moritakaaz/ghvis.git
cd ghvis

# Install dependencies
npm install

# Build
npm run build

# Lint (type-check only)
npm run lint
```

### Conventional Commits

This project uses [conventional commits](https://www.conventionalcommits.org/) enforced by commitlint + husky:

```
feat: add new feature        → minor version bump
fix: fix a bug               → patch version bump
feat!: breaking change       → major version bump
chore: maintenance           → no version bump
docs: documentation          → no version bump
refactor: code refactor      → no version bump
```

### Releasing

```bash
# Bump version, update CHANGELOG.md, and create a git tag
npx standard-version

# Push with tags to trigger CI + npm publish
git push --follow-tags
```

GitHub Actions will automatically:
- Run CI checks (lint + build on Node 18, 20, 22)
- Publish to npm (triggered by `v*` tag)
- Create a GitHub Release with changelog

## License

MIT
