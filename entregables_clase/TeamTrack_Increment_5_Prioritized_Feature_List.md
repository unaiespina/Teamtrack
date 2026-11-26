# TeamTrack — Increment 5: Prioritized Feature List and MVP Closure

**Status:** Academic prioritization complete; MVP flows are available in the local prototype. This is not a declaration of commercial readiness.

## Objective

Close the academic MVP scope using Increment 4 stories US-01–US-19, rank the features by value and dependency, and document acceptance criteria, prototype limitations, and the work required before a production release.

## Prioritization method

- **P0 — Essential:** required for the coach's core team organization and record keeping.
- **P1 — Valuable:** improves visibility or resilience but does not block demonstration of the core workflow.
- **P2 — Deferred:** depends on capabilities outside this local prototype or a later product decision.

These are product scope priorities, not effort estimates or delivery commitments. Each feature has one priority so the backlog is actionable.

## Prioritized feature list

| Rank | ID | Feature | Stories | Priority | Prototype status | Dependencies / notes |
|---:|---|---|---|---|---|---|
| 1 | F-01 | Team and season workspace | US-01–02 | P0 | Partially implemented | High; editing season dates is not exposed in the UI. |
| 2 | F-02 | Multi-sport roster and lifecycle | US-03–05 | P0 | Implemented in prototype | High; optional member fields and deactivation preserve history. |
| 3 | F-03 | Training and match calendar | US-06–08 | P0 | Implemented in prototype | Depends on F-01; month navigation is not restricted to season dates. |
| 4 | F-04 | Attendance and manual notes | US-09–10 | P0 | Implemented in prototype | Depends on roster and events; missing entries remain unregistered. |
| 5 | F-05 | Multi-sport results and history | US-11–12 | P0 | Implemented in prototype | Depends on events; score component labels can be configured. |
| 6 | F-06 | Team dashboard and JSON export | US-13–14 | P1 | Implemented in prototype | Depends on F-01–05; export is a manual local copy, not an automatic server backup. |
| 7 | F-07 | Role-based portals and AI support | US-15–19 | P2 | Not implemented | Requires authentication, authorization, privacy controls, AI integration, and human approval. |

## Increment 4 connected to the prototype

The **Historias** navigation view presents all 19 stories, concise acceptance criteria, priority, and links to the relevant PS scenario. P0/P1 stories link to available flows; P2 stories are marked future and do not pretend to offer an active workflow. The view also presents this prioritized feature list.

## Increment acceptance criteria

1. All seven features are ranked and have one P0, P1, or P2 priority.
2. The mapping between features and US-01–US-19 is visible and consistent with Increment 4.
3. Status distinguishes prototype implementation, partial implementation, and future work.
4. Team, roster, calendar, attendance, notes, results, history, and export workflows can be opened from the interface.
5. Missing values are not converted to zero, absence, or invented text.
6. The documentation distinguishes the local academic prototype from a production product.

## Final academic prototype scope

- Local management of teams, seasons, members, trainings, matches, attendance, notes, and scores.
- Dashboard, calendar, history, scenarios, prioritized stories, and JSON export.
- Persistence in the browser's local storage, without multi-user synchronization.

## Work required before commercialization

The prototype is not ready for commercial release. At minimum, a later product and engineering phase must address:

- A backend and shared database with migrations, validation, and observability.
- Secure sign-in, account recovery, roles, and server-verified team authorization.
- Automated backups and tested recovery; encryption and secret management.
- Privacy, retention, consent, and processing of minors' data, with legal review for the target market.
- Automated functional, accessibility, and security testing; error handling and auditability.
- Deployment, domain, monitoring, support, terms of service, and incident response.
- Validation with coaches and clubs, pricing research, onboarding, and usage measurement.
- If AI is added: provider selection, data safeguards, usage limits, evaluation, traceability, and human approval before applying changes.

This is a readiness plan, not a claim that those controls are implemented or a substitute for legal, security, or market review.

## Closure decision

The academic MVP scope and feature prioritization are complete. Commercial release requires a separate phase for architecture, security, privacy, user validation, and operations. P2 stories remain outside the current product.

## Traceability

| Feature | Increment 4 stories | Scenarios | Status |
|---|---|---|---|
| F-01 | US-01–02 | PS-01 | Partial prototype |
| F-02 | US-03–05 | PS-02 | Prototype |
| F-03 | US-06–08 | PS-03 | Prototype |
| F-04 | US-09–10 | PS-04, PS-05 | Prototype |
| F-05 | US-10–12 | PS-05 | Prototype |
| F-06 | US-13–14 | PS-01–PS-05 | Prototype |
| F-07 | US-15–19 | Supporting personas / AI | Deferred P2 |

