import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const index = JSON.parse(
  readFileSync(new URL("public/gallery/index.json", root)),
);

test("every indexed media item has a unique stable detail URL", async () => {
  const { galleryDetailPath } = await import(
    new URL("src/lib/galleryUrls.ts", root).href
  );
  const paths = index.images.map((image) => galleryDetailPath(image.src));
  assert.equal(new Set(paths).size, index.images.length);
  assert.ok(
    paths.every((path) => /^\/gallery\/image\/[a-z0-9._-]+\/$/.test(path)),
  );
  assert.equal(
    galleryDetailPath(
      "/gallery/neblina-flux-dev-q8-wind-atlas-20260924-1629.png",
    ),
    "/gallery/image/neblina-flux-dev-q8-wind-atlas-20260924-1629/",
  );
});

test("gallery feed and Neblina studies link to detail pages", () => {
  const gallery = readFileSync(
    new URL("src/pages/gallery.astro", root),
    "utf8",
  );
  const neblina = readFileSync(
    new URL("src/pages/neblina.astro", root),
    "utf8",
  );
  assert.match(gallery, /href=\{galleryDetailPath\(image\.src\)\}/);
  assert.match(gallery, /galleryDetailPath\(img\.src\)/);
  assert.match(neblina, /galleryDetailPath\(study\.src\)/);
  assert.match(neblina, /galleryDetailPath\(still\.src\)/);
  assert.ok(existsSync(new URL("src/pages/gallery/image/[slug].astro", root)));
});
