---
status: diagnosed
phase: 24-input-validation-fixes
source: 24-01-SUMMARY.md
started: 2026-01-21T16:00:00Z
updated: 2026-01-21T16:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Hard Mode Validation Error
expected: When hard mode is on and you try to submit a word that doesn't use revealed hints, an error message "Hard mode: must use revealed hints" appears and the guess is rejected
result: issue
reported: "With hard mode enabled, I can't even provide one guess. I get the error saying 'Hard mode: must use revealed hints'"
severity: blocker
root_cause: getAllFeedback() includes current row with default gray colors before setRowColors() is called
debug_session: inline diagnosis

### 2. Hard Mode Allows Valid Guesses
expected: When hard mode is on and you submit a word that uses all revealed hints correctly, the guess is accepted without error
result: skipped
reason: Blocked by UAT-001

### 3. Submitted Rows Locked from Backspace
expected: After submitting a valid guess, pressing backspace does NOT delete letters from that row - you cannot edit previously submitted rows
result: pass

### 4. Current Row Still Editable
expected: While typing a new guess (before submission), backspace works normally to delete letters
result: pass

## Summary

total: 4
passed: 2
issues: 1
pending: 0
skipped: 1

## Issues for /gsd:plan-fix

- UAT-001: Hard mode blocks first guess when no hints exist yet (blocker) - Test 1
  root_cause: getAllFeedback() includes current row (which has letters but default gray colors). On submit, the current row is complete but colors haven't been set yet via setRowColors(). All letters get treated as "excluded" (gray), causing satisfiesConstraints() to fail. Fix: only build constraints from rows BEFORE the current row being submitted (row < currentRow).
