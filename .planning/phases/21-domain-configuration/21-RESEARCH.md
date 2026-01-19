# Phase 21: Domain Configuration - Research

**Researched:** 2026-01-19
**Domain:** Vercel custom domain with Cloudflare DNS
**Confidence:** HIGH

<research_summary>
## Summary

Researched the integration between Vercel hosting and Cloudflare DNS for configuring a custom subdomain. The standard approach is to use Cloudflare in **DNS-only mode** (proxy disabled/gray cloud) with proper CNAME and A records pointing to Vercel.

Key finding: Vercel officially discourages using Cloudflare's proxy (orange cloud) because it limits Vercel's security features, introduces latency, and can cause SSL certificate issues. For a simple subdomain setup, DNS-only mode with Full SSL/TLS is the correct approach.

**Primary recommendation:** Add subdomain CNAME record pointing to Vercel's unique CNAME target with proxy OFF (gray cloud), set Cloudflare SSL/TLS to "Full", and let Vercel manage SSL certificates.
</research_summary>

<standard_stack>
## Standard Stack

### Core Configuration
| Component | Value | Purpose | Why Standard |
|-----------|-------|---------|--------------|
| CNAME Record | `cname.vercel-dns.com` (or project-specific) | Points subdomain to Vercel | Official Vercel recommendation |
| A Record (apex) | `76.76.21.21` (or project-specific IP) | Points root domain to Vercel | Vercel's dedicated Anycast IP |
| Proxy Status | OFF (DNS-only / gray cloud) | Direct traffic to Vercel | Required for SSL cert generation |
| SSL/TLS Mode | Full | Encrypt Cloudflare-to-Vercel | Prevents redirect loops |

### DNS Record Types by Domain Type
| Domain Type | Record Type | Name | Target |
|-------------|-------------|------|--------|
| Subdomain (e.g., wordle.example.com) | CNAME | wordle | `cname.vercel-dns.com` |
| Apex (e.g., example.com) | A | @ | `76.76.21.21` |
| WWW redirect | CNAME | www | `cname.vercel-dns.com` |

### Optional: CAA Record
| Type | Name | Value | When Needed |
|------|------|-------|-------------|
| CAA | @ | `0 issue "letsencrypt.org"` | If CAA records exist on domain |

**Note:** Vercel now provides project-specific CNAME targets (e.g., `d1d4fc829fe7bc7c.vercel-dns-017.com`) which are recommended over the generic `cname.vercel-dns.com`. Check your Vercel project's domain settings for the exact value.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Subdomain with DNS-Only (Recommended)
**What:** Configure subdomain CNAME with Cloudflare proxy disabled
**When to use:** Deploying to a subdomain like `wordle.example.com`
**Example:**

```
Cloudflare DNS Settings:
┌──────────┬─────────┬────────────────────────────┬───────────┐
│ Type     │ Name    │ Target                     │ Proxy     │
├──────────┼─────────┼────────────────────────────┼───────────┤
│ CNAME    │ wordle  │ cname.vercel-dns.com       │ DNS only  │
└──────────┴─────────┴────────────────────────────┴───────────┘

Cloudflare SSL/TLS Settings:
- Encryption mode: Full
```

### Pattern 2: Apex + WWW with Redirect
**What:** Configure apex domain with A record + www subdomain with redirect
**When to use:** Full domain setup (e.g., `example.com` + `www.example.com`)
**Example:**

```
Cloudflare DNS Settings:
┌──────────┬─────────┬────────────────────────────┬───────────┐
│ Type     │ Name    │ Target                     │ Proxy     │
├──────────┼─────────┼────────────────────────────┼───────────┤
│ A        │ @       │ 76.76.21.21                │ DNS only  │
│ CNAME    │ www     │ cname.vercel-dns.com       │ DNS only  │
└──────────┴─────────┴────────────────────────────┴───────────┘

Vercel Domain Settings:
- Primary: example.com
- Redirect: www.example.com → example.com
```

### Anti-Patterns to Avoid
- **Enabling Cloudflare proxy (orange cloud):** Causes SSL cert generation failures, redirect loops, and limits Vercel security features
- **SSL/TLS mode "Flexible":** Causes ERR_TOO_MANY_REDIRECTS because Cloudflare sends HTTP to Vercel, which redirects to HTTPS, creating a loop
- **Using A records for subdomains:** Subdomains should use CNAME records (A records are for apex domains only)
- **Mixing proxy ON/OFF:** If one record is proxied and another isn't, SSL validation can fail
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSL certificates | Manual cert generation/upload | Vercel auto-provisioning with Let's Encrypt | Vercel handles renewal automatically |
| DNS propagation checks | Custom polling scripts | WhatsMyDNS.org or `dig` commands | Established tools with global visibility |
| Redirect rules | Cloudflare Page Rules | Vercel domain redirect settings | Keeps logic in one place, cleaner |
| SSL configuration | Complex Cloudflare SSL rules | Set "Full" and let Vercel handle it | Vercel's default works correctly |

**Key insight:** The Vercel + Cloudflare integration is well-documented with established patterns. Don't add complexity with proxy settings, page rules, or custom SSL configurations - the simple DNS-only approach works reliably.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: ERR_TOO_MANY_REDIRECTS
**What goes wrong:** Browser shows redirect loop error
**Why it happens:** Cloudflare SSL/TLS mode is set to "Flexible", sending HTTP to Vercel. Vercel redirects to HTTPS, Cloudflare intercepts and sends HTTP again.
**How to avoid:** Set Cloudflare SSL/TLS encryption mode to "Full" (not "Flexible")
**Warning signs:** Site works on vercel.app URL but not custom domain

### Pitfall 2: SSL Certificate Not Generating
**What goes wrong:** Vercel shows "Generating SSL Certificate" indefinitely
**Why it happens:**
1. Cloudflare proxy is ON (blocks Let's Encrypt HTTP-01 challenge)
2. CAA records blocking Let's Encrypt
3. DNS hasn't propagated yet
**How to avoid:**
1. Disable proxy (gray cloud)
2. Add CAA record: `0 issue "letsencrypt.org"` if other CAA records exist
3. Wait 5-15 minutes for DNS propagation
**Warning signs:** Domain added but SSL status stuck, Vercel showing "Invalid Configuration" warning

### Pitfall 3: Invalid Configuration Warnings (False Positives)
**What goes wrong:** Vercel sends error emails about invalid subdomain configuration
**Why it happens:** Even with correct DNS-only setup, Vercel sometimes shows warnings during propagation
**How to avoid:** Wait for full propagation (up to 24-48 hours in extreme cases, usually 5-30 minutes)
**Warning signs:** Site works fine but Vercel dashboard shows warnings

### Pitfall 4: Using Wrong CNAME Target
**What goes wrong:** Domain doesn't resolve or shows wrong project
**Why it happens:** Using generic `cname.vercel-dns.com` when project has specific CNAME target
**How to avoid:** Always check your Vercel project's Domains page for the exact CNAME target
**Warning signs:** Domain points to different/old deployment or 404
</common_pitfalls>

<code_examples>
## Configuration Examples

### Step 1: Add Domain in Vercel
```
Vercel Dashboard → Project → Settings → Domains → Add Domain
Enter: wordle.yourdomain.com
```
Vercel will display the required DNS records.

### Step 2: Cloudflare DNS Configuration
```
Cloudflare Dashboard → Select Domain → DNS → Records → Add Record

Type: CNAME
Name: wordle (or your subdomain)
Target: cname.vercel-dns.com (or the specific target from Vercel)
Proxy status: DNS only (click the orange cloud to turn it gray)
TTL: Auto
```

### Step 3: Cloudflare SSL/TLS Configuration
```
Cloudflare Dashboard → Select Domain → SSL/TLS → Overview

SSL/TLS encryption mode: Full
```

### Step 4: Verify DNS Propagation
```bash
# Check CNAME record
dig CNAME wordle.yourdomain.com +short
# Expected: cname.vercel-dns.com (or your specific target)

# Check CAA records (if any issues)
dig CAA yourdomain.com +short
# Should include: 0 issue "letsencrypt.org"
```

### Step 5: Verify in Vercel
```
Vercel Dashboard → Project → Settings → Domains
Status should show: "Valid Configuration" with green checkmark
SSL Certificate: Valid
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic `cname.vercel-dns.com` | Project-specific CNAME targets | 2024 | Better routing, use dashboard value |
| Single IP `76.76.21.21` | Project-specific Anycast IPs | 2024 | Improved performance, check dashboard |
| Manual SSL renewal | Automatic Let's Encrypt | Long-standing | Zero maintenance |

**Current best practices:**
- Use Cloudflare for DNS only (proxy OFF), let Vercel handle everything else
- Always check Vercel dashboard for project-specific DNS values
- Set SSL/TLS to "Full" as a one-time configuration

**Deprecated/outdated:**
- Using Cloudflare proxy with Vercel (officially discouraged by Vercel)
- Manual SSL certificate management
- Complex page rules for redirects (use Vercel's built-in redirect)
</sota_updates>

<open_questions>
## Open Questions

1. **Project-specific DNS values**
   - What we know: Vercel provides unique CNAME targets per project
   - What's unclear: Exact value until we add domain in Vercel dashboard
   - Recommendation: Add domain in Vercel first, then copy exact values to Cloudflare

2. **Existing Cloudflare setup**
   - What we know: User has domain on Cloudflare
   - What's unclear: Current SSL/TLS mode, existing DNS records, CAA records
   - Recommendation: Review current Cloudflare settings before making changes
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Vercel: Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) - Official domain setup docs
- [Vercel: Should I use Cloudflare in front of Vercel?](https://vercel.com/kb/guide/cloudflare-with-vercel) - Official recommendation against proxy
- [Vercel: A Record and CAA with Vercel](https://vercel.com/kb/guide/a-record-and-caa-with-vercel) - IP addresses and CAA records
- [Vercel: Domain Not Generating SSL Certificate](https://vercel.com/kb/guide/domain-not-generating-ssl-certificate) - SSL troubleshooting

### Secondary (MEDIUM confidence)
- [GitHub Gist: Add Cloudflare Custom Domain to Vercel](https://gist.github.com/nivethan-me/a56f18b3ffbad04bf5f35085972ceb4d) - Community step-by-step guide (verified against official docs)
- [Cloudflare Community: Help setting up CNAME from Vercel](https://community.cloudflare.com/t/help-setting-up-a-cname-record-from-vercel/636105) - Community patterns

### Tertiary (LOW confidence - needs validation)
- None - all findings verified against official sources
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Vercel hosting + Cloudflare DNS
- Ecosystem: Let's Encrypt SSL, DNS propagation
- Patterns: CNAME subdomain setup, DNS-only mode
- Pitfalls: SSL generation, redirect loops, proxy issues

**Confidence breakdown:**
- Standard stack: HIGH - official Vercel documentation
- Architecture: HIGH - established patterns, verified
- Pitfalls: HIGH - documented in official troubleshooting guides
- Code examples: HIGH - from official docs and verified community guides

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - stable technology, well-established patterns)
</metadata>

---

*Phase: 21-domain-configuration*
*Research completed: 2026-01-19*
*Ready for planning: yes*
