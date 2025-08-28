# Github Doc Portal – Knowledge Base for Archon MCP

This repository is a centralized document portal for training Archon, my MCP server. Archon ingests documentation content from external web links and curated local documents in this repo to power RAG, task planning, and code assistance.

## Purpose
- Serve as the canonical, versioned Knowledge Base (KB)
- Track source links, ingestion criteria, and curation notes
- Provide structured docs for reliable ingestion by Archon

## Scope
- External web docs (captured as link manifests and snapshots when relevant)
- Local markdown files that summarize/normalize external content
- Component/API references, how-tos, and playbooks relevant to projects

## Repository Structure
- `/sources/` – link manifests to external docs, tagged and categorized
- `/docs/` – curated markdown docs derived from sources
- `/catch-up/` – session logs (auto-appended per project rule)
- `Project Log.md` – human-readable change log of sessions with versioning

## Archon Ingestion
- Archon scans link manifests and local docs to build embeddings and indexes
- Prefer clean, self-contained markdown with headings, tables of contents, and stable URLs
- Avoid copying large, dynamic pages; instead summarize key points with citations

## Contribution Guidelines
- Add JSDoc-style headers in utilities/components when applicable
- Update `docs/components.md` or `docs/utilities.md` when new items are added
- Include usage examples and note any CH5 signal or cronlib requirements

## License
TBD
