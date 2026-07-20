# AGENTS.md

## Scope

Review the Runtime Dashboard implementation from PR #5.

## Required work

- Verify Runtime task, provider, attempt, steps, events, and final status rendering.
- Verify empty, active, blocked, failed, and completed states.
- Run focused checks:
  - npm run test:dashboard
  - npm run check
- Make only minimal fixes for confirmed defects.
- Add or update focused tests for any fix.

## Restrictions

- Do not merge the pull request.
- Do not deploy.
- Do not modify production systems.
- Do not access or modify secrets or .env files.
- Do not perform unrelated refactoring.
- Preserve the approved Dashboard UX unless correcting a confirmed defect.