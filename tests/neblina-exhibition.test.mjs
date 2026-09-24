import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("two stills, two edited clips and H3 motion resolve into published exhibition", async () => {
  const { exhibitionSlots, publishedExhibition } =
    await import("../src/data/neblinaExhibition.ts");
  assert.deepEqual(
    exhibitionSlots.map(({ id, kind }) => [id, kind]),
    [
      ["motion-03", "motion"],
      ["study-04", "still"],
      ["study-05", "still"],
      ["motion-01", "motion"],
      ["motion-02", "motion"],
    ],
  );
  assert.ok(exhibitionSlots.every((slot) => slot.status === "published"));
  const { stills, motions } = publishedExhibition(exhibitionSlots);
  assert.equal(stills.length, 2);
  assert.equal(motions.length, 3);
  const { neblinaStudies } = await import("../src/data/neblina.ts");
  assert.equal(neblinaStudies.length + stills.length, 5);
  for (const slot of [...stills, ...motions]) {
    const bytes = readFileSync(
      new URL(`../public${slot.src}`, import.meta.url),
    );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      slot.provenance.sha256,
    );
  }
  assert.ok(
    motions
      .filter((slot) => slot.id !== "motion-03")
      .every((slot) => /edited.*still/i.test(slot.description)),
  );
  assert.match(
    motions.find((slot) => slot.id === "motion-03").description,
    /first-frame-conditioned/,
  );
  const gallery = JSON.parse(
    readFileSync(
      new URL("../public/gallery/index.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(
    gallery.images.filter((entry) => entry.tags.includes("neblina")).length,
    8,
  );
  for (const slot of [...stills, ...motions]) {
    const entry = gallery.images.find((item) => item.src === slot.src);
    assert.ok(entry, `missing gallery entry for ${slot.id}`);
    assert.equal(entry.sha256, slot.provenance.sha256);
    assert.equal(entry.model, slot.provenance.model);
    assert.ok(entry.tags.includes("neblina"));
    assert.ok(
      readFileSync(new URL(`../public${entry.thumb}`, import.meta.url)).length >
        0,
    );
  }
});

test("field notes render without claiming unreleased work exists", () => {
  const page = readFileSync(
    new URL("../src/pages/neblina.astro", import.meta.url),
    "utf8",
  );
  assert.match(page, /id="field-notes"/);
  assert.match(page, /publishedExhibition\(exhibitionSlots\)/);
  assert.match(page, /motions\.length > 0/);
  assert.match(page, /<video/);
});
