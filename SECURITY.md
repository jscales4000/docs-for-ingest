# Security Policy

This repository is public to allow Archon (MCP server) to ingest documentation via public URLs. To keep the repo secure and free of sensitive data:

## Reporting a Vulnerability
- Please open a private security advisory or email the maintainer instead of filing a public issue.

## Data Handling Rules
- Do not commit secrets, credentials, API keys, or tokens.
- Prefer citations and summaries over copying large third-party content.
- Respect licenses and include links to original sources.

## Binary/Large Files
- Use Git LFS for large binaries (e.g., .zip, .exe, .pdf). See `.gitattributes`.
- Avoid committing unnecessary binaries; link to vendor sources when possible.

## Access Model
- Public read access (for Archon ingestion via raw.githubusercontent.com or github.com URLs)
- Write access limited to approved maintainers via branch protection and PR review.

## Branch Protection (Recommended)
- Require PRs for main
- Require 1 approval and status checks to pass
- Disallow force pushes to main
