#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';

type IndexEntry = {
  src: string;
  thumb?: string;
  title?: string;
  tags?: string[];
  sha256?: string;
  ahash?: string;
};

type IndexFile = {
  images: IndexEntry[];
};

function fail(msg: string) {
  console.error(`ERROR: ${msg}`);
  process.exitCode = 1;
}

async function main() {
  const raw = await readFile('public/gallery/index.json', 'utf-8');
  const parsed = JSON.parse(raw) as IndexFile;
  const imgs = parsed.images ?? [];

  const seenSrc = new Set<string>();
  const dupSrc: string[] = [];

  const seenSha = new Map<string, string>();
  const dupSha: Array<{ sha: string; a: string; b: string }> = [];

  // aHash near-duplicate check
  const ahashes: Array<{ src: string; ahash: bigint }> = [];
  const AHASH_FAIL_THRESHOLD = 1; // extremely likely duplicate
  const AHASH_WARN_THRESHOLD = 4; // suspiciously similar

  for (const i of imgs) {
    if (!i.src) fail('index entry missing src');
    if (seenSrc.has(i.src)) dupSrc.push(i.src);
    seenSrc.add(i.src);

    const tags = i.tags ?? [];
    if (!tags.length) fail(`${i.src}: missing tags`);

    if (!i.sha256) fail(`${i.src}: missing sha256`);
    if (!i.ahash) fail(`${i.src}: missing ahash`);

    if (seenSha.has(i.sha256!)) {
      dupSha.push({ sha: i.sha256!, a: seenSha.get(i.sha256!)!, b: i.src });
    } else {
      seenSha.set(i.sha256!, i.src);
    }

    try {
      ahashes.push({ src: i.src, ahash: BigInt('0x' + i.ahash!) });
    } catch {
      fail(`${i.src}: invalid ahash '${i.ahash}'`);
    }
  }

  if (dupSrc.length) fail(`duplicate src entries: ${dupSrc.slice(0, 10).join(', ')}${dupSrc.length > 10 ? '…' : ''}`);
  if (dupSha.length) {
    const ex = dupSha[0];
    fail(`duplicate image content (sha256 match): ${ex.a} == ${ex.b}`);
  }

  // Hamming distance helper
  const popcount64 = (x: bigint) => {
    let n = x;
    let c = 0;
    while (n) {
      n &= n - 1n;
      c++;
    }
    return c;
  };

  // O(n^2) is fine for now (dozens/hundreds). If it grows big, we can bucket by prefix.
  let warned = 0;
  for (let a = 0; a < ahashes.length; a++) {
    for (let b = a + 1; b < ahashes.length; b++) {
      const d = popcount64(ahashes[a].ahash ^ ahashes[b].ahash);
      if (d <= AHASH_FAIL_THRESHOLD) {
        fail(`near-duplicate images (aHash distance ${d}): ${ahashes[a].src} ~ ${ahashes[b].src}`);
        break;
      }
      if (d <= AHASH_WARN_THRESHOLD) {
        warned++;
        // don't spam logs
        if (warned <= 5) console.warn(`WARN: similar images (aHash distance ${d}): ${ahashes[a].src} ~ ${ahashes[b].src}`);
      }
    }
    if (process.exitCode) break;
  }

  if (!process.exitCode) console.log(`✓ gallery index looks OK (${imgs.length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
