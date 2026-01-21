---
status: diagnosed
phase: 24-input-validation-fixes
source: 24-01-SUMMARY.md, 24-FIX-SUMMARY.md
started: 2026-01-21T18:00:00Z
updated: 2026-01-21T18:06:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Hard Mode First Guess (Re-test UAT-001 Fix)
expected: With hard mode enabled, type a valid 5-letter word as your first guess. The guess should be ACCEPTED without any error message.
result: pass

### 2. Hard Mode Validates Second Guess
expected: After first guess is accepted and colored, try a second guess that ignores revealed hints. Should show "Hard mode: must use revealed hints" error.
result: pass

### 3. Hard Mode Allows Valid Second Guess
expected: After first guess, submit a word that correctly uses all revealed hints (green letters in position, yellow letters included). Should be accepted.
result: pass

### 4. Submitted Rows Locked from Backspace
expected: After submitting a valid guess, pressing backspace does NOT delete letters from that row - you cannot edit previously submitted rows.
result: pass

### 5. Input Works After Backspace on Locked Row
expected: After pressing backspace on a submitted row (which correctly does nothing), typing new letters should still work on the current row
result: issue
reported: "When I submit a guess and then try to press backspace to delete, it does not allow me to delete (which is the correct behavior). However, when I try typing again I am not able to even if using the on-screen keyboard"
severity: blocker
root_cause: deleteLetter() at line 264 only returns early for row 0, col 0. When at col 0 of row N>0 with submitted previous row, it still decrements currentCol to -1, corrupting state.
debug_session: inline diagnosis

## Summary

total: 5
passed: 4
issues: 1
pending: 0
skipped: 0

## Issues for /gsd:plan-fix

- UAT-002: Input blocked after backspace on locked row (blocker) - Test 5
  root_cause: deleteLetter() line 264 only checks for row 0. Fix: return early if at col 0 after the row-jump check fails.
