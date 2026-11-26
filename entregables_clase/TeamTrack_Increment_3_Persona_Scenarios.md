# TeamTrack Persona Scenarios

**Increment:** 3 — Persona scenarios  
**Status:** Defined and implemented in the local prototype  
**Basis:** TeamTrack Product Definition, Increment 2 requirements, Increment 3 design, and the persona profiles

## Purpose

This increment turns the personas into concrete situations that can guide a demonstration and the next development work. The scenarios focus on Alex Rivera, the amateur coach and primary MVP user. They describe the trigger, the steps Alex takes, and the result TeamTrack should provide. The coordinator, player, and parent or guardian remain future profiles; this increment does not add accounts or access for them.

## Scope and assumptions

- The first demonstrated workflow uses one coach and one selected team.
- The coach enters and confirms records. TeamTrack does not infer attendance or results.
- A scenario can be completed with the existing browser prototype and its local sample data.
- Profile details are working assumptions from the persona definition, not findings from interviews.
- Scenarios explain user journeys. User stories and a prioritized feature list are follow-up deliverables.

## Primary persona

**Alex Rivera — amateur basketball coach.** Alex coordinates one team's season, uses everyday digital tools, and has limited time for administration. Alex needs a reliable place to maintain the roster and schedule, record what happened, and see which information is still pending. The scenarios below use basketball as the example while keeping team and result concepts usable by other sports.

## Scenarios

### PS-01 — Prepare a team for a season

**Goal:** Start the season with the correct team, sport, and season information.  
**Trigger:** Alex is setting up a new season or a new team.

1. Alex opens the team workspace and chooses to create a team.
2. Alex enters the team name and sport, then creates or selects the season.
3. TeamTrack saves the team and makes it the active workspace.
4. Alex checks the dashboard to confirm the team and season.

**Expected outcome:** The dashboard shows the selected team, sport, and season. An existing season can be reused rather than duplicated.

### PS-02 — Update the roster

**Goal:** Keep the active roster current while preserving prior records.  
**Trigger:** Alex reviews membership before a training session or after a roster change.

1. Alex opens the roster and reviews active members.
2. Alex adds a member or edits an existing member's name and optional sport details.
3. If a member leaves, Alex marks that person inactive instead of deleting the record.
4. Alex confirms the active count and the member status.

**Expected outcome:** Active members are easy to find. Inactive members remain available in the history. Position and jersey number stay optional.

### PS-03 — Schedule the next activity

**Goal:** Make the next training session or match visible to the team manager.  
**Trigger:** Alex receives a confirmed date and time for an upcoming activity.

1. Alex chooses whether to schedule a training session or a match.
2. Alex enters the date and time and adds the venue, opponent, or notes when known.
3. TeamTrack saves the event to the selected team.
4. Alex checks the calendar and dashboard to confirm the event details.

**Expected outcome:** The event appears in the team's calendar and upcoming activity list. Unknown optional details remain blank rather than being guessed.

### PS-04 — Record a completed training session

**Goal:** Capture attendance and a short session note after training.  
**Trigger:** The session has ended and Alex is ready to close the record.

1. Alex opens the completed training event from the calendar or history.
2. Alex records each active member as present, absent, late, or excused where known.
3. Alex adds an optional note in their own words.
4. Alex saves and reopens the event to confirm the record.

**Expected outcome:** The event shows saved attendance and notes. A member without a saved status remains unregistered; the system does not treat missing data as absence.

### PS-05 — Save a match result and review activity

**Goal:** Keep a match result with its event and find it later.  
**Trigger:** Alex has a confirmed result after a match.

1. Alex opens the relevant match event.
2. Alex enters a labeled result component, such as points, and the values for the team and opponent.
3. Alex saves the result and any optional match note.
4. Alex checks the history or dashboard to confirm the result is associated with that match.

**Expected outcome:** The result remains linked to the match and appears in the history. Missing results remain pending; the prototype does not calculate an outcome from incomplete data.

## Future persona scenarios

| Persona | Situation to explore later | Scope decision |
|---|---|---|
| Jordan Lee, sports coordinator | Review activity across several authorized teams and seasons. | Future extension; multi-team coordinator permissions are not implemented. |
| Sam Patel, player | Check the schedule and review information the team chooses to share. | Future extension; players do not sign in to this prototype. |
| Taylor Morgan, parent or guardian | Check youth-team schedules and receive authorized updates. | Future extension; no family portal or notifications are implemented. |

These profiles inform future product decisions, but the prototype must not imply that they can log in or access team data.

## Increment 3 implementation plan

| Work item | Implementation | Completion evidence |
|---|---|---|
| Document the journeys | Define the five coach scenarios, expected outcomes, assumptions, and future-profile boundaries. | This scenario document is available in Markdown and Word. |
| Make scenarios discoverable | Add an Escenarios view to the prototype with a situation, goal, steps, and expected result for each coach scenario. | The navigation opens five scenario cards. |
| Connect guidance to actions | Link each card to the relevant team, roster, or calendar workflow. For record scenarios, open an available matching event or explain what must be scheduled first. | The scenario action opens the related form or event detail. |
| Keep future roles explicit | Present coordinator, player, and guardian as future scope, without adding access controls or accounts. | The scenario view and document state the MVP boundary clearly. |

## Acceptance criteria

1. The five primary-user scenarios name a goal, trigger, steps, and expected outcome.
2. The prototype exposes the scenarios from its main navigation and provides a direct starting action for each.
3. Scenario actions use existing team, roster, calendar, attendance, and result flows.
4. Missing attendance, results, and optional event details remain visibly unknown until the coach records them.
5. Future personas are documented without implying that their access is implemented.
6. User stories and a prioritized feature list remain separate follow-up work.

## Follow-up

Use these scenarios to write persona-linked user stories and acceptance criteria, then prioritize a feature list for the next increment. Validate the working assumptions with representative users before treating them as research findings.

