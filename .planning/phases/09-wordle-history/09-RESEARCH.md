# Phase 9: Wordle History - Research

**Researched:** 2026-01-15
**Domain:** Historical Wordle puzzle data integration
**Confidence:** HIGH

<research_summary>
## Summary

Researched data sources and integration patterns for historical Wordle puzzle answers. Two reliable APIs exist: the NYT official API (still working as of today) and the WordleHints third-party API. Both provide JSON responses with puzzle solutions, dates, and metadata.

Key finding: The NYT API at `https://www.nytimes.com/svc/wordle/v2/{YYYY}-{MM}-{DD}.json` is functional and returns solution, puzzle ID, date, and editor. The WordleHints API provides additional metadata like difficulty ratings and offers bulk pagination.

**Primary recommendation:** Use NYT API as primary source (authoritative), with WordleHints as fallback. Fetch historical data once at build time or on first load, then cache in LocalStorage. Do not hand-roll date picker UI - use native HTML date input with min/max constraints.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Native fetch API | Built-in | HTTP requests to Wordle APIs | No external dependency needed |
| LocalStorage | Built-in | Cache historical word data | Already used for stats persistence |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 3.x | Date formatting/parsing | If complex date math needed (likely overkill) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fetch at runtime | Embedded JSON | Offline-first but needs manual updates |
| NYT API | WordleHints API | WordleHints has difficulty ratings, but NYT is authoritative |
| Per-day fetch | Batch fetch all | Batch better for practice mode, per-day for "today's hint" |

**Installation:**
```bash
# No additional dependencies needed - use native fetch and LocalStorage
# Optionally for date utilities:
npm install date-fns
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── data/
│   ├── words.ts           # Existing word list
│   └── history.ts         # NEW: Historical puzzle data handling
├── logic/
│   └── ...existing...
├── types/
│   └── index.ts           # Add HistoricalPuzzle type
└── ui/
    └── HistoryPicker.ts   # NEW: Date picker and practice mode UI
```

### Pattern 1: Lazy-Load with Cache
**What:** Fetch historical data on first access, cache in LocalStorage with TTL
**When to use:** When user wants to practice with past puzzles
**Example:**
```typescript
// src/data/history.ts
interface CachedHistory {
  data: HistoricalPuzzle[];
  fetchedAt: number;
  lastGame: number;
}

const CACHE_KEY = 'wordle-history';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getHistoricalPuzzles(): Promise<HistoricalPuzzle[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, fetchedAt } = JSON.parse(cached) as CachedHistory;
    if (Date.now() - fetchedAt < CACHE_TTL) {
      return data;
    }
  }

  // Fetch from API and cache
  const data = await fetchAllPuzzles();
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    fetchedAt: Date.now(),
    lastGame: data[0]?.game ?? 0
  }));
  return data;
}
```

### Pattern 2: API Response Types
**What:** Type-safe API response handling
**When to use:** Fetching from NYT or WordleHints
**Example:**
```typescript
// NYT API response
interface NYTWordleResponse {
  id: number;
  solution: string;
  print_date: string;  // "YYYY-MM-DD"
  days_since_launch: number;
  editor: string;
}

// WordleHints API response
interface WordleHintsResponse {
  source: string;
  version: string;
  count: number;
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
  results: WordleHintsEntry[];
}

interface WordleHintsEntry {
  game: number;
  date: string;  // "YYYY-MM-DD"
  day_name: string;
  answer: string;  // UPPERCASE
  difficulty: number | null;
}
```

### Pattern 3: Date-Based Lookup
**What:** Allow user to select a date and get that day's puzzle
**When to use:** Practice mode where user picks a historical date
**Example:**
```typescript
async function getPuzzleByDate(date: Date): Promise<HistoricalPuzzle | null> {
  const dateStr = date.toISOString().split('T')[0];
  const url = `https://www.nytimes.com/svc/wordle/v2/${dateStr}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data: NYTWordleResponse = await response.json();
    return {
      game: data.id,
      date: data.print_date,
      answer: data.solution.toUpperCase(),
    };
  } catch {
    return null;
  }
}
```

### Anti-Patterns to Avoid
- **Fetching all ~1700 puzzles on app load:** Use pagination or date-range queries
- **Storing entire history in component state:** Use LocalStorage cache, not React/component state
- **Calling API on every date change:** Cache results, check cache first
- **Building custom date picker:** Use native `<input type="date">` with min/max
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date picker UI | Custom calendar component | `<input type="date" min="2021-06-19" max="today">` | Native handles accessibility, mobile, validation |
| Date formatting | Manual string manipulation | `date.toISOString().split('T')[0]` or date-fns | Edge cases with timezones, locale |
| HTTP caching | Manual cache headers | LocalStorage with TTL | Simple, works offline, already used in app |
| API retry logic | Custom retry with exponential backoff | Simple try/catch with fallback to cache | Overkill for this use case |

**Key insight:** The NYT API is simple and reliable. Don't over-engineer the data fetching. A single fetch with LocalStorage caching is sufficient for a practice mode feature.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: CORS Issues
**What goes wrong:** Browser blocks cross-origin requests to NYT API
**Why it happens:** NYT API may not have CORS headers for browser requests
**How to avoid:** Test fetch from browser early; if blocked, use WordleHints API instead (has CORS enabled)
**Warning signs:** Network errors in console, "blocked by CORS policy"

### Pitfall 2: Timezone Date Mismatch
**What goes wrong:** User in different timezone gets wrong day's puzzle
**Why it happens:** Date calculations based on local time vs UTC
**How to avoid:** Always use the date string from API response, not calculated dates
**Warning signs:** "Off by one day" bugs, especially around midnight

### Pitfall 3: Case Sensitivity
**What goes wrong:** Word comparisons fail because of case mismatch
**Why it happens:** NYT returns lowercase "solution", WordleHints returns UPPERCASE "answer"
**How to avoid:** Normalize to lowercase immediately after fetch: `answer.toLowerCase()`
**Warning signs:** Word not found in word list despite being valid

### Pitfall 4: Stale Cache with New Puzzles
**What goes wrong:** Today's puzzle not showing because cache hasn't updated
**Why it happens:** TTL-based cache doesn't know when new puzzle is available
**How to avoid:** Cache TTL of 24h is fine; for "today" always fetch fresh or check game number
**Warning signs:** Yesterday's puzzle shows as "today" after midnight

### Pitfall 5: Memory from Fetching All History
**What goes wrong:** App slow or crashes when loading 1700+ puzzles at once
**Why it happens:** Fetching all history in one request and holding in memory
**How to avoid:** Paginate (WordleHints supports per_page), or fetch single date on demand
**Warning signs:** Long initial load time, high memory usage
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from API testing:

### Fetch Today's Puzzle from NYT
```typescript
// Source: NYT API (tested 2026-01-15)
async function fetchTodaysPuzzle(): Promise<string | null> {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://www.nytimes.com/svc/wordle/v2/${today}.json`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  // Response: { id, solution, print_date, days_since_launch, editor }
  return data.solution;  // lowercase, e.g., "chasm"
}
```

### Fetch Paginated History from WordleHints
```typescript
// Source: WordleHints API (tested 2026-01-15)
async function fetchHistoryPage(page: number = 1, perPage: number = 100): Promise<HistoricalPuzzle[]> {
  const url = `https://wordlehints.co.uk/wp-json/wordlehint/v1/answers?page=${page}&per_page=${perPage}&order=desc`;

  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  // Response: { source, version, count, total, page, per_page, has_more, results: [...] }

  return data.results.map((entry: any) => ({
    game: entry.game,
    date: entry.date,
    answer: entry.answer.toLowerCase(),  // Normalize case
    difficulty: entry.difficulty
  }));
}
```

### Date Input with Constraints
```html
<!-- Wordle started 2021-06-19, constrain picker to valid range -->
<input
  type="date"
  id="history-date"
  min="2021-06-19"
  max="2026-01-15"
/>
```

```typescript
// Update max date to "yesterday" to avoid spoilers for today
const dateInput = document.getElementById('history-date') as HTMLInputElement;
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
dateInput.max = yesterday.toISOString().split('T')[0];
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NYT client-side solution in JS | NYT server-side API | 2023 | Can still fetch via API endpoint |
| Playable Wordle archive sites | Shut down by NYT | 2023 | Answer-only archives remain |
| Static embedded word lists | Live API fetch | Ongoing | API provides authoritative, up-to-date data |

**New tools/patterns to consider:**
- **WordleHints API difficulty ratings:** Could show "this was a hard one" in UI
- **Service Worker caching:** Could cache API responses for true offline practice

**Deprecated/outdated:**
- **Wordle Archive (playable):** NYT shut it down; use answer-list APIs instead
- **Client-side solution extraction:** NYT moved to server-side rendering
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **CORS on NYT API from browser**
   - What we know: curl works, browser behavior untested
   - What's unclear: Whether NYT sets Access-Control-Allow-Origin
   - Recommendation: Test early in implementation; use WordleHints as fallback

2. **Rate limiting on APIs**
   - What we know: Neither API documents rate limits explicitly
   - What's unclear: Exact thresholds before blocking
   - Recommendation: Cache aggressively, fetch once per day max

3. **Historical puzzle #0 (CIGAR)**
   - What we know: WordleHints has it, NYT API starts at #1 (REBUT)
   - What's unclear: Whether puzzle #0 was ever "official"
   - Recommendation: Include it in history for completeness (it was the first puzzle played by the public)
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- NYT Wordle API tested directly: `https://www.nytimes.com/svc/wordle/v2/2026-01-15.json` - working, returns JSON with solution
- WordleHints API tested directly: `https://wordlehints.co.uk/wp-json/wordlehint/v1/answers` - working, returns paginated JSON

### Secondary (MEDIUM confidence)
- [WordleHints API documentation](https://wordlehints.co.uk/wordle-past-answers/api/) - endpoint details, pagination
- [GitHub sbplat/wordle](https://github.com/sbplat/wordle) - NYT API usage example (archived but pattern valid)

### Tertiary (LOW confidence - needs validation)
- [FiveForks.com](https://www.fiveforks.com/wordle/) - archive completeness claim (~1669 puzzles), not machine-readable
- [TechRadar past answers](https://www.techradar.com/news/past-wordle-answers) - archive coverage claims
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Fetch API, LocalStorage
- Ecosystem: NYT API, WordleHints API
- Patterns: Lazy-load with cache, date-based lookup
- Pitfalls: CORS, timezone, case sensitivity, cache staleness

**Confidence breakdown:**
- Data sources: HIGH - tested both APIs directly, confirmed working
- Architecture: HIGH - simple fetch + cache pattern, already used in app
- Pitfalls: MEDIUM - CORS untested in browser, timezone edge cases theoretical
- Code examples: HIGH - tested API responses match documented format

**Research date:** 2026-01-15
**Valid until:** 2026-02-15 (30 days - APIs stable, NYT may change without notice)
</metadata>

---

*Phase: 09-wordle-history*
*Research completed: 2026-01-15*
*Ready for planning: yes*
