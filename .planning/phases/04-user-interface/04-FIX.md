---
phase: 04-user-interface
plan: FIX
type: fix
---

<objective>
Fix 5 UAT issues from Phase 4 User Interface testing.

Source: 04-ISSUES.md
Priority: 0 critical, 3 major, 1 minor, 1 cosmetic

The major issues (003-005) together represent a UX model change: from "batch submission" (Enter to submit) to "real-time dynamic filtering" (suggestions update as you type and change colors).
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md

**Issues being fixed:**
@.planning/phases/04-user-interface/04-ISSUES.md

**Current implementation:**
@src/ui/GuessGrid.ts
@src/main.ts
@src/style.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix focus issues (UAT-001, UAT-002)</name>
  <files>src/ui/GuessGrid.ts, src/style.css</files>
  <action>
    **UAT-001: Auto-focus not working**
    - The focusGrid() call in constructor may fire before DOM is fully ready
    - Wrap focus call in requestAnimationFrame or setTimeout(0) to ensure DOM is ready
    - Alternative: call focus() in main.ts after GuessGrid construction

    **UAT-002: White focus border**
    - Add CSS rule to remove browser default focus outline on .guess-grid
    - Use `outline: none` on `.guess-grid:focus`
    - Optionally add a subtle visual indicator that grid has focus (e.g., slightly different background)
  </action>
  <verify>
    - Page loads and cursor is in grid immediately (can type without clicking)
    - No white border visible around grid when focused
  </verify>
  <done>Grid auto-focuses on page load, no visible focus outline</done>
</task>

<task type="auto">
  <name>Task 2: Implement real-time filtering model (UAT-003, UAT-005)</name>
  <files>src/ui/GuessGrid.ts, src/main.ts</files>
  <action>
    **Change event model from "submit on Enter" to "update on change":**

    1. Add an `onChange` callback to GuessGrid that fires whenever:
       - A letter is typed (inputLetter)
       - A letter is deleted (deleteLetter)
       - A color is changed (cycleColor)

    2. In main.ts, wire up onChange instead of (or in addition to) onSubmit:
       - On each change, rebuild constraints from ALL complete rows (rows with 5 letters)
       - Filter and rank words based on current state
       - Update suggestions immediately

    3. Create helper method `getAllFeedback(): GuessFeedback[]` that returns feedback for all complete rows (0 through currentRow, where row has 5 letters).

    4. In main.ts onChange handler:
       ```
       const allFeedback = guessGrid.getAllFeedback();
       let constraints = createEmptyConstraints();
       for (const feedback of allFeedback) {
         constraints = addGuessToConstraints(constraints, feedback);
       }
       filteredWords = filterWords(WORD_LIST, constraints);
       const rankedWords = rankWords(filteredWords, filteredWords);
       suggestions.update(rankedWords, filteredWords.length);
       ```

    5. Keep Enter key behavior but make it just advance to next row (if current row is complete) without triggering constraint update (that happens via onChange).

    **Note:** This means suggestions update in real-time as user types letters AND changes colors.
  </action>
  <verify>
    - Type "CRA" and see suggestions filter to words starting with CRA
    - Complete "CRANE" and see filter narrow further
    - Click a letter to change color, see suggestions immediately update
    - No Enter key required for filtering to happen
  </verify>
  <done>Word list updates dynamically as letters are typed and colors changed</done>
</task>

<task type="auto">
  <name>Task 3: Allow editing of any row (UAT-004)</name>
  <files>src/ui/GuessGrid.ts</files>
  <action>
    **Remove row locking - allow editing any row:**

    1. Change `deleteLetter()` to work on any row, not just current:
       - If currentCol > 0: delete in current row (existing behavior)
       - If currentCol === 0 AND currentRow > 0: move back to previous row, position at col 4, delete that letter
       - This allows backspacing through all entered letters

    2. Ensure inputLetter() allows typing in any row when there's space:
       - Current behavior is fine, but may need adjustment if row advancement changes

    3. Consider simplifying: remove the concept of "currentRow" as a hard boundary
       - Just track cursor position (row, col)
       - Allow cursor to move freely with backspace across rows
       - Typing advances cursor forward

    4. The "row advancement" on Enter can optionally:
       - Do nothing (user just uses keyboard naturally)
       - OR move cursor to next row's first position if current row is complete

    **Key insight:** Since filtering now happens via onChange (Task 2), there's no need to "submit" rows. The grid is just an input device where user can freely edit.
  </action>
  <verify>
    - Fill row 1 with "CRANE", press Enter to go to row 2
    - Type "S" in row 2, then press Backspace 6 times
    - Should delete S, then E, N, A, R, C (moving back through row 1)
    - Suggestions should update with each deletion
  </verify>
  <done>Backspace works across rows, can edit any previously entered letters</done>
</task>

<task type="auto">
  <name>Task 4: Verify full integration and edge cases</name>
  <files>src/main.ts</files>
  <action>
    Test and fix any integration issues:

    1. Verify New Game reset still works correctly with new model
    2. Verify that deleting all letters resets suggestions to full list
    3. Verify that entering a word with all gray colors shows appropriate filtering
    4. Verify that changing colors on a partially filled row doesn't break anything
    5. Handle edge case: changing color on empty cell should do nothing (already handled)
    6. Handle edge case: row with some letters but not 5 should not contribute to constraints

    If any edge cases cause issues, add appropriate guards.
  </action>
  <verify>
    - New Game clears everything and shows full word list
    - Delete all letters → suggestions show full list
    - Edge cases don't cause errors
    - Build passes: npm run build
  </verify>
  <done>All edge cases handled, build succeeds, no console errors</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] `npm run build` succeeds without errors
- [ ] Grid auto-focuses on page load (can type immediately)
- [ ] No white focus border visible
- [ ] Suggestions update as letters are typed (real-time)
- [ ] Suggestions update when colors are clicked (real-time)
- [ ] Can backspace through all entered letters across rows
- [ ] New Game reset works correctly
- [ ] No TypeScript errors
</verification>

<success_criteria>
- All 5 UAT issues from 04-ISSUES.md addressed
- Real-time filtering model implemented
- Tests pass, build succeeds
- Ready for re-verification
</success_criteria>

<output>
After completion, create `.planning/phases/04-user-interface/04-FIX-SUMMARY.md`
</output>
