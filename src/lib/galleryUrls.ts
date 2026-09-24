// Filename-based routes remain stable when titles or index ordering change.
export function galleryDetailPath(src: string): string {
  const match =
    /^\/gallery\/([a-z0-9][a-z0-9._-]*)\.(?:png|jpe?g|webp|gif|mp4|webm|mov)$/i.exec(
      src,
    );
  if (!match) throw new Error(`Invalid gallery source: ${src}`);
  return `/gallery/image/${match[1].toLowerCase()}/`;
}
