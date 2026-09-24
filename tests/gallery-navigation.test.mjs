import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const index = JSON.parse(
  readFileSync(new URL("public/gallery/index.json", root)),
);

test("image neighbors follow newest-first gallery order and skip videos", async () => {
  const { imageNeighbors } = await import(
    new URL("src/lib/galleryNavigation.ts", root).href
  );
  const images = [...index.images]
    .filter((item) => item.mediaType !== "video")
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const first = imageNeighbors(index.images, images[0].src);
  assert.equal(first.previous, null);
  assert.equal(first.next, images[1].src);
  const last = imageNeighbors(index.images, images.at(-1).src);
  assert.equal(last.previous, images.at(-2).src);
  assert.equal(last.next, null);
  const middle = imageNeighbors(index.images, images[1].src);
  assert.equal(middle.previous, images[0].src);
  assert.equal(middle.next, images[2].src);
  assert.deepEqual(
    imageNeighbors(
      index.images,
      index.images.find((item) => item.mediaType === "video").src,
    ),
    { previous: null, next: null },
  );
});

test("detail page exposes canonical neighbor links and Escape exit fallback", () => {
  const page = readFileSync(
    new URL("src/pages/gallery/image/[slug].astro", root),
    "utf8",
  );
  assert.match(page, /imageNeighbors\(galleryIndex\.images, image\.src\)/);
  assert.match(page, /aria-label="Previous image"/);
  assert.match(page, /aria-label="Next image"/);
  assert.match(page, /event\.key === "ArrowLeft"/);
  assert.match(page, /event\.key === "ArrowRight"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /\/gallery/);
});
