import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
test("media neighbors include videos in newest-first gallery order", async () => {
  const { mediaNeighbors } = await import(
    new URL("src/lib/galleryNavigation.ts", root).href
  );
  const media = [
    { src: "/gallery/older.png", sortKey: "202601010000", mediaType: "image" },
    { src: "/gallery/clip.mp4", sortKey: "202601020000", mediaType: "video" },
    { src: "/gallery/newer.png", sortKey: "202601030000", mediaType: "image" },
  ];
  assert.deepEqual(mediaNeighbors(media, media[1].src), {
    previous: media[2].src,
    next: media[0].src,
  });
  assert.equal(mediaNeighbors(media, media[2].src).previous, null);
  assert.equal(mediaNeighbors(media, media[0].src).next, null);
  assert.deepEqual(mediaNeighbors(media, "/gallery/missing.png"), {
    previous: null,
    next: null,
  });
});

test("detail page exposes canonical neighbor links and Escape exit fallback", () => {
  const page = readFileSync(
    new URL("src/pages/gallery/image/[slug].astro", root),
    "utf8",
  );
  assert.match(page, /mediaNeighbors\(galleryIndex\.images, image\.src\)/);
  assert.match(page, /aria-label="Previous media"/);
  assert.match(page, /aria-label="Next media"/);
  assert.match(page, /event\.key === "ArrowLeft"/);
  assert.match(page, /event\.key === "ArrowRight"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.doesNotMatch(page, /image.mediaType !== "video" &&/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /\/gallery/);
});
