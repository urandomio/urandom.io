import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../", import.meta.url);

test("H3 motion publishes the verified source, original prompt and correct model separately from edited loops", () => {
  const src = new URL(
    "public/gallery/neblina-minimax-h3-rain-garden-hummingbird-20260924-1650.mp4",
    root,
  );
  assert.ok(existsSync(src));
  assert.equal(
    createHash("sha256").update(readFileSync(src)).digest("hex"),
    "932f61830ce339ba4621965bfca4199ba9526177bed72cdcf8ac1a3c52abb2d1",
  );
  const index = JSON.parse(
    readFileSync(new URL("public/gallery/index.json", root)),
  );
  const entry = index.images.find(
    (item) =>
      item.src ===
      "/gallery/neblina-minimax-h3-rain-garden-hummingbird-20260924-1650.mp4",
  );
  assert.equal(entry?.mediaType, "video");
  assert.match(entry?.model ?? "", /minimax-h3/i);
  const exhibition = readFileSync(
    new URL("src/data/neblinaExhibition.ts", root),
    "utf8",
  );
  assert.match(exhibition, /first-frame animation/);
  assert.match(exhibition, /integrated_multimodal_description/);
  assert.match(exhibition, /motion-03/);
  assert.match(exhibition, /Edited Motion/);
});
