---
phase: 24-input-validation-fixes
plan: FIX
type: fix
wave: 1
depends_on: []
files_modified: [src/main.ts]
autonomous: true
---

<objective>
Fix 1 UAT issue from phase 24.

Source: 24-UAT.md
Diagnosed: yes - root cause identified
Priority: 1 blocker, 0 major, 0 minor, 0 cosmetic
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md

**Issues being fixed:**
@.planning/phases/24-input-validation-fixes/24-UAT.md

**Original plan for reference:**
@.planning/phases/24-input-validation-fixes/24-01-PLAN.md

**Source files:**
@src/main.ts
@src/logic/constraints.ts
@src/ui/GuessGrid.ts
</context>

<tasks>

<task type="auto">
  <name>Fix UAT-001: Hard mode blocks first guess when no hints exist yet</name>
  <files>src/main.ts</files>
  <action>
**Root Cause:** getAllFeedback() includes current row (which has letters but default gray colors). On submit, the current row is complete but colors haven't been set yet via setRowColors(). All letters get treated as "excluded" (gray), causing satisfiesConstraints() to fail.

**Issue:** "With hard mode enabled, I can't even provide one guess. I get the error saying 'Hard mode: must use revealed hints'"

**Expected:** When hard mode is on and you try to submit a word that doesn't use revealed hints, an error message appears and the guess is rejected - BUT this should only apply when there ARE revealed hints (i.e., after at least one guess has been submitted and colored).

**Fix:** In the hard mode validation block in the onSubmit callback, only build constraints from rows BEFORE the current row being submitted (row < currentRow). The constraint check should NOT include the current row because:
1. The current row hasn't been colored yet (setRowColors happens after validation)
2. On the first guess (row 0), there are no previous rows, so constraints should be empty

Specifically:
1. Find the hard mode validation code that was added in Task 2 of 24-01
2. Change the loop/logic that builds constraints from getAllFeedback() to only include rows where row < currentRow (the row being submitted)
3. Alternatively, if getAllFeedback() is being used, filter its results to only include indices less than the current row parameter passed to onSubmit

The key insight is that feedback from row N should only be used to constrain guesses for rows > N.
  </action>
  <verify>
Manual test:
1. Enable hard mode in settings
2. Type a valid 5-letter word (first guess) and submit
3. Should accept the guess without error (no previous hints to satisfy)
4. After first guess shows colors, submit a second word that ignores revealed hints
5. Should now show "Hard mode: must use revealed hints" error
  </verify>
  <done>UAT-001 resolved - hard mode only validates against constraints from PREVIOUS rows, not the current row being submitted</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] First guess in hard mode accepted without error
- [ ] Second guess in hard mode validated against first guess feedback
- [ ] Invalid second guess (ignoring hints) shows error message
- [ ] Valid second guess (using hints) accepted
- [ ] `npm run build` succeeds
</verification>

<success_criteria>
- UAT-001 blocker issue resolved
- Hard mode works correctly on first guess
- Hard mode properly enforces constraints on subsequent guesses
- Ready for re-verification with /gsd:verify-work 24
</success_criteria>

<output>
After completion, create `.planning/phases/24-input-validation-fixes/24-FIX-SUMMARY.md`
</output>
