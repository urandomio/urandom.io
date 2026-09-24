type GalleryItem = { src: string; sortKey: string; mediaType?: string };

export function mediaNeighbors(items: GalleryItem[], src: string) {
  const media = [...items].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const index = media.findIndex((item) => item.src === src);
  return {
    previous: index > 0 ? media[index - 1].src : null,
    next: index >= 0 ? (media[index + 1]?.src ?? null) : null,
  };
}
