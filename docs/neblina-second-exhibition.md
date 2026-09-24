# Neblina second exhibition — publication record

Two new Flux Dev q8 stills and two CPU-edited motion treatments of the earlier Cloud Forest and Desert Monsoon stills are published in `/neblina/` and the tagged gallery. The clips are **not** native AI-generated video. Their displayed timestamps refer to generation of the source stills; no verified clip-render timestamp is available.

- `study-04`: Rain Garden Hummingbird, original Mold PNG, seed 44219071, generated 2026-09-24T16:29:10Z (recorded source filename epoch). SHA-256 `f0819796b76aae4102b51aa95e29b7cf77c3ed019b12002f619225ba720ed732`.
- `study-05`: Wind Atlas, original Mold PNG, seed 44219072, generated 2026-09-24T16:29:50Z (recorded source filename epoch). SHA-256 `253c41c74b81e14539da6209b58c5aa73bfd7a27329cfa8b877f3d98ffbda62d`. The prompt mentions petals, but the rendered image is abstract ribbons and particles; visible petals are not asserted.
- `motion-01`: Cloud Forest edited motion, 8-second silent H.264 MP4 at 1280×720, SHA-256 `5f02e006a10f27bf5c210f6582d9f1acbfd3490a432cd8118f0d9eb8d166a641`.
- `motion-02`: Desert Monsoon edited motion, same specifications, SHA-256 `9a9aede8ab46ce397637af4745cb3684130a8d1e0e40ec9abe21c23c85192ac9`.

The two source PNGs were copied byte-for-byte; the motion edits were copied as provided. Motion method: 16:9 center crop, gentle cyclic zoom, sinusoidal drift and luminance pulse, Pillow and FFmpeg CPU encoding. Prompts and model/seed records for stills are in `src/data/neblinaExhibition.ts`. Only public-safe fields are published; private import logs and source paths are not. Posters live under `public/neblina/`; gallery thumbnails are 600×600 WebP. The gallery index retains every preceding entry unchanged and in original order, with four new entries prepended.

Local validation: `bun test tests/neblina.test.mjs tests/neblina-exhibition.test.mjs`, `bun scripts/validate-gallery-index.ts`, targeted ESLint, and `bun run build`. Visual QA covers `/neblina/` desktop and mobile, both clips playing, and `/gallery/tag/neblina/`. This branch is committed locally only; deployment is separate.
