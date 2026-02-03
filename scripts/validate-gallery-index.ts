#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';

type IndexEntry = {
  src: string;
  thumb?: string;
  title?: string;
  tags?: string[];
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

  const seen = new Set<string>();
  const dups: string[] = [];

  for (const i of imgs) {
    if (!i.src) fail('index entry missing src');
    if (seen.has(i.src)) dups.push(i.src);
    seen.add(i.src);

    const tags = i.tags ?? [];
    if (!tags.length) fail(`${i.src}: missing tags`);
    if (tags.length === 1 && tags[0] === 'ai-art') {
      // warning, not hard fail
      console.warn(`WARN: ${i.src}: only has tag ai-art`);
    }
  }

  if (dups.length) fail(`duplicate src entries: ${dups.slice(0, 10).join(', ')}${dups.length > 10 ? '…' : ''}`);

  if (!process.exitCode) console.log(`✓ gallery index looks OK (${imgs.length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
