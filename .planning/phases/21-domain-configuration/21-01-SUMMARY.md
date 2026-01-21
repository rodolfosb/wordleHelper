---
phase: 21-domain-configuration
plan: 01
subsystem: infra
tags: [vercel, cloudflare, dns, ssl, deployment]

# Dependency graph
requires:
  - phase: 19-vercel-setup
    provides: Vercel deployment with root path configuration
provides:
  - Custom subdomain wordle.brdk.cc pointing to Vercel
  - SSL/TLS configuration via Cloudflare (Full strict mode)
  - Base path fix for root deployment (absorbed from Phase 20)
affects: [deployment, dns, ssl]

# Tech tracking
tech-stack:
  added: []
  patterns: [cloudflare-dns-only-for-vercel, root-path-deployment]

key-files:
  created: []
  modified:
    - vite.config.ts (base path changed to /)
    - index.html (favicon paths updated for root)

key-decisions:
  - "DNS only mode (no Cloudflare proxy) for Vercel SSL compatibility"
  - "Full (strict) SSL mode kept - works with DNS only"
  - "Base path changed from /wordleHelper/ to / for Vercel root deployment"

patterns-established:
  - "Vercel + Cloudflare: Always use DNS only mode (gray cloud)"
  - "SSL Full (strict) works when Cloudflare proxy is off"

# Metrics
duration: ~20min
completed: 2026-01-20
---

# Phase 21: Domain Configuration Summary

**Custom subdomain wordle.brdk.cc deployed with Cloudflare DNS pointing to Vercel, including base path fix for root deployment**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-01-20
- **Completed:** 2026-01-20
- **Tasks:** 5
- **Files modified:** 2

## Accomplishments

- Custom subdomain wordle.brdk.cc added in Vercel dashboard
- CNAME record configured in Cloudflare (DNS only mode)
- SSL/TLS Full (strict) mode verified working
- Base path fixed from /wordleHelper/ to / for Vercel deployment
- Favicon paths updated for root deployment

## Task Commits

Each task was committed atomically:

1. **Task 1: Add custom domain in Vercel dashboard** - Manual (Vercel dashboard)
2. **Task 2: Configure Cloudflare DNS record** - Manual (Cloudflare dashboard)
3. **Task 3: Configure Cloudflare SSL/TLS mode** - Manual (Full strict kept)
4. **Task 4: Verify DNS propagation** - Verified (HTTP/2 200 from Vercel)
5. **Task 5: Human verify site works** - Approved (User confirmed deployment works)

**Additional fixes during execution:**
- `d4408c1` - fix: update base path from /wordleHelper/ to / for Vercel deployment
- `d238ed6` - fix: update favicon paths in index.html for root deployment

## Files Created/Modified

- `vite.config.ts` - Base path changed to `/` for Vercel root deployment
- `index.html` - Favicon paths updated to work from root

## Configuration Details

| Setting | Value |
|---------|-------|
| Subdomain | wordle.brdk.cc |
| CNAME Target | 61ec7b66a4a30f77.vercel-dns-017.com. |
| SSL Mode | Full (strict) |
| Cloudflare Proxy | OFF (DNS only - gray cloud) |

## Decisions Made

- **DNS only mode required:** Cloudflare proxy must be OFF for Vercel SSL certificates to work properly
- **Full (strict) SSL works:** With DNS only mode, Full (strict) is actually fine - no downgrade needed
- **Base path absorbed from Phase 20:** The base path fix was necessary for Vercel deployment and was completed as part of this phase's execution

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Base path configuration for Vercel**
- **Found during:** Task 4/5 (DNS verification / Human verify)
- **Issue:** Site deployed but assets/routes broken due to /wordleHelper/ base path
- **Fix:** Changed vite.config.ts base from '/wordleHelper/' to '/'
- **Files modified:** vite.config.ts
- **Verification:** Site loads correctly at wordle.brdk.cc
- **Committed in:** d4408c1

**2. [Rule 3 - Blocking] Favicon paths for root deployment**
- **Found during:** Task 5 (Human verify)
- **Issue:** Favicons not loading due to hardcoded /wordleHelper/ paths in index.html
- **Fix:** Updated favicon paths to root-relative paths
- **Files modified:** index.html
- **Verification:** Favicons load correctly
- **Committed in:** d238ed6

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were necessary for deployment to work. Phase 20 work (base path configuration) was effectively absorbed into this phase.

## Issues Encountered

- **Puzzle out of date:** User reported the puzzle is showing an old date - NYT sync may need review. This is a separate issue from deployment (app deploys correctly, sync issue is functional).

## User Setup Required

None - all external service configuration was completed during task execution via Vercel and Cloudflare dashboards.

## Next Phase Readiness

- Custom domain fully operational at wordle.brdk.cc
- SSL working with Full (strict) mode
- Ready for Phase 22 (if applicable) or milestone completion
- **Note:** Puzzle sync issue should be investigated separately (not a deployment blocker)

---
*Phase: 21-domain-configuration*
*Completed: 2026-01-20*
