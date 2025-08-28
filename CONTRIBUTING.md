# Contributing Guidelines

Thank you for contributing to the Github Doc Portal! This repo hosts curated documentation and link manifests for Archon (MCP) ingestion.

## Ground Rules
- Do not commit secrets, credentials, or private data.
- Prefer concise, well-structured markdown with headings and citations.
- Summarize large/volatile external pages; link to the source.
- Use PRs for all changes to `main` and follow branch protection rules.

## Adding External Sources
1. Create or update a manifest in `/sources/` (see `manifest-template.json`).
2. For significant sources, add a curated summary under `/docs/` with citations.
3. Use stable URLs where possible (docs sites, versioned pages).

## Documentation Structure
- `/sources/` contains machine-readable manifests for ingestion
- `/docs/` contains curated markdown derived from sources

## Large Files
- Use Git LFS for binaries (e.g., `.zip`, `.exe`, `.pdf`, media).
- Avoid storing unnecessary large files; prefer links to vendor sites.

## Commit Messages
Follow the project style (see `git.md` rule in workspace):
- `docs: description` for documentation updates
- Include affected file names in the message

## Code of Conduct
Be respectful and constructive. Assume best intent and provide actionable feedback.
