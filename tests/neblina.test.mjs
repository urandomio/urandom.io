import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const dataUrl = new URL("../src/data/neblina.ts", import.meta.url);

test("three unique study slots support an honest unpublished state", async () => {
  assert.ok(existsSync(dataUrl), "missing Neblina collection schema");
  const { neblinaStudies, publishedStudies } = await import(dataUrl.href);
  assert.equal(neblinaStudies.length, 3);
  assert.equal(new Set(neblinaStudies.map((study) => study.id)).size, 3);
  const pending = neblinaStudies.map(({ id }) => ({ id, status: "pending" }));
  assert.deepEqual(publishedStudies(pending, []), []);
});

// Synthetic unit-test fixture only; never shipped as gallery data or provenance.
const image = {
  src: "/gallery/test.png",
  thumb: "/gallery/thumbs/test.webp",
  title: "Test",
  description: "Test fixture",
  tags: ["neblina"],
  model: "test-model",
  sha256: "a".repeat(64),
  mediaType: "image",
};
const study = {
  id: "test",
  status: "published",
  src: image.src,
  alt: "Test fixture",
  prompt: "Test prompt",
  provenance: {
    tool: "Mold",
    model: image.model,
    generatedAt: "2026-09-23T00:00:00Z",
    sha256: image.sha256,
  },
};

test("published studies require matching, complete provenance", async () => {
  const { publishedStudies } = await import(dataUrl.href);
  assert.equal(publishedStudies([study], [image])[0].title, "Test");
  assert.throws(() => publishedStudies([study], []), /missing gallery image/);
  for (const invalid of [
    { ...study, prompt: "" },
    { ...study, alt: "" },
    { ...study, provenance: { ...study.provenance, sha256: "b".repeat(64) } },
    { ...study, provenance: { ...study.provenance, model: "different-model" } },
    {
      ...study,
      provenance: { ...study.provenance, generatedAt: "not a date" },
    },
  ])
    assert.throws(
      () => publishedStudies([invalid], [image]),
      /invalid provenance/,
    );
  assert.throws(
    () => publishedStudies([study], [{ ...image, tags: [] }]),
    /invalid provenance/,
  );
  assert.throws(() => publishedStudies([study, study], [image]), /duplicate/);
});

test("published gallery markup exposes prompts and provenance, with a home entry point", () => {
  const page = readFileSync(
    new URL("../src/pages/neblina.astro", import.meta.url),
    "utf8",
  );
  assert.match(page, /publishedStudies\(neblinaStudies, gallery\)/);
  assert.match(page, /study\.prompt/);
  assert.match(page, /study\.provenance\.sha256/);
  assert.match(page, /<details/);
  const home = readFileSync(
    new URL("../src/pages/index.astro", import.meta.url),
    "utf8",
  );
  assert.match(home, /href="\/neblina"/);
});

test("every published study matches real source bytes and has a thumbnail", async () => {
  const { neblinaStudies, publishedStudies } = await import(dataUrl.href);
  const gallery = JSON.parse(
    readFileSync(
      new URL("../public/gallery/index.json", import.meta.url),
      "utf8",
    ),
  );
  const published = publishedStudies(neblinaStudies, gallery.images);
  assert.equal(published.length, 3, "all three real studies must be published");
  for (const entry of published) {
    assert.match(entry.src, /^\/gallery\/[^/]+\.(png|jpe?g|webp)$/i);
    assert.match(entry.thumb, /^\/gallery\/thumbs\/[^/]+\.webp$/i);
    const source = new URL("../public" + entry.src, import.meta.url);
    const thumb = new URL("../public" + entry.thumb, import.meta.url);
    assert.ok(existsSync(thumb), `missing thumbnail: ${entry.thumb}`);
    assert.equal(
      createHash("sha256").update(readFileSync(source)).digest("hex"),
      entry.provenance.sha256,
    );
  }
});

test("Neblina has a dedicated static route", () => {
  assert.ok(
    existsSync(new URL("../src/pages/neblina.astro", import.meta.url)),
    "missing /neblina route",
  );
});
