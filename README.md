# EoT Archaeologist

**Dig through your codebase and discover why things exist.**

EoT Archaeologist is a command-line tool for exploring the history behind your code. It uses Git history to trace a file or specific line back to the commit that introduced it, helping you understand how and why code ended up where it is.

> **Status:** Experimental — actively under development.

## What it does

Given a file:

```bash
npm run dev -- explain package.json
```

EoT Archaeologist shows recent Git history for that file.

You can also investigate a specific line:

```bash
npm run dev -- explain src/cli.ts:12
```

For a line-level investigation, EoT Archaeologist can currently show:

- The commit that introduced the line
- The author
- The commit date
- The commit message
- The source code on that line
- Files changed by the originating commit
- Historical commit diffs for a specific file (being integrated into the CLI)

EoT Archaeologist can also investigate files in a **different local Git repository**, not just the repository where the tool is being developed.

For example:

```bash
npm run dev -- explain /path/to/another-project/src/auth.ts:47
```

## Why?

Git can tell you *when* code changed.

EoT Archaeologist is being built to help answer the more useful question:

> **Why does this code exist?**

The long-term goal is to connect:

```text
File / Line
    ↓
Git Blame
    ↓
Commit
    ↓
Commit Diff
    ↓
GitHub Pull Request
    ↓
GitHub Issue / Discussion
    ↓
Historical Context
    ↓
Human-readable Explanation
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/EthanOnToast/EoT-Archaeologist.git
cd EoT-Archaeologist
npm install
```

Build the project:

```bash
npm run build
```

Run it during development:

```bash
npm run dev -- explain src/cli.ts:12
```

## Current capabilities

- [x] Git file history
- [x] Line-level Git archaeology
- [x] Commit metadata
- [x] Files changed by an originating commit
- [x] External/local Git repository support
- [x] Commit diff retrieval
- [x] Display commit diffs in the CLI

## Roadmap

- [x] Line-level Git archaeology
- [x] External repository support
- [x] Retrieve commit diffs
- [x] Display useful commit diffs in the CLI
- [ ] GitHub repository URL support
- [ ] Pull request discovery
- [ ] GitHub issue and discussion discovery
- [ ] Historical context and explanations
- [ ] AI-powered explanations
- [ ] VS Code extension
- [ ] npm package

## Development

The project is written in TypeScript and currently uses:

- Node.js
- TypeScript
- Commander
- Chalk
- simple-git

Build:

```bash
npm run build
```

Run locally:

```bash
npm run dev -- explain src/cli.ts:12
```

The project is intentionally being built incrementally. The goal is to make each stage useful on its own while working toward deeper code archaeology.

## Contributing

EoT Archaeologist is an open-source project and contributions are welcome.

Ideas, issues, improvements, and experiments are encouraged.

## License

ISC
