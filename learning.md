Welcome to Learn Harness Engineering | Learn Harness Engineering
https://walkinglabs.github.io/learn-harness-engineering/en/


// TODO: AGENTS.md: project's tech stack, architectural conventions, and verification commands

// TODO: Map each failure to one of the five defense layers — task specification, context provision, execution environment, verification feedback, state management.

Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)

Verification commands:
- Tests: pytest tests/ -x
- Type check: mypy src/ --strict
- Lint: ruff check src/
- Full verification: make check (includes all above)


Work through the five layers systematically: task not clearly defined, insufficient context, misconfigured environment, missing verification, loss of state between sessions

Harness = Instructions + Tools + Environment + State + Feedback.


## before "clocking out," write down what was done, why, and what's next.

### At session start (clock in)
1. Read PROGRESS.md for current state
2. Read DECISIONS.md for important decisions
3. Run make check to confirm repo is in consistent state
4. Continue from PROGRESS.md "Next Steps" section

### Before session end (clock out)
1. Update PROGRESS.md
2. Run make check to confirm consistent state
3. Commit all completed work


# Startup Readiness Checklist

## Start Commands
- Install dependencies: `make setup`
- Start dev server: `make dev`
- Run tests: `make test`
- Full verification: `make check`

## Current State
- All dependencies installed and locked
- Test framework configured (Vitest + React Testing Library)
- Example test passing (1/1)
- Lint rules configured (ESLint + Prettier)

## Project Structure
- src/ — Source code
- src/components/ — React components
- src/api/ — API client
- tests/ — Test files


## Initialization Acceptance Checklist
- [ ] `make setup` succeeds from scratch
- [ ] `make test` has at least one passing test
- [ ] A new agent session can answer "how to run" and "how to test" from repo contents alone
- [ ] Task breakdown file exists with at least 3 tasks
- [ ] Everything committed to git

## Validation Hierarchy
- Level 1: Unit tests (Must pass)
- Level 2: Integration tests (Must pass)
- Level 3: End-to-end tests (Must pass when cross-component changes are involved)
- Skipping any required level = Not Complete

## Design Agent-Oriented Error Messages
Failure messages should contain three elements: what went wrong, why, and how to fix it:

ERROR: Found direct import of 'fs' in src/renderer/App.tsx:12WHY: Renderer process has no access to Node.js APIs for securityFIX: Move file operations to src/preload/file-ops.ts and call via window.ap

# Scoring Rubric

| Dimension | A | B | C | D |
|-----------|---|---|---|---|
| Code correctness | All tests pass | Main flow passes | Partial pass | Build fails |
| Architecture compliance | Fully compliant | Minor deviations | Obvious deviations | Serious violations |
| Test coverage | Main + edge cases | Main flow only | Only skeleton | No tests |

Write in CLAUDE.md:
## Session Exit Checklist
- [ ] Build passes (npm run build)
- [ ] All tests pass (npm test)
- [ ] Feature list updated
- [ ] No debug code remaining (console.log, debugger, TODO)
- [ ] Standard startup path available (npm run dev)


## The Maturity Ladder

Level 1: Goal Runner — You can use /goal to give a task with a stopping condition; the agent loops until met.
Level 2: Scheduled Single-Task — One automation runs one task on a timer (e.g., morning CI check).
Level 3: Multi-Agent Loop — Maker and checker split; each finding forks an isolated worktree.
Level 4: Self-Feeding Loop — The loop auto-discovers its next task from external state; it decides what to do next.
Level 5: Fleet Orchestration — Multiple loops run in parallel, independent but sharing a memory layer.
