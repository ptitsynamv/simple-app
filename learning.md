// TODO: AGENTS.md: project's tech stack, architectural conventions, and verification commands

// TODO: Map each failure to one of the five defense layers — task specification, context provision, execution environment, verification feedback, state management.

Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)


Work through the five layers systematically: task not clearly defined, insufficient context, misconfigured environment, missing verification, loss of state between sessions
