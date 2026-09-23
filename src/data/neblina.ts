export type NeblinaStudy =
  | { id: string; status: "pending" }
  | {
      id: string;
      status: "published";
      src: string;
      alt: string;
      prompt: string;
      provenance: {
        tool: "Mold";
        model: string;
        generatedAt: string;
        seed?: string;
        sha256: string;
      };
    };

export type GalleryImage = {
  src: string;
  thumb: string;
  title: string;
  description: string;
  tags: string[];
  model: string;
  sha256: string;
  mediaType?: string;
};

// Generation timestamps are the recorded Mold library filename epochs.
// Exact prompts, seeds, models and source-byte hashes retain the generation records.
export const neblinaStudies: NeblinaStudy[] = [
  {
    "id": "study-01",
    "status": "published",
    "src": "/gallery/neblina-flux-dev-q8-cloud-forest-20260923-2044.png",
    "alt": "A green hummingbird with a white throat hovers beside orange flowers against a soft dark-green background.",
    "prompt": "A single violet-crowned hummingbird hovers beside a curved spray of tiny cloud-forest orchids. Its emerald and petrol-blue feathers catch a fine rim of copper light, with anatomically delicate wings suspended in motion. Dew beads cling to translucent petals and fern fronds below. Layers of dark tropical foliage dissolve into luminous silver mist behind the bird. Compose the bird slightly left of center with graceful breathing room around its silhouette, an intimate horizontal natural-history portrait. Rich obsidian shadows, restrained iridescence, teal and amethyst accents, exceptionally fine feather and water detail. Museum-quality photographic naturalism with the quiet precision of a botanical plate, soft volumetric dawn light, elegant and mysterious.",
    "provenance": {
      "tool": "Mold",
      "model": "flux-dev:q8",
      "generatedAt": "2026-09-23T20:44:18.134Z",
      "seed": "730921",
      "sha256": "25315768971d14f3287d147e00efc7c680c0a78275d2fc38412fea9cceb7223b"
    }
  },
  {
    "id": "study-02",
    "status": "published",
    "src": "/gallery/neblina-flux-dev-q8-desert-monsoon-20260923-2044.png",
    "alt": "Violet lightning lights storm clouds behind desert mountains, a tall saguaro, and an oval pool reflecting the sky.",
    "prompt": "A summer monsoon unfolds above the Sonoran desert at night. One branching violet-white lightning bolt illuminates monumental indigo storm clouds behind distant mountains. A sculptural saguaro stands on the right, with dark ocotillo silhouettes and wet volcanic stones in the foreground. A shallow rain pool reflects the electric sky in broken silver and muted turquoise ripples. A low amber glow grazes the far horizon under the storm. Wide cinematic composition with enormous depth, the storm occupying two thirds of the image, nuanced blue-black shadows and believable rain curtains. Fine-art landscape photography, luminous yet restrained color, tactile rain-darkened earth, dramatic atmospheric naturalism.",
    "provenance": {
      "tool": "Mold",
      "model": "flux-dev:q8",
      "generatedAt": "2026-09-23T20:44:55.908Z",
      "seed": "730922",
      "sha256": "6d21016f20d1a8f07a3e828a9b50a828c71b95c0debfccd054fbc68c517d9a06"
    }
  },
  {
    "id": "study-03",
    "status": "published",
    "src": "/gallery/neblina-flux-dev-q8-living-circuit-20260923-2045.png",
    "alt": "A pale orchid rises above green fern fronds in a shallow glass bowl against a dark studio background.",
    "prompt": "A translucent orchid and unfurling fern form a living botanical instrument against a deep charcoal background. Slender copper filaments trace the natural leaf veins, terminating in tiny luminous dew droplets like sensors, organically integrated rather than a machine. One delicate root system arcs beneath the flower, its pale fibers visible through a smoky glass specimen vessel. The orchid petals glow with restrained opalescent cyan, jade and violet, edged with warm silver light. Asymmetric still-life composition with generous negative space, finely resolved venation, elegant branching geometry and physically convincing glass. A contemporary natural-history study merging botanical precision with subtle technical craftsmanship, dramatic soft studio lighting, rich blacks and luminous microdetail.",
    "provenance": {
      "tool": "Mold",
      "model": "flux-dev:q8",
      "generatedAt": "2026-09-23T20:45:33.327Z",
      "seed": "730923",
      "sha256": "75008fdf9a535b0b972e78dcad34fb93901552bf9bb937a4b34dded583f72605"
    }
  }
];

export function publishedStudies(
  studies: NeblinaStudy[],
  gallery: GalleryImage[],
) {
  const ids = new Set<string>();
  const sources = new Set<string>();
  return studies.flatMap((study) => {
    if (ids.has(study.id))
      throw new Error(`Neblina: duplicate study ${study.id}`);
    ids.add(study.id);
    if (study.status === "pending") return [];
    if (sources.has(study.src))
      throw new Error(`Neblina: duplicate source ${study.src}`);
    sources.add(study.src);
    const image = gallery.find((entry) => entry.src === study.src);
    if (!image) throw new Error(`Neblina: missing gallery image ${study.src}`);
    const record = study.provenance;
    if (
      !study.prompt.trim() ||
      !study.alt.trim() ||
      !image.title.trim() ||
      !image.tags.includes("neblina") ||
      image.mediaType === "video" ||
      record.tool !== "Mold" ||
      !record.model.trim() ||
      record.model !== image.model ||
      !/^\d{4}-\d{2}-\d{2}T/.test(record.generatedAt) ||
      !Number.isFinite(Date.parse(record.generatedAt)) ||
      !/^[a-f0-9]{64}$/.test(record.sha256) ||
      record.sha256 !== image.sha256
    )
      throw new Error(`Neblina: invalid provenance for ${study.id}`);
    return [{ ...image, ...study }];
  });
}
