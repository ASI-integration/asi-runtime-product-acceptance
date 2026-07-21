# AGENTS.md

## Repository purpose

This repository is a clean product-generation acceptance target for ASI Runtime.

## Source of truth

The current ASI Runtime task envelope is the authoritative implementation request.

## Protected baseline

Do not modify:

- tests/baseline.test.mjs
- docs/agent-os/**
- .agents/**
- scripts/agent-os/**
- lib/process-launch.mjs

## Implementation rules

- Work only on paths declared in the current task envelope.
- Keep the application local and self-contained.
- Do not perform unrelated changes.
- Run npm test and npm run build before finishing.
