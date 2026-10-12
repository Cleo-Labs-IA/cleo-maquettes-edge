# PostHog-led Home Preview Implementation Plan

> **For Codex:** Execute task by task with fail-first tests. This branch is preview-only; never pass `--prod` to Vercel.

**Goal:** Replace the FR/EN Cleo home with a four-block, Service-first experience that reflects the observed PostHog paths while keeping Data secondary and the HubSpot meeting route in the global navigation.

**Architecture:** Keep the existing static-site builder and clean routes. Rewrite only the two home fragments, opt those pages into the existing light Service regime, and add home-scoped styles to the already isolated light-regime stylesheet. Protect the conversion hierarchy with source-contract and Playwright browser tests, while retaining the existing SEO metadata and shared navigation/footer.

**Tech Stack:** Static HTML fragments, scoped CSS, Node.js ESM, Playwright, existing `construire.mjs` builder, Vercel preview deployment.

---

### Task 1: Lock the conversion contract with a failing source test

**Files:**
- Create: `tests/home-posthog.mjs`

**Steps:**
1. Assert exactly four `.hp-bloc` sections per language.
2. Assert one Service CTA in the hero with the exact clean-route target.
3. Assert Data follows as a secondary text link and the hero contains no HubSpot link.
4. Assert four direct service cards and no legacy quick-access, manifesto, wheel, long FAQ, or Enterprise choice.
5. Run `node tests/home-posthog.mjs` and confirm it fails against the old home for the expected missing `.hp-*` contract.

### Task 2: Rewrite the FR and EN home fragments

**Files:**
- Modify: `pages/43-accueil-avant-vendre.html`
- Modify: `pages/43-accueil-avant-vendre-en.html`

**Steps:**
1. Replace the existing long home with four blocks: Service hero, four priced services, compact proof/process, final Service + Data routing.
2. Reuse only verified content, routes, images, logos, and prices from `pages/37-compliance-service{,-en}.html`.
3. Keep exactly one H1, the SEO key phrase visible, and a three-step visible HowTo.
4. Run the source contract and confirm it passes.

### Task 3: Apply the light Service visual system to the home

**Files:**
- Modify: `construire.mjs`
- Modify: `commun/lanes/v6-zzzzzzzzzzzzzzzzzzzzzzz-service-clair.css`

**Steps:**
1. Add both page-43 IDs to `PAGES_REGIME_SERVICE`.
2. Add only `.hp-*` home rules under `body[data-v6-regime="service"]`.
3. Keep the primary CTA visually dominant without introducing a pill-heavy interface; keep Data as an underlined secondary route.
4. Add responsive rules for 1440×900 and 390×844, including no horizontal overflow.

### Task 4: Record and test the four public prices

**Files:**
- Create: `docs/verification/2026-10-12-home-prices.md`
- Create: `tests/home-posthog-prices-proof.mjs`

**Steps:**
1. Record the exact live/source queries, raw values, no-dedup rationale, confidence, and four verdicts.
2. Make the proof script compare each home price with the canonical Service fragment in both languages.
3. Run `node tests/home-posthog-prices-proof.mjs` and require 8/8 language/price assertions to pass.

### Task 5: Reconcile the home SEO guard with the intentionally shorter page

**Files:**
- Modify: `tests/seo-accueil.mjs`

**Steps:**
1. Keep title, canonical, hreflang, Open Graph, visible keyword, unique H1, Organization, internal routes, and indexability checks.
2. Mark the intentionally removed FAQPage as an explicit accepted exception.
3. Replace the old “90% of production copy” check with a focused minimum-content and Service-first contract.
4. Update the negative witness so it still proves the structured-data test can fail without depending on the removed FAQ markup.

### Task 6: Add browser-level conversion-path verification

**Files:**
- Create: `tests/home-posthog-browser.mjs`
- Modify: `scripts/relais-ci.sh`

**Steps:**
1. Serve `sortie/` through `commun/servir.mjs`.
2. Verify FR/EN at 1440×900 and 390×844: primary CTA above fold, exact href/text, secondary Data ordering, HubSpot in desktop/mobile navigation, four cards, no overflow, loaded images, and no console/runtime errors.
3. Click the primary CTA and require the clean Service route to load with a visible H1.
4. Re-run three negative witnesses: missing CTA, wrong HubSpot href, CTA moved below the fold.
5. Capture fold and mobile-menu screenshots under `/private/tmp/cleo-home-test/` during final verification.
6. Add the three home tests to the CI test list.

### Task 7: Build, verify, commit, and publish a preview

**Files:**
- Generated only: `sortie/` (ignored)
- Potential content fingerprint update: `commun/dates-pages.json`

**Steps:**
1. Run the Node 24 builder.
2. Run the new tests, then the full existing test suite.
3. Inspect `git diff --check`, `git status`, and the final diff; do not include `node_modules` or any concurrent work.
4. Fetch and confirm the preview branch has not diverged.
5. Stage exact owned files and commit atomically.
6. Deploy `sortie/` with `vercel deploy ... --yes` and no `--prod`.
7. Open the returned preview in a visible browser and repeat the desktop/mobile visual check before handing over the URL.
