# Phase 6: PWA Support - Research

**Researched:** 2026-01-13
**Domain:** Progressive Web App with Vite
**Confidence:** HIGH

<research_summary>
## Summary

Researched the PWA ecosystem for adding offline support and installability to a Vite/TypeScript static app deployed on GitHub Pages. The standard approach uses **vite-plugin-pwa** (v1.2.0), which provides zero-config PWA integration with automatic service worker generation via Workbox.

Key finding: Don't hand-roll service workers or precache manifests. vite-plugin-pwa handles service worker generation, precaching, cache invalidation, and update lifecycle automatically. Custom service worker code leads to bugs around cache invalidation, update detection, and cross-browser compatibility.

**Primary recommendation:** Use vite-plugin-pwa with `registerType: 'autoUpdate'` and `generateSW` strategy. This is ideal for a static helper app with no forms - automatic updates are safe. Generate icons with @vite-pwa/assets-generator from an SVG source.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-pwa | ^1.2.0 | PWA integration for Vite | Zero-config, handles manifest + SW automatically |
| workbox-build | ^7.4.0 | Service worker generation | Google's official SW library, peer dep |
| workbox-window | ^7.4.0 | SW registration in browser | Clean registration API, peer dep |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vite-pwa/assets-generator | ^1.0.2 | Generate PWA icons | When creating icons from SVG source |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vite-plugin-pwa | Manual service worker | Much more code, harder cache management, update bugs |
| generateSW | injectManifest | injectManifest only if custom SW logic needed (not our case) |
| autoUpdate | prompt | prompt better for apps with forms; our app has no forms |

**Installation:**
```bash
npm install -D vite-plugin-pwa
# Optional for icon generation:
npm install -D @vite-pwa/assets-generator
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
public/
├── favicon.ico           # Browser fallback
├── favicon.svg           # Modern browsers
├── apple-touch-icon.png  # iOS (180x180)
├── pwa-192x192.png       # Android/PWA
├── pwa-512x512.png       # PWA splash
└── maskable-icon.png     # Adaptive icon (512x512)

src/
└── (no changes needed - plugin auto-registers SW)

vite.config.ts            # VitePWA plugin config
```

### Pattern 1: Zero-Config PWA Setup
**What:** Minimal vite-plugin-pwa configuration for static apps
**When to use:** Static sites with no dynamic content, no forms
**Example:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/wordleHelper/',  // Match existing base
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wordle Helper',
        short_name: 'WordleHelp',
        description: 'Solve Wordle puzzles with smart word suggestions',
        theme_color: '#121213',  // Match Wordle dark theme
        background_color: '#121213',
        display: 'standalone',
        scope: '/wordleHelper/',
        start_url: '/wordleHelper/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
```

### Pattern 2: GitHub Pages Base URL Handling
**What:** Ensure SW scope and manifest paths work with subdirectory deployment
**When to use:** Any GitHub Pages project site (not user.github.io)
**Example:**
```typescript
// All paths must include base - plugin handles this automatically when:
// 1. vite.config has `base: '/wordleHelper/'`
// 2. manifest has `scope: '/wordleHelper/'` and `start_url: '/wordleHelper/'`
// The plugin injects the manifest with correct paths
```

### Pattern 3: Auto-Update with Immediate Registration
**What:** Register SW immediately, auto-update on new versions
**When to use:** Apps without forms where auto-reload is safe
**Example:**
```typescript
// Plugin with autoUpdate does this automatically:
// - Sets workbox.clientsClaim: true
// - Sets workbox.skipWaiting: true
// - Generates virtual:pwa-register import
// No manual registration code needed when using registerType: 'autoUpdate'
```

### Anti-Patterns to Avoid
- **Custom service worker code:** Don't write SW logic; let generateSW handle it
- **Caching everything manually:** Workbox precaches build output automatically
- **skipWaiting without understanding:** Can break code-split apps (not an issue for us)
- **Missing scope configuration:** On subpath deployments, always set scope explicitly
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker | Custom fetch/cache handlers | vite-plugin-pwa generateSW | Cache invalidation is notoriously hard; Workbox handles versioning |
| Precache manifest | Manual file list | Workbox auto-generation | Build output changes; manual lists get stale |
| SW update detection | Custom version checking | workbox-window | Lifecycle events are complex, browser differences exist |
| Icon generation | Manual resize/export | @vite-pwa/assets-generator | Multiple sizes, formats, maskable variants needed |
| Manifest injection | Manual link tag | Plugin auto-injects | Ensures correct paths with base URL |

**Key insight:** Service worker lifecycle is one of the most bug-prone areas in web development. Even experienced developers get cache invalidation wrong. vite-plugin-pwa + Workbox abstracts all the complexity into tested, maintained code.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Missing Base URL in Manifest
**What goes wrong:** SW scope doesn't match app, offline fails
**Why it happens:** GitHub Pages serves from /repo-name/, not root
**How to avoid:** Set `scope` and `start_url` in manifest to match vite `base`
**Warning signs:** App installs but shows "offline" or wrong content

### Pitfall 2: Icon Size/Format Requirements
**What goes wrong:** PWA not installable, browser shows no install prompt
**Why it happens:** Missing required 192x192 or 512x512 icons
**How to avoid:** Include both sizes, plus maskable variant
**Warning signs:** Lighthouse shows "No installable" error

### Pitfall 3: Caching Critical Files
**What goes wrong:** Users see stale index.html after deploy
**Why it happens:** Browsers aggressively cache HTML/SW/manifest
**How to avoid:** Configure server headers (GitHub Pages handles this OK)
**Warning signs:** Deployed changes don't appear even after hard refresh

### Pitfall 4: iOS Safari Limitations
**What goes wrong:** PWA behaves differently or loses data on iOS
**Why it happens:** Safari has 50MB cache limit, 7-day expiration, quirks
**How to avoid:** Keep cached assets small, test on real iOS device
**Warning signs:** Works on Android/Chrome, fails on iPhone

### Pitfall 5: Service Worker Update Not Activating
**What goes wrong:** Old version persists despite new deploy
**Why it happens:** SW waits for all tabs to close before activating
**How to avoid:** Use autoUpdate with skipWaiting (plugin default)
**Warning signs:** Multiple tabs show different versions

### Pitfall 6: HTTPS Requirement
**What goes wrong:** SW registration fails silently
**Why it happens:** Service workers require HTTPS (except localhost)
**How to avoid:** GitHub Pages provides HTTPS automatically
**Warning signs:** Works locally, fails in production
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Complete vite.config.ts for This Project
```typescript
// Source: vite-pwa-org.netlify.app/guide/
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/wordleHelper/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Wordle Helper',
        short_name: 'WordleHelp',
        description: 'Smart word suggestions to solve Wordle puzzles',
        theme_color: '#121213',
        background_color: '#121213',
        display: 'standalone',
        scope: '/wordleHelper/',
        start_url: '/wordleHelper/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
```

### Required index.html Meta Tags
```html
<!-- Source: vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#121213" />
  <meta name="description" content="Smart word suggestions to solve Wordle puzzles" />
  <link rel="icon" href="/wordleHelper/favicon.ico" />
  <link rel="apple-touch-icon" href="/wordleHelper/apple-touch-icon.png" />
  <title>Wordle Helper</title>
</head>
```

### Icon Generation Command (Optional)
```bash
# Source: vite-pwa-org.netlify.app/assets-generator/
# If using assets-generator with an SVG source:
npx @vite-pwa/assets-generator --preset minimal-2023 public/logo.svg
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual SW registration | virtual:pwa-register | vite-plugin-pwa 0.12+ | No manual registration code needed |
| Separate manifest.json | Plugin-generated manifest | Always | Plugin handles injection |
| workbox-cli | vite-plugin-pwa + workbox-build | 2022+ | Integrated into build pipeline |

**New tools/patterns to consider:**
- **@vite-pwa/assets-generator:** Auto-generate all icon sizes from one SVG
- **PWA install prompt:** Can be triggered programmatically via beforeinstallprompt event

**Deprecated/outdated:**
- **Manual service worker files:** Use generateSW instead
- **Create-react-app PWA template:** vite-plugin-pwa is the Vite equivalent
- **workbox-cli standalone:** Integrated into Vite plugin
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **iOS Safari 7-day cache expiration**
   - What we know: Safari can clear PWA cache after 7 days of non-use
   - What's unclear: Whether this affects our small static assets (~100KB)
   - Recommendation: Proceed; our asset size is well under limits. Test on real iOS device.

2. **GitHub Pages cache headers**
   - What we know: GitHub Pages sets reasonable cache headers
   - What's unclear: Exact cache-control values for manifest/SW
   - Recommendation: Monitor after deploy; can't control GH Pages headers anyway
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [vite-pwa-org.netlify.app/guide/](https://vite-pwa-org.netlify.app/guide/) - Setup, configuration, registerType
- [vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html) - Icon requirements, manifest fields
- [vite-pwa-org.netlify.app/guide/auto-update.html](https://vite-pwa-org.netlify.app/guide/auto-update.html) - Auto-update behavior
- [vite-pwa-org.netlify.app/assets-generator/](https://vite-pwa-org.netlify.app/assets-generator/) - Icon generation
- npm registry - Verified versions: vite-plugin-pwa@1.2.0, @vite-pwa/assets-generator@1.0.2

### Secondary (MEDIUM confidence)
- [developer.chrome.com/docs/workbox/caching-strategies-overview](https://developer.chrome.com/docs/workbox/caching-strategies-overview) - Caching strategies
- [MDN display modes](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display) - Display mode differences
- [Rich Harris SW gotchas gist](https://gist.github.com/Rich-Harris/fd6c3c73e6e707e312d7c5d7d0f3b2f9) - Common SW pitfalls

### Tertiary (LOW confidence - needs validation)
- iOS Safari limitations - Cross-referenced with MDN and web.dev, but test on real device
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: vite-plugin-pwa for Vite PWA integration
- Ecosystem: Workbox for SW generation, manifest configuration
- Patterns: Auto-update, GitHub Pages deployment, icon requirements
- Pitfalls: Base URL, iOS limits, SW lifecycle, cache invalidation

**Confidence breakdown:**
- Standard stack: HIGH - verified with npm registry and official docs
- Architecture: HIGH - from official vite-pwa documentation
- Pitfalls: HIGH - documented in official guides and community resources
- Code examples: HIGH - adapted from official documentation for this project

**Research date:** 2026-01-13
**Valid until:** 2026-02-13 (30 days - vite-plugin-pwa ecosystem stable)
</metadata>

---

*Phase: 06-pwa-support*
*Research completed: 2026-01-13*
*Ready for planning: yes*
