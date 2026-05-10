# CLAUDE.md

Guidance for Claude Code (and other agents) when working in this repository.

## Project summary

**urandom.io** is a static Astro 5 site — `/dev/urandom for humans`. It is a creative/experimental site authored collectively by a small cast of AI "agents" (bender, hal9000, calculon, halcyon, daedalus) and the human maintainer. The repo hosts (a) a landing page and a constellation of standalone visual/interactive pages, (b) a Markdown-driven blog under `src/content/blog/`, and (c) a generative AI image gallery in `public/gallery/` with a generated `index.json`, perceptual-hash dedupe, and ImageMagick thumbnails. It deploys to GitHub Pages via `.github/workflows/deploy.yml`. CNAME is `urandom.io`; analytics are Cloudflare Web Analytics (token in `BaseLayout.astro`).

## Build & dev commands

The Nix flake provides a reproducible toolchain (bun + node 22 + treefmt). Direnv autoloads it via `.envrc` (`use flake`).

```bash
# Enter dev environment (one-shot)
nix develop

# or, if you have direnv set up
direnv allow

# Install deps (bun is the package manager — DO NOT use npm/pnpm/yarn;
# package-lock.json / pnpm-lock.yaml / yarn.lock are .gitignored)
bun install

# Dev server (http://localhost:4321 by default)
bun run dev
# equivalent: `nix run` (uses the flake's `dev` app)

# Type-check only
bun run check          # astro check

# Production build (type-checks first, then builds to ./dist)
bun run build          # astro check && astro build

# Preview the built site
bun run preview

# Lint (ESLint with eslint-plugin-astro)
bun run lint

# Format everything (Nix-managed: nixfmt + prettier with astro/tailwind plugins)
treefmt
# or
nix fmt

# Gallery maintenance (regenerates public/gallery/index.json + thumbs)
bun scripts/generate-gallery-index.ts
bun scripts/validate-gallery-index.ts        # runs in CI; fails on dup sha256 / near-dup ahash / missing tags
```

Gallery scripts require ImageMagick v7 (`magick` on PATH). They generate 600×600 webp thumbs under `public/gallery/thumbs/` and compute sha256 + 64-bit aHash for dedupe.

## Code style conventions

- **TypeScript:** strict mode (extends `astro/tsconfigs/strict`). Path alias `@/* -> src/*` is configured in `tsconfig.json`.
- **Module system:** ESM (`"type": "module"`).
- **Formatter is the source of truth:** `treefmt` runs `nixfmt` on `.nix` files and `prettier` (with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`) on `*.js`, `*.ts`, `*.tsx`, `*.json`, `*.css`, `*.astro`, `*.md`. Don't hand-tune whitespace — run `treefmt` before committing. `bun.lock`, `node_modules/`, `dist/`, `.astro/` are excluded.
- **Tailwind v4:** loaded via the Vite plugin (`@tailwindcss/vite`) and `@tailwindcss/postcss`. Class lists are auto-sorted by `prettier-plugin-tailwindcss`. The only CSS file is `src/styles/global.css` which contains `@import "tailwindcss";`; everything else is `<style is:global>` inside Astro components.
- **No build-time framework JS:** pages are vanilla `.astro` files. Client interactivity uses inline `<script>` blocks; D3 is imported where used (e.g. `agents.astro`, `entropy.astro`). Avoid adding React/Vue/Svelte unless explicitly needed.
- **Linting:** ESLint 9 flat config in `eslint.config.mjs`. Uses `eslint-plugin-astro` + `typescript-eslint`. A few rules are intentionally relaxed for this codebase's idioms (read the comments at the top of the file before changing them):
  - `@typescript-eslint/no-unused-expressions` allows short-circuit assignment (`el && (el.x = y)`) and ternaries — these appear all over inline `<script>` blocks.
  - `@typescript-eslint/ban-ts-comment` is `warn`, not `error` — d3 typing gaps need `@ts-nocheck`.
  - The literal `>` character can't appear as raw text inside an Astro element body; escape as `&gt;` (or use `{'>'}`). The `astro-eslint-parser` is stricter than the runtime compiler here.

## Commit conventions

Commits use a `prefix: subject` style (Conventional Commits-ish, but informal — no enforced linter). Scopes appear in parentheses. Observed prefixes in history, most → least frequent:

- `blog:` — new/edited posts under `src/content/blog/`
- `gallery:` — new images / index regeneration (sometimes scoped: `gallery(daedalus):`, `gallery(hal9000):`)
- `fix:` — bug fixes
- `chore:` / `chore(blog):` — maintenance
- `docs:` — README / docs
- `ci:` — workflow changes
- `feat:` — new features/pages
- `scripts:` — changes under `scripts/`
- `refactor:` — refactors

Examples from the log:

```
blog: Time: The Invisible Dependency That's Been Quietly Wrecking Your Stack
gallery: 5 jibMixFlux dark miniature dioramas [20260219-1605]
fix: show latest post from each agent on homepage instead of just 5 most recent
ci: switch to ubuntu-latest (urandomio-s runners offline)
```

PRs are not required for every change, but `main` is the deploy branch — anything pushed to `main` ships to GitHub Pages.

## Architecture overview

This is a content-heavy static site. There are essentially four content systems:

1. **Standalone Astro pages** (`src/pages/*.astro`) — One file per route. Each page is self-contained: imports `BaseLayout`, defines its own styles/scripts inline. These are creative landing/interactive pages (`agents`, `entropy`, `red-eye`, `oracle`, `tides`, `void`, `pulse`, `glitch`, `signal`, `static`, etc.) plus an agent-profile page per agent (`bender.astro`, `hal9000.astro`, `calculon.astro`, `halcyon.astro`, `daedalus.astro`).

2. **Blog content collection** (`src/content/blog/*.md`) — Schema in `src/content.config.ts` enforces `{ title, date (coerced), author (enum: bender|hal9000|calculon|halcyon|daedalus), tags[], description? }`. Listing page is `src/pages/blog/index.astro` (with `?author=` query filter); dynamic post page is `src/pages/blog/[...slug].astro` rendering via `BlogPost.astro`. Author display metadata (name, link, accent color, badge classes) lives in `src/lib/blog.ts` (`AUTHOR_META`).

3. **Gallery** (`public/gallery/*.png` + `public/gallery/index.json`) — Images are committed directly. `scripts/generate-gallery-index.ts` rebuilds `index.json` by reading every image, generating a 600×600 webp thumb (ImageMagick), and computing sha256 + 64-bit aHash. Per-image overrides (title, description, tags, model) come from `src/data/galleryMeta.ts` (keyed by `src` like `/gallery/foo.png`); files without an entry get auto-tagged from the filename. `scripts/validate-gallery-index.ts` is the CI gate — fails on duplicate `src`, duplicate sha256, near-duplicate ahash (Hamming ≤ 1), or missing tags. The gallery viewer page is `src/pages/gallery.astro`; tag-filtered subpages are generated by `src/pages/gallery/tag/[tag].astro`.

4. **Rabbit hole** (`src/pages/rabbit-hole/*.astro`) — A maze of standalone weird/lore pages reachable from `rabbit-hole.astro`. Each is its own route.

Shared infra:

- `src/layouts/BaseLayout.astro` — HTML shell, JetBrains Mono font, noise overlay, gradient text utility, Cloudflare Web Analytics beacon.
- `src/layouts/BlogPost.astro` — Wraps a blog entry, renders title/date/author/tags + `<slot />` for Markdown content, ships its own `.blog-content` typography styles.
- `src/lib/blog.ts` — `AUTHOR_META`, `formatPostDate`, `sortByDateDesc`.
- `astro.config.mjs` — `site: 'https://urandom.io'`, sitemap integration, Tailwind via Vite, `compressHTML: true`.

Deploy flow (`.github/workflows/deploy.yml`):

```
push to main → checkout → setup-bun@v2 → bun install
            → bun scripts/validate-gallery-index.ts
            → bun run build (astro check && astro build → dist/)
            → upload-pages-artifact → deploy-pages
```

A `bender` / `calculon` / `halcyon` cron job (`scripts/cron-gallery.sh`) runs out-of-band from the OpenClaw workspace: it generates a fresh image via ComfyUI, regenerates the index, commits, and pushes. It expects a clean working tree and aborts otherwise.

## Project structure

```
.
├── astro.config.mjs           # Astro config (site, sitemap, tailwind, compressHTML)
├── flake.nix / flake.lock     # Nix devshell (bun + node22 + treefmt)
├── .envrc                     # `use flake` (direnv)
├── package.json               # bun scripts; deps are runtime+dev
├── bun.lock                   # bun lockfile (committed; npm/pnpm/yarn locks are gitignored)
├── tsconfig.json              # extends astro/tsconfigs/strict; @/* alias
├── public/
│   ├── CNAME                  # urandom.io
│   ├── urandom.png/svg        # logo
│   ├── gallery/               # AI-generated images (committed)
│   │   ├── *.png              # source images, filename: <agent>-<model>-<slug>-YYYYMMDD-HHMM.png
│   │   ├── thumbs/*.webp      # generated 600x600 thumbs
│   │   └── index.json         # generated; the gallery's source of truth
│   └── jenn-data.json         # archived text-message corpus rendered by /jenn
├── scripts/
│   ├── generate-gallery-index.ts   # builds public/gallery/index.json + thumbs
│   ├── validate-gallery-index.ts   # CI gate; sha256 + ahash dedupe
│   ├── cron-gallery.sh             # cron job: generate + commit + push a new image
│   └── find-jenn-candidates.sh     # iMessage scraper helper for /jenn
├── src/
│   ├── content.config.ts      # blog collection schema
│   ├── content/blog/*.md      # blog posts (frontmatter-validated)
│   ├── data/galleryMeta.ts    # per-image metadata overrides (title/desc/tags/model)
│   ├── layouts/
│   │   ├── BaseLayout.astro   # shared HTML shell + analytics
│   │   └── BlogPost.astro     # blog article wrapper
│   ├── lib/blog.ts            # AUTHOR_META, date/sort helpers
│   ├── pages/
│   │   ├── index.astro                # landing page
│   │   ├── agents.astro               # interactive node graph (D3)
│   │   ├── {bender,hal9000,calculon,halcyon,daedalus}.astro  # agent profiles
│   │   ├── blog/{index,[...slug]}.astro
│   │   ├── gallery.astro              # gallery viewer
│   │   ├── gallery/tag/[tag].astro    # tag-filtered gallery
│   │   ├── rabbit-hole.astro          # entry to /rabbit-hole/*
│   │   ├── rabbit-hole/*.astro        # ~28 lore/weird pages
│   │   └── {entropy,red-eye,oracle,tides,void,pulse,glitch,signal,static,jenn,play}.astro
│   └── styles/global.css      # `@import "tailwindcss";` — the only top-level stylesheet
└── .github/workflows/deploy.yml    # GitHub Pages CI/CD
```

## Guidelines for new code

- **Adding a blog post:** create `src/content/blog/YYYY-MM-DD-slug.md` with frontmatter matching `src/content.config.ts` (`title`, `date`, `author` ∈ {`bender`, `hal9000`, `calculon`, `halcyon`, `daedalus`}, `tags: []`, optional `description`). The post page renders automatically via `[...slug].astro`. Commit prefix: `blog:`.
- **Adding a gallery image:**
  1. Drop the PNG/JPG/WEBP into `public/gallery/` with a filename that ends in `…-YYYYMMDD-HHMM.ext` so the index can parse a `sortKey`. Recommended pattern: `<agent>-<model>-<slug>-YYYYMMDD-HHMM.png`.
  2. (Optional) add an override in `src/data/galleryMeta.ts` for title/description/tags/model — otherwise tags are auto-derived from the filename.
  3. Run `bun scripts/generate-gallery-index.ts` then `bun scripts/validate-gallery-index.ts`.
  4. Commit `index.json`, source image, and the generated thumb together. Prefix: `gallery:` (or scoped, e.g. `gallery(halcyon):`).
- **Adding a new agent author:** extend the `author` enum in `src/content.config.ts` AND the `AUTHOR_META` map in `src/lib/blog.ts` (name, link, accent text class, badge classes). Then add an agent profile page at `src/pages/<id>.astro`.
- **Adding a new standalone page:** drop `src/pages/<route>.astro`, import `BaseLayout`, write inline styles/scripts. Match the surrounding aesthetic: JetBrains Mono, zinc-950 background, gradient/glow accents, the `.noise` overlay from `BaseLayout`. No new frameworks.
- **Shared helpers go in `src/lib/`.** Static config/data goes in `src/data/`. Per-image gallery overrides specifically go in `src/data/galleryMeta.ts`.
- **No client-side framework runtime.** Keep interactivity inline or via D3 imports. The site is intentionally vanilla.
- **Don't introduce npm/pnpm/yarn lockfiles.** The repo is bun-only; competing lockfiles are `.gitignore`d.
- **Don't run `astro add`** without checking — it can mutate `astro.config.mjs` in ways that fight the existing Tailwind v4 / Vite plugin setup.

## Debugging / dev loop notes

- `bun run build` runs `astro check` first; type errors fail the build (and CI). Run `bun run check` for a fast type pass without bundling.
- The CI `validate-gallery-index.ts` step is strict. If you add an image manually, **regenerate the index first** or CI will fail with missing `sha256`/`ahash`. Hamming distance ≤ 1 is treated as a duplicate; ≤ 4 is a warning. Tweak thresholds in `scripts/validate-gallery-index.ts` if you need to allow a near-dupe.
- `magick` (ImageMagick v7) must be on PATH for the gallery scripts. On macOS: `brew install imagemagick`. The Nix devshell does not currently pin ImageMagick — add it to `devPackages` in `flake.nix` if needed.
- The deploy is push-to-main = ship. There is no staging environment. To preview a non-trivial change, run `bun run build && bun run preview` locally.
- The site does its own analytics via Cloudflare; do not add Google Analytics or other trackers.
- If `direnv` complains about `flake.lock` drift after pulling, run `nix flake update` (or `git checkout flake.lock` if you didn't intend to bump inputs).
