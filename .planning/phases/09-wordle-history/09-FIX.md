---
phase: 09-wordle-history
plan: 09-FIX
type: fix
wave: 1
depends_on: []
files_modified: [src/data/history.ts, src/data/wordleAnswers.ts]
autonomous: true
---

<objective>
Fix 1 UAT issue from phase 9 (Wordle History).

Source: 09-UAT.md
Diagnosed: yes
Priority: 0 blocker, 1 major, 0 minor, 0 cosmetic

The core issue is that external APIs (NYT, WordleHints) block CORS requests from browser clients. The fix embeds historical Wordle answers directly in the bundle, eliminating external API dependency.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md

**Issues being fixed:**
@.planning/phases/09-wordle-history/09-UAT.md

**Original implementation:**
@src/data/history.ts
</context>

<tasks>
<task type="auto">
  <name>Task 1: Create embedded Wordle answers data file</name>
  <files>src/data/wordleAnswers.ts</files>
  <action>
**Root Cause:** CORS blocks browser requests to NYT API and WordleHints API. Both APIs reject cross-origin requests.

**Fix:** Create a static data file with historical Wordle answers embedded in the bundle.

Create `src/data/wordleAnswers.ts` with:
1. Export a `WORDLE_ANSWERS` array of objects: `{ game: number, date: string, answer: string }`
2. Include all Wordle answers from game #1 (2021-06-19) through a recent date
3. The data is publicly available - Wordle answers are published daily and archived

Data source: The official Wordle answers are well-documented. Include at minimum games 1-1000+ covering 2021-06-19 through late 2024.

Format:
```typescript
export const WORDLE_ANSWERS: Array<{ game: number; date: string; answer: string }> = [
  { game: 1, date: '2021-06-19', answer: 'cigar' },
  { game: 2, date: '2021-06-20', answer: 'rebut' },
  // ... continue for all historical answers
];
```
  </action>
  <verify>
- File exists at src/data/wordleAnswers.ts
- Contains WORDLE_ANSWERS array export
- Has entries for dates from 2021-06-19 onwards
- TypeScript compiles without errors
  </verify>
  <done>Static Wordle answers data file created with historical answers embedded</done>
</task>

<task type="auto">
  <name>Task 2: Update history module to use embedded data</name>
  <files>src/data/history.ts</files>
  <action>
**Issue:** `getPuzzleByDate` returns null because API calls fail due to CORS.

**Fix:** Modify `src/data/history.ts` to:
1. Import `WORDLE_ANSWERS` from `./wordleAnswers`
2. Replace API-based fetching with local lookup
3. Keep the same public API: `getPuzzleByDate(date: string): Promise<HistoricalPuzzle | null>`
4. Look up the date in `WORDLE_ANSWERS` array
5. Return matching puzzle or null if date not found

Remove or comment out:
- `fetchFromNYT` function
- `fetchFromWordleHints` function
- Cache-related code (no longer needed - data is local)

Keep:
- `getMinDate()` - return first date in WORDLE_ANSWERS
- `getMaxDate()` - return last date in WORDLE_ANSWERS (or yesterday, whichever is earlier)
- `HistoricalPuzzle` type import

The function signature stays the same (returns Promise for backward compatibility), but implementation becomes a simple array lookup.
  </action>
  <verify>
- `npm run build` succeeds
- `getPuzzleByDate('2021-06-19')` returns puzzle with answer 'cigar'
- `getPuzzleByDate('2099-01-01')` returns null (date not in data)
- No CORS-related code remains
  </verify>
  <done>History module updated to use embedded data - no external API calls</done>
</task>

<task type="auto">
  <name>Task 3: Verify fix resolves UAT-001</name>
  <files></files>
  <action>
**Verification task** - no code changes, just confirm the fix works.

1. Start dev server: `npm run dev`
2. Open browser to localhost
3. Click "Practice" button
4. Select any historical date (e.g., 2021-06-19)
5. Click "Load Puzzle"
6. Confirm: Modal closes, practice mode starts with the historical word

This verifies UAT-001 is resolved - the "Puzzle not found" error should no longer appear.
  </action>
  <verify>
- Dev server starts without errors
- Practice mode loads historical puzzles successfully
- No "Puzzle not found" errors
  </verify>
  <done>UAT-001 verified fixed - historical puzzle loading works</done>
</task>
</tasks>

<verification>
Before declaring plan complete:
- [ ] Embedded answers file exists with historical data
- [ ] History module uses local lookup instead of API calls
- [ ] `npm run build` succeeds
- [ ] Practice mode loads historical puzzles without error
</verification>

<success_criteria>
- UAT-001 (Puzzle not found error) resolved
- No external API dependencies for historical data
- All existing functionality preserved
- Ready for re-verification with /gsd:verify-work 9
</success_criteria>

<output>
After completion, create `.planning/phases/09-wordle-history/09-FIX-SUMMARY.md`
</output>
