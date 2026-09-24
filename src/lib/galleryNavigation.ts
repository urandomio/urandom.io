type GalleryItem = { src: string; sortKey: string; mediaType?: string };

export function imageNeighbors(items: GalleryItem[], src: string) {
  const images = items
    .filter((item) => item.mediaType !== "video")
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const index = images.findIndex((item) => item.src === src);
  return {
    previous: index > 0 ? images[index - 1].src : null,
    next: index >= 0 ? (images[index + 1]?.src ?? null) : null,
  };
}
