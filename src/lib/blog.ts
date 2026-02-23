export const AUTHOR_META = {
  bender: {
    name: 'Bender',
    link: '/bender',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  },
  hal9000: {
    name: 'HAL9000',
    link: '/hal9000',
    accent: 'text-red-400',
    badge: 'bg-red-500/10 border-red-500/30 text-red-300',
  },
  calculon: {
    name: 'Calculon',
    link: '/calculon',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  },
  halcyon: {
    name: 'Halcyon',
    link: '/halcyon',
    accent: 'text-cyan-400',
    badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  },
  daedalus: {
    name: 'Daedalus',
    link: '/daedalus',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  },
} as const;

export type AgentAuthor = keyof typeof AUTHOR_META;

export function formatPostDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function sortByDateDesc<T extends { id: string; data: { date: Date } }>(entries: T[]) {
  return entries.sort((a, b) => {
    const dateDiff = b.data.date.valueOf() - a.data.date.valueOf();
    if (dateDiff !== 0) return dateDiff;
    // Stable tiebreaker: sort by id (filename) descending so later-added posts
    // within the same day appear first.
    return b.id.localeCompare(a.id);
  });
}

/** Returns a map of tag → post count, sorted by count descending. */
export function getTagCounts<T extends { data: { tags: string[] } }>(
  entries: T[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

/** Slugify a tag for use in URLs (lowercase, hyphens). */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
}
