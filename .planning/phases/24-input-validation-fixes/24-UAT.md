---
status: complete
phase: 24-input-validation-fixes
source: 24-01-SUMMARY.md, 24-FIX-SUMMARY.md
started: 2026-01-21T18:00:00Z
updated: 2026-01-21T18:04:00Z
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

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Issues for /gsd:plan-fix

[none yet]
