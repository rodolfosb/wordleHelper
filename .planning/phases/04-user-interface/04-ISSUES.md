# UAT Issues: Phase 4 User Interface

**Tested:** 2026-01-13
**Source:** .planning/phases/04-user-interface/04-01-SUMMARY.md, 04-02-SUMMARY.md
**Tester:** User via /gsd:verify-work

## Open Issues

[None - all issues resolved in 04-FIX]

## Resolved Issues

### UAT-001: Grid requires manual click before keyboard input works

**Discovered:** 2026-01-13
**Phase/Plan:** 04-01
**Severity:** Minor
**Feature:** Letter input with keyboard navigation
**Description:** The grid needs to be clicked/selected with the mouse before keyboard input is accepted. Auto-focus on page load is not working.
**Expected:** Grid should auto-focus on page load so user can immediately start typing
**Actual:** Must click grid first before letters can be typed
**Resolved:** 2026-01-13 via 04-FIX Task 1 - Auto-focus with requestAnimationFrame

### UAT-002: White focus border visible around entire grid

**Discovered:** 2026-01-13
**Phase/Plan:** 04-01
**Severity:** Cosmetic
**Feature:** Guess grid UI
**Description:** When the grid is focused (either manually or after clicking), a white border/outline appears around the entire grid element.
**Expected:** No visible focus outline, or a more subtle/styled focus indicator
**Actual:** Browser default white focus outline is visible
**Resolved:** 2026-01-13 via 04-FIX Task 1 - CSS outline: none on .guess-grid:focus

### UAT-003: Word list should update dynamically (not just on Enter)

**Discovered:** 2026-01-13
**Phase/Plan:** 04-02
**Severity:** Major
**Feature:** Suggestions filtering
**Description:** Currently the word list only updates after pressing Enter to submit a guess. User expects real-time filtering as letters are typed and colors are changed.
**Expected:** Word list filters dynamically as user types letters and clicks to change colors
**Actual:** Word list only updates after pressing Enter; typing and color changes have no immediate effect on suggestions
**Resolved:** 2026-01-13 via 04-FIX Task 2 - Real-time filtering via onChange callback

### UAT-004: Cannot modify letters in submitted row

**Discovered:** 2026-01-13
**Phase/Plan:** 04-02
**Severity:** Major
**Feature:** Guess editing
**Description:** After pressing Enter to submit a row, the letters become locked and cannot be deleted or changed with Backspace. User wants ability to edit the last submitted word.
**Expected:** Should be able to use Backspace to delete letters in the current/last row and modify the guess
**Actual:** Letters are locked after submission; only color changes are possible
**Resolved:** 2026-01-13 via 04-FIX Task 3 - Cross-row backspace in deleteLetter()

### UAT-005: Color changes after submission don't update word list

**Discovered:** 2026-01-13
**Phase/Plan:** 04-02
**Severity:** Major
**Feature:** Color feedback integration
**Description:** After submitting a row, clicking letters still cycles colors visually, but the word list doesn't re-filter based on the new colors. The filtering is "frozen" at submission time.
**Expected:** Changing letter colors should immediately re-filter the word list
**Actual:** Color changes after Enter have no effect on suggestions
**Resolved:** 2026-01-13 via 04-FIX Task 2 - Color changes fire onChange for immediate filtering

---

*Phase: 04-user-interface*
*Tested: 2026-01-13*
