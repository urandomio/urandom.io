#!/usr/bin/env bun

import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { galleryMetaBySrc } from '../src/data/galleryMeta';

type IndexEntry = {
  src: string;
  thumb: string;
  title: string;
  description: string;
  tags: string[];
  model: string;
  date: string; // YYYY-MM-DD
  sortKey: string; // YYYYMMDDHHMM
};

const ROOT = new URL('../', import.meta.url); // repo root
const PUBLIC_GALLERY = new URL('./public/gallery/', ROOT);

function humanizeFilename(file: string) {
  return file
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/\d{8}-\d{4}/g, '')
    .replace(/\d{8}/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractDateTimeFromFilename(filename: string): { date: string; sortKey: string } | null {
  const withTime = filename.match(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})/);
  if (withTime) {
    const [, y, m, d, hh, mm] = withTime;
    return { date: `${y}-${m}-${d}`, sortKey: `${y}${m}${d}${hh}${mm}` };
  }
  const dateOnly = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return { date: `${y}-${m}-${d}`, sortKey: `${y}${m}${d}0000` };
  }
  return null;
}

function deriveTagsFromFilename(filename: string): string[] {
  const f = filename.toLowerCase();
  const tags = new Set<string>();

  // baseline
  tags.add('ai-art');

  // slugs / themes
  if (f.includes('tiltshift') || f.includes('tilt-shift')) {
    tags.add('tilt-shift');
    tags.add('miniature');
    tags.add('horror');
  }

  if (f.includes('hydrophobia') || f.includes('thalassophobia') || f.includes('flood') || f.includes('submerged') || f.includes('pool') || f.includes('water')) {
    tags.add('hydrophobia');
  }

  if (f.includes('backrooms')) tags.add('backrooms');
  if (f.includes('liminal')) tags.add('liminal');
  if (f.includes('dead-internet')) tags.add('dead-internet');
  if (f.includes('numbers-station')) tags.add('numbers-station');

  if (f.includes('server') || f.includes('datacenter')) tags.add('servers');
  if (f.includes('arcade') || f.includes('crt') || f.includes('static') || f.includes('dead-channel') || f.includes('the-static')) tags.add('analog');
  if (f.includes('neon') || f.includes('vice')) tags.add('neon');

  // places
  if (f.includes('mall') || f.includes('escalator')) tags.add('mall');
  if (f.includes('subway')) tags.add('subway');
  if (f.includes('casino')) tags.add('casino');
  if (f.includes('library')) tags.add('library');
  if (f.includes('observatory') || f.includes('telescope')) tags.add('cosmic');

  // always try to ensure at least 2 tags total
  if (tags.size <= 1) tags.add('liminal');

  return Array.from(tags);
}

async function run(cmd: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function ensureThumb(inputPath: string, outputPath: string) {
  // Create square 600px webp thumbs
  // -auto-orient fixes weird rotations
  const args = [
    inputPath,
    '-auto-orient',
    '-resize',
    '600x600^',
    '-gravity',
    'center',
    '-extent',
    '600x600',
    '-quality',
    '82',
    outputPath,
  ];
  await run('magick', args);
}

async function main() {
  const thumbsDirFs = path.join(PUBLIC_GALLERY.pathname, 'thumbs');
  await mkdir(thumbsDirFs, { recursive: true });

  const entries = await readdir(PUBLIC_GALLERY, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => /\.(png|jpg|jpeg|webp|gif)$/i.test(name))
    .filter((name) => !name.startsWith('index.'))
    .filter((name) => !name.startsWith('.'))
    .filter((name) => !name.toLowerCase().includes('thumb'));

  const index: IndexEntry[] = [];

  for (const file of files) {
    const src = `/gallery/${file}`;
    const meta = galleryMetaBySrc.get(src);

    const dt = extractDateTimeFromFilename(file);
    const fullPath = path.join(PUBLIC_GALLERY.pathname, file);
    const st = await stat(fullPath);
    const date = dt?.date ?? new Date(st.mtimeMs).toISOString().slice(0, 10);
    const sortKey = dt?.sortKey ?? '197001010000';

    const base = file.replace(/\.[^.]+$/, '');
    const thumbFile = `${base}.webp`;
    const thumbFs = path.join(thumbsDirFs, thumbFile);
    const thumb = `/gallery/thumbs/${thumbFile}`;

    // generate/update thumb if needed
    let doThumb = false;
    try {
      const tstat = await stat(thumbFs);
      if (tstat.mtimeMs < st.mtimeMs) doThumb = true;
    } catch {
      doThumb = true;
    }
    if (doThumb) {
      await ensureThumb(fullPath, thumbFs);
    }

    const tags = (meta?.tags && meta.tags.length ? meta.tags : deriveTagsFromFilename(file)).slice();

    index.push({
      src,
      thumb,
      title: meta?.title ?? humanizeFilename(file),
      description: meta?.description ?? '',
      tags,
      model: meta?.model ?? 'Flux Dev 1.0',
      date,
      sortKey,
    });
  }

  index.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const outPath = path.join(PUBLIC_GALLERY.pathname, 'index.json');
  await writeFile(outPath, JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), images: index }, null, 2));

  console.log(`✓ Wrote ${outPath} (${index.length} images)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
