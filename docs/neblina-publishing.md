# Neblina: integration and publishing

## Architecture and scope

The site is static Astro 5 + Tailwind 4, Bun-managed, with no client framework runtime. `BaseLayout.astro` supplies JetBrains Mono, zinc background, noise texture, and the existing analytics. `/neblina` uses that shell, scoped CSS, mint accents, an editorial image/notes layout, and native `<details>` for generation records. No new client JavaScript, trackers, or dependencies were added. Home navigation links to the new route. Existing pages and content are preserved.

- `src/pages/neblina.astro`: profile and image study presentation.
- `src/data/neblina.ts`: three published image studies, typed publication records, and build-time validation/join against the gallery index. Pending entries have no invented title, prompt, image, or provenance and do not render as artworks.
- `src/data/galleryMeta.ts`: existing shared title/description/tags/model overrides keyed by image `src`.
- `public/gallery/index.json`: existing envelope `{ version, generatedAt, images: [...] }`; image entries contain `mediaType`, `src`, `thumb`, `title`, `description`, `tags`, `model`, `date`, `sortKey`, `sha256`, and `ahash`.
- `scripts/generate-gallery-index.ts`: reads source media, creates 600px square WebP thumbnails, calculates SHA-256 and perceptual aHash. Requires ImageMagick 7 (`magick`); existing video entries also require ffmpeg/ffprobe.
- `scripts/validate-gallery-index.ts`: CI gate for missing tags, duplicate sources/hashes, and near-duplicates. It does not prove provenance; generation records must be checked independently.

The blog author enum and agent infrastructure graph were deliberately not extended: this task adds a gallery/profile, not a fictional machine inventory or an empty blog author. A future Neblina blog requires extending both `src/content.config.ts` and `src/lib/blog.ts`.

## Integrate the three real images

The three originals were checked against their generation records and independently hashed before integration. Private generation logs and operational metadata are not published. Generation timestamps come from the recorded Mold library filename epochs, not local copy times.

1. Review the images and public-safe generation metadata. Do not publish raw logs, hostnames, private addresses, credentials, or personal/home details. Copy only the approved image assets to `public/gallery/` using the established pattern `neblina-<model>-<slug>-YYYYMMDD-HHMM.png` (actual generation date/time).
2. Add one `galleryMeta` entry per image with its exact `/gallery/<filename>` source, title, description, tags including `neblina` and `mold-cli`, and the actual model identifier. Do not rely on the generator's default model, which is `Flux Dev 1.0` regardless of how the image was generated.
3. Run `bun scripts/generate-gallery-index.ts` and inspect the resulting diff. This scans the whole gallery and may regenerate thumbnails based on mtimes; avoid unrelated binary churn. The current container did not initially have `magick` on PATH. Provision ImageMagick 7 plus ffmpeg before running the generator; do not silently substitute fabricated hashes or thumbnails.
4. Replace each pending object in `neblinaStudies` with a `status: 'published'` object. Required fields: `id`, `src`, accurate `alt`, exact generation `prompt`, and `provenance: { tool: 'Mold', model, generatedAt, sha256 }`. `generatedAt` is the genuine ISO timestamp; `seed` is optional and must only be included if recorded. Match `model` to the shared index. Calculate SHA-256 from the final image bytes and compare it to both the index and the recorded hash.
5. The page joins the shared index for title/description and refuses to build if a published record lacks the image, matching model/hash, a prompt, alt text, valid timestamp, or `neblina` tag. It rejects duplicate IDs/sources. Do not make incomplete records publishable by filling invented metadata.
6. The standard gallery automatically exposes a `/gallery/tag/neblina/` route after index regeneration. Review it as well as `/neblina/`.

## Verification

From the repository root:

```sh
bun install --frozen-lockfile
bun test tests/neblina.test.mjs
bun scripts/validate-gallery-index.ts
bunx eslint src/data/galleryMeta.ts src/data/neblina.ts src/pages/neblina.astro src/pages/index.astro tests/neblina.test.mjs
bun run build
bun run preview --host 0.0.0.0
```

Open `/neblina/` at desktop and mobile widths. Verify three real images load, full-image links work, prompts and provenance expand by keyboard, long hashes wrap, no horizontal overflow occurs, and the home navigation still reaches existing routes. Inspect `dist/neblina/index.html` for private data. Check source asset bytes against provenance SHA-256 independently.

Initial scaffold verification: five tests pass (the source-byte/thumbnail integration check has no published entries to inspect until the image worker delivers); production build succeeds (1180 pages, zero errors, three pre-existing Astro hints). Existing gallery validation succeeds (702 entries, five pre-existing similarity warnings). Targeted ESLint passes. Whole-repo `bun run lint` has an existing `prefer-rest-params` error in `BaseLayout.astro:27` and two existing `@ts-nocheck` warnings; those unrelated files were not changed. Empty state browser-checked at 1280px and 390px: no overflow, 44px navigation targets, no private text. Full image presentation still requires review after real assets arrive.

Design audit: no gradients, decorative stats, glass panels, feature tiles, or generic icon toppers added. Existing site typography retained intentionally. Image/notes rows, not feature cards, are the primary composition.

## Existing deployment mechanism

`.github/workflows/deploy.yml` deploys pushes to **main** and manual `workflow_dispatch` runs to **GitHub Pages**. Steps are checkout → setup Bun → install → gallery validation → `bun run build` → upload `dist` → deploy-pages. GitHub Pages API confirms workflow deployment, CNAME `urandom.io`, HTTPS enforced. No AWS write or AWS deployment is needed.

Prepared branch: `feat/neblina-gallery`. Integration is committed locally after verification; publishing remains a separate review and push.

After image integration, verification, and final diff review, the publishing agent can commit the exact approved source, tests, documentation, image, thumbnail and index paths, then merge to main and push. Do not use blanket staging if unrelated worker changes exist.

```sh
# Only after final approval/review and after committing the approved paths:
git switch main
git merge --ff-only feat/neblina-gallery
git push origin main
# Watch the new deploy run (obtain its ID from the list):
gh run list --repo urandomio/urandom.io --workflow deploy.yml --limit 3
gh run watch <run-id> --repo urandomio/urandom.io --exit-status
```

If origin/main advanced, fetch and reconcile changes before pushing; never force-push. Verify the new run's head SHA matches the intended commit. Finally read back the deployed `/neblina/`, home link, `/gallery/tag/neblina/`, and all three original/thumbnail URLs. A successful push is not proof of a successful publication.

## Completed integration verification

All three real PNGs retain their original bytes and embedded public-safe Mold metadata. Exact prompts, models, seeds, and SHA-256 values match the supplied records. Their titles come from the original generation records; descriptions and alt text describe the rendered images rather than promising literal prompt compliance. No raw command, private host, or filesystem path is included.

The generator produced three 600×600 WebP thumbnails and a 705-entry index. Existing index entry values and ordering were preserved after regeneration (filesystem-derived dates and ordering can otherwise churn). Five tests, targeted ESLint, gallery validation, production build (1186 pages), and whitespace checks pass. Five pre-existing similarity warnings remain. Final desktop/mobile visual approval is still required before publishing.
