# TeamTrack User Stories

**Increment:** 4 — User stories  
**Status:** Defined, traced to scenarios and requirements, and available in the local prototype’s Historias view  
**Basis:** TeamTrack Product Definition (Inc. 1), Persona Descriptions (Inc. 2), Persona Scenarios (Inc. 3), Requirements (`FR-01`–`FR-25`), and Design (`UC-01`–`UC-06`)

## Purpose

This increment translates the persona scenarios from Increment 3 into atomic, testable **User Stories** with concrete acceptance criteria. Each story identifies who needs the capability, what action they perform, and why it adds value. The primary focus remains **Alex Rivera** (amateur coach, MVP primary persona), while future-scope stories for **Jordan Lee** (sports coordinator), **Sam Patel** (player), **Taylor Morgan** (parent/guardian), and the optional **AI assistant** are explicitly separated as **P2** backlog items.

## Scope and conventions

- **Canonical format:** *As [persona], I want to [goal/action] so that [expected benefit].*
- **Priority scale:**
  - **P0 (Must have):** Essential for the minimum viable coaching workflow and demo.
  - **P1 (Should have):** High-value refinement included in the local prototype without blocking core flows.
  - **P2 (Future / Optional):** Documented for future increments; no multi-user accounts, notifications, or live AI provider are active in the current prototype.
- **Data honesty & multi-sport rules:** Missing attendance, results, or optional fields remain explicitly unregistered/pending (never coerced to zero or inferred). Sport-specific fields (positions, jersey numbers, result components) stay optional and configurable across sports.

## Primary Persona User Stories — Alex Rivera (Coach)

### 1. Team and Season Setup (Scenario PS-01)

#### US-01 — Create a team and link it to a season
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-01, FR-01, FR-02, UC-01  
**Story:** As Alex Rivera, I want to create a team with a name, configurable sport, and associated season so that all roster, schedule, and activity records belong to a clear organizational context.

**Acceptance criteria:**
1. Saving a team with a valid non-empty name, sport selection, and season name adds it to the workspace and sets it as the active team.
2. Selecting an existing season name reuses that season rather than creating a duplicate season record.
3. Invalid or missing required fields display a clear validation message and do not save partial data.
4. Reopening the application preserves the selected team, sport, and season.

#### US-02 — Inspect and update team and season details
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P1 · **Traces to:** PS-01, FR-03, FR-04, UC-01  
**Story:** As Alex Rivera, I want to view and edit my team's name, sport, and season dates so that basic organizational details stay accurate throughout the year.

**Acceptance criteria:**
1. The dashboard and workspace header clearly display the active team name, sport, and season.
2. Editing the team name, sport, or optional season start/end dates updates the displayed details without losing linked members, events, or historical records.
3. If both season dates are entered, the system rejects an end date earlier than the start date.

---

### 2. Roster Lifecycle Management (Scenario PS-02)

#### US-03 — Add a member with optional sport-specific fields
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-02, FR-05, FR-09, NFR-06, UC-02  
**Story:** As Alex Rivera, I want to add a team member by entering their name and optionally their jersey number and position/role so that I can build a roster quickly without being forced into basketball-specific fields.

**Acceptance criteria:**
1. Entering a non-empty member name creates an active member linked to the current team.
2. Jersey number and position/role can be left blank and appear as unassigned (`—`) rather than guessed values.
3. Teams configured for sports other than basketball (such as volleyball or football) can add members without basketball-specific roles.

#### US-04 — View and search the team roster
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-02, FR-06, NFR-01, UC-02  
**Story:** As Alex Rivera, I want to view the roster and filter members by name, number, or role so that I can verify who is currently on the team before a session.

**Acceptance criteria:**
1. The roster view lists members with their optional sport details and active/inactive status, and the navigation badge reflects the active member count.
2. When no members exist yet, the interface displays a clear empty state prompting the coach to add the first member.
3. Filtering by search text updates the visible rows immediately without altering stored records.

#### US-05 — Edit member details and deactivate without losing history
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P1 · **Traces to:** PS-02, FR-07, FR-08, UC-02  
**Story:** As Alex Rivera, I want to edit a member's details or mark them as inactive when they leave the squad so that my active roster stays clean while past attendance records remain intact.

**Acceptance criteria:**
1. Editing a member updates their existing record in place without creating a duplicate entry.
2. Deactivating a member changes their status to inactive, excludes them from active counts and future attendance lists, and preserves all past attendance entries.
3. An inactive member can be reactivated later if they rejoin the team.

---

### 3. Activity Scheduling and Calendar (Scenario PS-03)

#### US-06 — Schedule a training session or match
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-03, FR-10, FR-13, UC-03  
**Story:** As Alex Rivera, I want to schedule a training session or match with date, time, and optional venue, opponent, or notes so that upcoming team commitments are organized in one calendar.

**Acceptance criteria:**
1. The coach can choose between `Training` and `Match`, enter a required date and time, and optionally provide a venue and notes.
2. The opponent field is shown only for matches and remains optional; blank optional fields stay explicitly pending/blank.
3. Upon saving, the activity appears in the monthly calendar and upcoming dashboard list sorted chronologically.

#### US-07 — Browse upcoming and past events in the calendar
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-03, FR-11, UC-03  
**Story:** As Alex Rivera, I want to navigate my team's calendar by month and distinguish upcoming activities from past ones so that I can prepare for the week ahead.

**Acceptance criteria:**
1. Events are ordered chronologically by date and time and visually tagged by type (`Training` vs. `Match`) and status (`Scheduled` vs. `Cancelled`).
2. Month navigation controls allow reviewing previous and future months within the configured season date range.
3. If a month has no scheduled events, an informative empty state is displayed.

#### US-08 — Edit or cancel a scheduled activity
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P1 · **Traces to:** PS-03, FR-12, UC-03  
**Story:** As Alex Rivera, I want to update an activity's details or cancel it without deleting it so that schedule changes are clear while preserving a full record of planned sessions.

**Acceptance criteria:**
1. Editing an event updates its date, time, venue, opponent, or notes in place.
2. Cancelling an event marks it as `Cancelled`, removes it from the dashboard's active upcoming list, and keeps it visible in the calendar and history.

---

### 4. Training Attendance and Session Notes (Scenario PS-04)

#### US-09 — Record member attendance for a training session
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-04, FR-14, FR-18, NFR-05, UC-04  
**Story:** As Alex Rivera, I want to mark each active member as present, absent, late, or excused for a training session so that I have an accurate attendance record without confusing unrecorded entries with absences.

**Acceptance criteria:**
1. Opening a training session lists active team members with a default state of `Unregistered` (`Sin registrar`).
2. Saving attendance persists selected statuses (`Present`, `Absent`, `Late`, `Excused`) and leaves untouched members explicitly `Unregistered`.
3. Reopening the session reloads the exact saved statuses and never converts `Unregistered` into `Absent` or `0`.

#### US-10 — Save manual notes on a training or match session
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-04, PS-05, FR-15, NFR-05, UC-04, UC-05  
**Story:** As Alex Rivera, I want to write and update manual notes on an activity in my own words so that tactical observations or reminders are stored alongside the session.

**Acceptance criteria:**
1. Notes entered by the coach are saved directly to the selected event and displayed when reopening the event detail.
2. The system never auto-generates or alters coach notes; if left empty, no fabricated text is inserted.

---

### 5. Multi-Sport Match Results and History (Scenario PS-05)

#### US-11 — Record a match result using sport-appropriate labeled components
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-05, FR-16, NFR-06, NFR-10, UC-05  
**Story:** As Alex Rivera, I want to record a match score using a configurable component label (such as points, sets, or goals) and numeric values for my team and the opponent so that results remain accurate across different sports.

**Acceptance criteria:**
1. Opening a match allows entering a component label (defaulting to `Points`, editable to `Sets`, `Goals`, etc.) and non-negative numeric values for both sides.
2. Saving associates the result directly with that match event and displays it in the calendar, history, and dashboard.
3. Matches without a saved result display `No result` / `Pending` rather than `0 – 0` or an inferred winner.

#### US-12 — Review past sessions and match results in the history view
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P1 · **Traces to:** PS-05, FR-17, FR-18, UC-06  
**Story:** As Alex Rivera, I want to consult a filterable history of past trainings and matches so that I can review attendance completion, notes, and recorded scores across the season.

**Acceptance criteria:**
1. The history view displays past events for the active team only, ordered from most recent to oldest.
2. Filter controls allow viewing `All`, `Trainings`, or `Matches`.
3. Each history card links directly to its event detail modal and clearly distinguishes saved records from pending/unregistered data.

---

### 6. Traceable Team Dashboard and Local Backup (Scenarios PS-01–PS-05)

#### US-13 — Monitor team status from a traceable summary dashboard
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P0 · **Traces to:** PS-01–PS-05, FR-19, FR-20, FR-21, NFR-04, UC-06  
**Story:** As Alex Rivera, I want to view a summary dashboard with active roster count, next scheduled activity, non-cancelled activities scheduled for the active team, and recent activity so that I can understand my team's current state at a glance.

**Acceptance criteria:**
1. Every counter on the dashboard (active members, next activity date, total activities, matches with recorded scores) is derived directly from stored records for the active team.
2. Clicking an upcoming event opens its detail record; navigation links jump directly to the full roster or calendar.
3. When no events, members, or historical records exist, helpful empty states explain what is missing without inventing metrics.

#### US-14 — Export a local JSON backup of team records
**Persona:** Alex Rivera (Amateur Coach) · **Priority:** P1 · **Traces to:** NFR-04, NFR-09 (Prototype Resilience)  
**Story:** As Alex Rivera, I want to download a JSON backup of my team's seasons, roster, events, attendance, and results so that I do not lose my records stored in the local browser.

**Acceptance criteria:**
1. Clicking the export action downloads a valid JSON file containing the current state and an export timestamp.
2. Exporting does not mutate or clear any active data in local storage.

---

## Future Persona & Optional AI User Stories (Out of MVP Scope — P2)

These user stories document requirements derived from supporting personas (**Jordan Lee**, **Sam Patel**, **Taylor Morgan**) and the optional **AI assistant** (`FR-22`–`FR-25`). They are explicitly deferred to future increments and are **not** active as multi-user accounts or external AI integrations in the current prototype.

| Story ID | Persona | User Story | Acceptance Criteria Summary | Priority & Status |
|---|---|---|---|---|
| **US-15** | Jordan Lee (Sports Coordinator) | As Jordan Lee, I want to view a consolidated summary across multiple authorized teams and seasons so that I can oversee club activity without accessing unauthorized squads. | Coordinator role sees only teams explicitly assigned; cross-team metrics link back to each team's underlying records (`NFR-03`, `NFR-04`). | **P2** · Deferred (multi-account auth out of MVP) |
| **US-16** | Sam Patel (Player) | As Sam Patel, I want to view my team's upcoming training and match schedule in a read-only mobile view so that I know when and where to attend without modifying team records. | Player access is strictly read-only, scoped to shared team events, and hides private coach notes (`NFR-03`, `NFR-07`). | **P2** · Deferred (player portal out of MVP) |
| **US-17** | Taylor Morgan (Parent / Guardian) | As Taylor Morgan, I want to consult authorized schedule updates for my child's youth team so that I can coordinate transport and attendance safely. | Guardian sees only authorized schedule notices for the linked youth team; no unrestricted roster or personal data is exposed (`NFR-03`). | **P2** · Deferred (family portal out of MVP) |
| **US-18** | Alex Rivera (Coach + AI Support) | As Alex Rivera, I want to ask for a summary of my team's recorded activity that explicitly declares missing data so that I can review trends without relying on fabricated statistics. | AI response cites only recorded team entries, flags unregistered attendance/results, and is visually labeled as AI-generated (`FR-22`, `FR-25`). | **P2** · Optional / Out of MVP |
| **US-19** | Alex Rivera (Coach + AI Support) | As Alex Rivera, I want any AI-generated training or schedule proposal to remain a draft until I explicitly confirm it so that I retain full control over sporting decisions. | Proposals never write directly to calendar, roster, or records without a separate user confirmation action (`FR-23`, `FR-24`). | **P2** · Optional / Out of MVP |

---

## End-to-End Traceability Matrix

| Persona | Scenario | User Stories | Functional & Quality Requirements | Design Use Case |
|---|---|---|---|---|
| Alex Rivera | PS-01 Prepare a team for a season | US-01, US-02 | FR-01–FR-04, NFR-02, NFR-06 | UC-01 |
| Alex Rivera | PS-02 Update the roster | US-03, US-04, US-05 | FR-05–FR-09, NFR-01, NFR-06 | UC-02 |
| Alex Rivera | PS-03 Schedule the next activity | US-06, US-07, US-08 | FR-10–FR-13, NFR-02 | UC-03 |
| Alex Rivera | PS-04 Record a completed training session | US-09, US-10 | FR-14, FR-15, FR-18, NFR-05 | UC-04 |
| Alex Rivera | PS-05 Save a match result & review activity | US-10, US-11, US-12 | FR-15–FR-18, NFR-05, NFR-06, NFR-10 | UC-05, UC-06 |
| Alex Rivera | PS-01–PS-05 Cross-cutting visibility | US-13, US-14 | FR-19–FR-21, NFR-04, NFR-09 | UC-06 |
| Jordan, Sam, Taylor, Alex (AI) | Future & optional scenarios | US-15–US-19 | FR-22–FR-25, NFR-03, NFR-07 | Future scope |

---

## Candidate Feature Grouping (Bridge to Increment 5 — Prioritized Feature List)

The user stories above group into seven candidate product features for prioritization in the next deliverable:

| Feature ID | Candidate Feature Name | Included User Stories | Priority | MVP Status |
|---|---|---|---|---|
| **F-01** | Team & Season Workspace Management | US-01, US-02 | **P0** | Implemented in local prototype |
| **F-02** | Multi-Sport Roster & Lifecycle Management | US-03, US-04, US-05 | **P0** | Implemented in local prototype |
| **F-03** | Team Activity Calendar (Trainings & Matches) | US-06, US-07, US-08 | **P0** | Implemented in local prototype |
| **F-04** | Honest Attendance & Manual Session Notes | US-09, US-10 | **P0** | Implemented in local prototype |
| **F-05** | Configurable Multi-Sport Match Results & History | US-11, US-12 | **P0** | Implemented in local prototype |
| **F-06** | Traceable Team Dashboard & JSON Export | US-13, US-14 | **P1** | Implemented in local prototype |
| **F-07** | Multi-Role Portals & Human-Approved AI Assistant | US-15, US-16, US-17, US-18, US-19 | **P2** | Documented future scope |

---

## Increment 4 Acceptance Criteria

1. Every scenario from Increment 3 (`PS-01`–`PS-05`) is decomposed into persona-linked user stories (`US-01`–`US-14`) using the canonical *"As [persona], I want to [action] so that [benefit]"* format.
2. Each user story includes concrete, observable acceptance criteria that enforce data honesty (missing values remain unregistered/pending) and multi-sport flexibility.
3. Supporting personas (`Jordan Lee`, `Sam Patel`, `Taylor Morgan`) and optional AI support (`FR-22`–`FR-25`) are captured as explicit **P2** user stories (`US-15`–`US-19`) without implying active implementation in the MVP.
4. Full traceability links Personas (Inc. 2), Scenarios (Inc. 3), User Stories (Inc. 4), Requirements (`FR`/`NFR`), and Use Cases (`UC-01`–`UC-06`).
5. The local prototype exposes a `Historias` view connecting each story to its scenario and available workflow; future P2 stories are labeled as deferred. The team form supports optional season date edits and named custom sports; the calendar respects the configured season month boundaries.

## Follow-up

Increment 5 publishes the prioritized feature list, consolidates the academic MVP scope, and records product work required before commercialization. Priorities remain product hypotheses pending validation with representative amateur coaches.

