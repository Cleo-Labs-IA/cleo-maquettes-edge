# Sortie Liart V6 All-Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Cleo V6 visual direction to every generated Sortie Liart page while preserving all routes, content, SEO metadata and working interactions.

**Architecture:** Keep the legacy design system untouched and add three scoped V6 lane stylesheets: foundation/shell, home, and page-family adapters. A versioned manifest assigns every generated file to a family; `construire.mjs` exposes that assignment as body data attributes so the new layer is additive and reversible.

**Tech Stack:** Static HTML fragments, CSS custom properties, Node.js ESM generator, Playwright-based existing browser verifier.

## Global Constraints

- The approved reference is `/Users/naomiehalioua/Downloads/cleo-ds-cleonardo-prototype/.superpowers/brainstorm/81161-1788442644/content/liart-v6-application-1.html`.
- Preserve visible copy, numbers, links, form attributes, image sources and alt text, canonical links, hreflang, JSON-LD, robots directives and clean routes.
- Keep the validated product globe implementation unchanged.
- Scope every new CSS rule under `body[data-cleo-ds="v6"]` and prefix new custom properties with `--cleo-v6-`.
- Use `#F9F8F6`, `#FFFFFF`, `#EFEEFB`, `#F1EEE3`, `#1A1A1A`, `#08093B`, `#12134F`, `#0008CF` and `#4D57FF` exactly as defined by the design spec.
- Use radii `8px`, `16px`, `24px` and `9999px`; use a `1320px` page width and `clamp(20px, 3vw, 42px)` gutter.
- Keep one page-level deep-indigo field, normally the first section in `<main>`; footer and closing CTA remain light.
- Do not introduce green or decorative blue; a compliance status must retain text and icon, not colour alone.
- Preserve `/Users/naomiehalioua/cleo-maquettes-edge/rapports/anim-mobile.mjs` unchanged and untracked.
- Do not deploy or modify `/Users/naomiehalioua/cleo-landing` in this plan.

---

### Task 1: Versioned activation manifest and structural audit

**Files:**
- Create: `commun/v6-routes.json`
- Create: `tests/v6-structure.mjs`
- Modify: `construire.mjs`

**Interfaces:**
- Consumes: `PAGES` output names and `commun/chemins.json` route map.
- Produces: `data-cleo-ds="v6"`, `data-v6-family`, and `data-v6-page` on every generated `<body>`; `tests/v6-structure.mjs` exits non-zero on incomplete activation.

- [ ] **Step 1: Write the failing structural test**

Create a Node ESM test that reads `commun/v6-routes.json`, enumerates `sortie/*.html`, ignores no generated HTML file, and asserts for every output that the manifest contains a family and the HTML contains all three body attributes. It must also assert that the manifest keys and generated HTML filenames are identical sets.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/v6-structure.mjs`

Expected: non-zero exit because `commun/v6-routes.json` and the body attributes do not exist yet.

- [ ] **Step 3: Add the manifest and generator boundary**

Add one manifest entry for each output in `PAGES`, using only these family values: `preview`, `home`, `company-proof`, `product`, `audience`, `regulation`, `resource-index`, `article`, `trust-conversion`, `not-found`.

Read the manifest beside `CHEMINS`:

```js
const V6_ROUTES = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/v6-routes.json'), 'utf8'))
```

After `nomSortie` is known, fail closed and derive the page slug:

```js
const familleV6 = V6_ROUTES[nomSortie]
if (!familleV6) throw new Error(`FAMILLE V6 ABSENTE : ${nomSortie}`)
const pageV6 = nomSortie.replace(/\.html$/, '')
```

Render the body boundary exactly once:

```html
<body data-cleo-ds="v6" data-v6-family="${familleV6}" data-v6-page="${pageV6}">
```

- [ ] **Step 4: Build and make the structural test pass**

Run: `node construire.mjs && node tests/v6-structure.mjs`

Expected: build exit `0`; structural audit reports the exact generated HTML count and zero missing/extra entries.

- [ ] **Step 5: Commit atomically**

Run: `git add commun/v6-routes.json tests/v6-structure.mjs construire.mjs && git commit -m "feat: scope V6 across generated routes"`

### Task 2: Shared V6 foundation, shell and primitive surfaces

**Files:**
- Create: `commun/lanes/v6-foundation.css`

**Interfaces:**
- Consumes: the body attributes from Task 1 and existing classes from `commun/base.css`, `commun/composants.css`, navigation/footer fragments and lane styles.
- Produces: V6 custom properties, warm canvas, navigation, typography, buttons, common sections/cards/forms, one-deep-field rule, light closing CTA and warm footer.

- [ ] **Step 1: Write the scoped CSS contract first**

Begin the file with the exact token block under `body[data-cleo-ds="v6"]`; add a static check command that requires every non-`@keyframes` selector group in the file to contain the body scope and rejects any assignment to legacy custom properties.

- [ ] **Step 2: Verify the contract fails before the stylesheet exists**

Run: `test -f commun/lanes/v6-foundation.css && rg -q -- '--cleo-v6-deep: #08093B' commun/lanes/v6-foundation.css`

Expected: non-zero exit.

- [ ] **Step 3: Implement the shared layer**

Define the exact V6 tokens from the spec, then adapt `.navigation`, `.nav-inner`, `.mega-menu`, `.menu-mobile`, `.conteneur`, `.section`, typography classes, `.btn`, `.carte`, `.carte-claire`, `.carte-encre`, form controls, status pills, tables, first main section, later `.sur-sombre` sections, `.cta-final`, `.pied` and skip/focus states. Preserve structural display rules needed by the existing JavaScript.

- [ ] **Step 4: Add responsive and reduced-motion rules**

At `1024px`, reduce multi-column density; at `760px`, convert common grids to one column where existing lanes do not already do so; at `640px`, use a `14px` minimum functional text size and `44px` targets. Under reduced motion, remove decorative transitions without hiding content.

- [ ] **Step 5: Build and run shared checks**

Run: `node construire.mjs && node tests/v6-structure.mjs && node garde-seo.mjs`

Expected: all commands exit `0`; every generated HTML includes the scoped token layer; SEO guard reports no new regression.

- [ ] **Step 6: Commit atomically**

Run: `git add commun/lanes/v6-foundation.css && git commit -m "feat: add V6 marketing foundation"`

### Task 3: Approved home composition

**Files:**
- Create: `commun/lanes/v6-home.css`

**Interfaces:**
- Consumes: `[data-v6-family="home"]`, `.hero-epure`, `.hero-globe`, `.champ-demo`, `.g-agents`, `.radar`, `#compliance-service`, `.acc-methode`, `.temoin-compact`, `.acc-cloture`, `.securite-bas`.
- Produces: the approved two-column desktop hero and one-column mobile hero while leaving the globe markup/script untouched.

- [ ] **Step 1: Add a home-specific contract check**

Run before creating the file: `test -f commun/lanes/v6-home.css && rg -q 'grid-template-columns:minmax\(0,1fr\) minmax\(440px,1fr\)' commun/lanes/v6-home.css`

Expected: non-zero exit.

- [ ] **Step 2: Implement the desktop composition**

Scope every rule under `body[data-cleo-ds="v6"][data-v6-family="home"]`. Turn `.hero-epure` into the inset two-column deep field, left-align its copy/form, make `.hero-globe` the right grid cell, and retain a visible first-viewport globe. Restyle feature agents as white V6 cards, the radar as a raised product surface, the method as pale, the testimonial as a quote card, the closing CTA as cream, and security as light cards.

- [ ] **Step 3: Implement the mobile composition**

At `820px`, switch the hero to one column with text before globe. At `560px`, use `20px` hero radius, `20px` internal padding, full-width form controls and a globe height that remains at least `390px` without horizontal overflow.

- [ ] **Step 4: Build and inspect both locales**

Run: `node construire.mjs && node tests/v6-structure.mjs`

Then render `/fr` and `/en` at `1440 × 1100` and `390 × 844`. Expected: one deep field, two-column desktop, one-column mobile, globe present, no clipped form and no horizontal scroll.

- [ ] **Step 5: Commit atomically**

Run: `git add commun/lanes/v6-home.css && git commit -m "feat: apply approved V6 home composition"`

### Task 4: Page-family adapters for every non-home route

**Files:**
- Create: `commun/lanes/v6-families.css`

**Interfaces:**
- Consumes: all non-home values of `data-v6-family` and the existing family classes in `commun/lanes/cadre.css`, `cas.css`, `features.css`, `ressources.css` and `segments.css`.
- Produces: coherent V6 hero, index, card, editorial, product, trust, conversion and 404 compositions across every manifest entry.

- [ ] **Step 1: Establish the family coverage check**

The stylesheet must contain at least one explicit selector for each non-home family value. Verify with:

```bash
for family in preview company-proof product audience regulation resource-index article trust-conversion not-found; do
  rg -q "data-v6-family=\\\"$family\\\"" commun/lanes/v6-families.css || exit 1
done
```

Expected before implementation: non-zero exit.

- [ ] **Step 2: Implement product, audience and regulation adapters**

Use a left-aligned inset hero, prominent real product specimen, white feature cards, pale explanatory fields and restrained status colour. Preserve tables, maps, tabs, upload controls and source links. Do not alter the Legal Data geography implementation.

- [ ] **Step 3: Implement resource, article and company adapters**

Give index cards consistent media ratios/radii, keep article prose within a readable measure, preserve breadcrumbs/bylines, and render quotes/proof as white raised cards. Keep all list items and destinations.

- [ ] **Step 4: Implement trust, conversion, preview and 404 adapters**

Keep forms fully functional, make legal/career copy readable, make the campaign’s first field the only page-level deep field, and ensure the 404 provides a visible route back into the site.

- [ ] **Step 5: Build and run family coverage**

Run: `node construire.mjs && node tests/v6-structure.mjs` followed by the family loop from Step 1.

Expected: all commands exit `0` and every family is explicitly covered.

- [ ] **Step 6: Commit atomically**

Run: `git add commun/lanes/v6-families.css && git commit -m "feat: apply V6 to every page family"`

### Task 5: Whole-site verification and visual handoff

**Files:**
- Create: `rapports/v6-verification.md`

**Interfaces:**
- Consumes: every generated route, the existing verifier/SEO guard and representative desktop/mobile captures.
- Produces: a reproducible pass/fail ledger and an open local browser preview.

- [ ] **Step 1: Run the complete static build and guards**

Run: `node construire.mjs && node tests/v6-structure.mjs && node garde-seo.mjs`

Expected: all exit `0`; generated count matches the V6 manifest.

- [ ] **Step 2: Run the browser verifier**

Run: `node verifier.mjs`

Expected: exit `0`, no horizontal-overflow, console, internal-link, semantics or interaction regression reported by the existing suite.

- [ ] **Step 3: Capture representative pages**

Capture both `1440 × 1100` and `390 × 844` for `/fr`, `/fr/platform`, `/fr/platform/research`, `/fr/for/manufacturers`, `/fr/legal-data`, `/fr/blog`, one article, `/fr/security`, `/fr/meet`, `/fr/terms`, `/fr/guide/ppwr` and the 404. Record exact file paths and pass/fail observations in `rapports/v6-verification.md`.

- [ ] **Step 4: Check preservation and scope**

Run `git diff d1dc33f -- pages commun/base.css commun/composants.css commun/lanes/accueil.css commun/lanes/cadre.css commun/lanes/cas.css commun/lanes/features.css commun/lanes/ressources.css commun/lanes/segments.css`.

Expected: no output for legacy page fragments and stylesheets; only the generator, new manifest, new V6 lanes, tests, docs and verification report differ from the base commit.

- [ ] **Step 5: Commit the verification ledger atomically**

Run: `git add rapports/v6-verification.md docs/superpowers/specs/2026-09-03-sortie-liart-v6-all-pages-design.md docs/superpowers/plans/2026-09-03-sortie-liart-v6-all-pages.md && git commit -m "docs: record V6 whole-site verification"`

- [ ] **Step 6: Open the result without deploying**

Start `node commun/servir.mjs`, open the local `/fr` preview in the user’s browser, and leave the server running for visual review. Do not run a Vercel deployment command.
