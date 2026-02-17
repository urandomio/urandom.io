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

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]) {
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
