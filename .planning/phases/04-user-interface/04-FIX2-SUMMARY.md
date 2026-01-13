# FIX2 Summary: UAT Issues UAT-006 and UAT-007

**Phase:** 04-user-interface
**Plan:** FIX2
**Completed:** 2026-01-13

## Issues Fixed

### UAT-006: Filter on every keystroke (Major)
**Problem:** Word list only updated when a row had 5 letters. Users expected filtering to happen on every keystroke.

**Solution:** Added prefix filtering for partial words during typing:
- Added `filterByPrefix(words, prefix)` function to `src/logic/filter.ts`
- Added `getCurrentPartialWord()` method to `GuessGrid` class
- Modified `updateSuggestions()` in main.ts to apply prefix filter when current row has partial input (1-4 letters)

**Commit:** `9731c30`

### UAT-007: Auto-recover focus (Minor)
**Problem:** After clicking elsewhere on the page, user had to manually click the grid to restore keyboard input.

**Solution:** Added document-level click handler in main.ts that automatically refocuses the grid after any click:
```typescript
document.addEventListener('click', () => {
  requestAnimationFrame(() => {
    guessGrid.focusGrid();
  });
});
```

**Commit:** `7994b21`

## Task Completion

| Task | Description | Status | Commit |
|------|-------------|--------|--------|
| Task 1 | Filter on every keystroke (UAT-006) | Completed | `9731c30` |
| Task 2 | Auto-recover focus (UAT-007) | Completed | `7994b21` |
| Task 3 | Verify integration | Completed | (verification only) |

## Files Modified

- `src/logic/filter.ts` - Added `filterByPrefix()` function
- `src/ui/GuessGrid.ts` - Added `getCurrentPartialWord()` method
- `src/main.ts` - Applied prefix filtering and added auto-focus recovery

## Verification

- [x] `npm run build` succeeds without errors
- [x] Typing partial words filters suggestions immediately
- [x] Grid auto-recovers focus after clicking anywhere
- [x] Constraint filtering still works for complete rows
- [x] Combined filtering (constraints + prefix) works
- [x] No TypeScript errors

## Ready for Re-verification

Both UAT issues have been addressed. The implementation:
1. Filters word suggestions on every keystroke (prefix matching for partial words)
2. Automatically recovers grid focus after any click on the page
