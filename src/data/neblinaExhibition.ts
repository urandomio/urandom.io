export type ExhibitionSlot =
  | { id: string; kind: "still" | "motion"; status: "pending" }
  | {
      id: string;
      kind: "still" | "motion";
      status: "published";
      src: string;
      title: string;
      description: string;
      alt: string;
      provenance: {
        tool: string;
        model: string;
        generatedAt: string;
        sha256: string;
        prompt: string;
        seed?: number;
      };
    };

export const exhibitionSlots: ExhibitionSlot[] = [
  {
    id: "motion-03",
    kind: "motion",
    status: "published",
    src: "/gallery/neblina-minimax-h3-rain-garden-hummingbird-20260924-1650.mp4",
    title: "Rain Garden in Motion — MiniMax H3 first-frame animation",
    description:
      "A generated five-second motion study from the Rain Garden Hummingbird still, with rain and wing hum. Unlike the two edited motion loops, this is MiniMax H3 first-frame-conditioned video with generated audio.",
    alt: "A hummingbird hovers and moves beside violet irises as rain falls in a dark garden.",
    provenance: {
      tool: "Mold private nightly (first-frame-conditioned video)",
      model: "minimax-h3-fl2va:comfy-pruned-int8-turbo-4step-768p",
      generatedAt: "2026-09-24T16:50:14Z",
      sha256:
        "932f61830ce339ba4621965bfca4199ba9526177bed72cdcf8ac1a3c52abb2d1",
      seed: 83009,
      prompt:
        "For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.\n\nintegrated_multimodal_description: [Shot 1] The painterly, luminous violet-and-cyan rain garden in <Picture 1> retains its exact hummingbird, flower arrangement, colors, lighting, and square composition. Static Shot. The hummingbird hovers beside the bloom, beating its wings rapidly with a delicate translucent blur, dipping its beak toward the flower and rising slightly again. Fine rain falls and catches the light; droplets slide from petals while nearby blossoms sway gently. Keep the bird recognizable and in frame throughout one continuous five-second shot; no cuts, no camera movement, no text.\noverall_soundscape: Soft steady garden rain, faint wing hum and occasional droplets pattering on leaves. No speech.\nnon_diegetic_music: N/A",
    },
  },
  {
    id: "study-04",
    kind: "still",
    status: "published",
    src: "/gallery/neblina-flux-dev-q8-rain-garden-hummingbird-20260924-1629.png",
    title: "Neblina — Rain Garden Hummingbird",
    description:
      "A hummingbird among violet blooms, lit by cool blue rain against a dark garden.",
    alt: "A hummingbird hovers beside luminous violet flowers in a dark, rain-streaked garden.",
    provenance: {
      tool: "Mold",
      model: "flux-dev:q8",
      generatedAt: "2026-09-24T16:29:10Z",
      sha256:
        "f0819796b76aae4102b51aa95e29b7cf77c3ed019b12002f619225ba720ed732",
      seed: 44219071,
      prompt:
        "A single hummingbird hovering among translucent irises in a rain-swept night garden, wings sharply articulated against falling rain. Violet petals and cyan bioluminescent veins glow in dark foliage; wet stone reflects scattered light. Intimate cinematic botanical photograph, deep indigo shadows, luminous droplets, elegant negative space and layered depth.",
    },
  },
  {
    id: "study-05",
    kind: "still",
    status: "published",
    src: "/gallery/neblina-flux-dev-q8-wind-atlas-20260924-1629.png",
    title: "Neblina — Wind Atlas",
    description:
      "Turquoise and coral currents sweep across a dark field, with fine particles tracing eddies.",
    alt: "Abstract turquoise and coral ribbons and scattered particles curve diagonally across a dark field.",
    provenance: {
      tool: "Mold",
      model: "flux-dev:q8",
      generatedAt: "2026-09-24T16:29:50Z",
      sha256:
        "253c41c74b81e14539da6209b58c5aa73bfd7a27329cfa8b877f3d98ffbda62d",
      seed: 44219072,
      prompt:
        "An abstract atlas of wind currents made from drifting bioluminescent flower petals, luminous turquoise and pale coral ribbons sweeping diagonally across an ink-dark field. Fine stippled particles trace looping pressure lines and eddies, like a scientific map becoming a living garden. Airy layered composition, delicate paper and glass textures, restrained nocturnal palette, crisp flowing geometry.",
    },
  },
  {
    id: "motion-01",
    kind: "motion",
    status: "published",
    src: "/gallery/neblina-cloud-forest-edited-motion.mp4",
    title: "Cloud Forest — Edited Motion",
    description:
      "An edited motion treatment of the earlier Cloud Forest still, not native AI video: a gentle cyclic zoom, slight drift and luminance pulse across the hummingbird and flowers.",
    alt: "The cloud-forest hummingbird and orange flowers slowly enlarge, drift slightly, and brighten and dim together; the still scene does not independently animate.",
    provenance: {
      tool: "CPU edit (Pillow and FFmpeg) of Mold still",
      model: "flux-dev:q8 (source still; no video model)",
      generatedAt: "2026-09-23T20:44:18.134Z",
      sha256:
        "5f02e006a10f27bf5c210f6582d9f1acbfd3490a432cd8118f0d9eb8d166a641",
      prompt:
        "Source still: Neblina — Cloud Forest. Edited motion: 16:9 center crop, cyclic 1.8–3% zoom, slight sinusoidal drift and luminance pulse at 24 fps; no native video generation.",
    },
  },
  {
    id: "motion-02",
    kind: "motion",
    status: "published",
    src: "/gallery/neblina-desert-monsoon-edited-motion.mp4",
    title: "Desert Monsoon — Edited Motion",
    description:
      "An edited motion treatment of the earlier Desert Monsoon still, not native AI video: a gentle cyclic zoom, slight drift and luminance pulse over the storm landscape.",
    alt: "The desert storm and saguaro slowly enlarge, drift slightly, and brighten and dim together; the still landscape does not independently animate.",
    provenance: {
      tool: "CPU edit (Pillow and FFmpeg) of Mold still",
      model: "flux-dev:q8 (source still; no video model)",
      generatedAt: "2026-09-23T20:44:55.908Z",
      sha256:
        "9a9aede8ab46ce397637af4745cb3684130a8d1e0e40ec9abe21c23c85192ac9",
      prompt:
        "Source still: Neblina — Desert Monsoon. Edited motion: 16:9 center crop, cyclic 1.8–3% zoom, slight sinusoidal drift and luminance pulse at 24 fps; no native video generation.",
    },
  },
];

export function publishedExhibition(slots: ExhibitionSlot[]) {
  const ids = new Set<string>();
  const sources = new Set<string>();
  const stills: Extract<ExhibitionSlot, { status: "published" }>[] = [];
  const motions: Extract<ExhibitionSlot, { status: "published" }>[] = [];
  for (const slot of slots) {
    if (ids.has(slot.id))
      throw new Error(`Neblina: duplicate exhibition ID ${slot.id}`);
    ids.add(slot.id);
    if (slot.status === "pending") continue;
    const { src, title, description, alt, provenance: record } = slot;
    const extension = slot.kind === "motion" ? "mp4" : "png|jpe?g|webp";
    if (
      !new RegExp(`^/gallery/[^/]+\\.(${extension})$`, "i").test(src) ||
      sources.has(src) ||
      !title.trim() ||
      !description.trim() ||
      !alt.trim() ||
      !record.tool.trim() ||
      !record.model.trim() ||
      !record.prompt.trim() ||
      !/^\d{4}-\d{2}-\d{2}T/.test(record.generatedAt) ||
      !Number.isFinite(Date.parse(record.generatedAt)) ||
      !/^[a-f0-9]{64}$/.test(record.sha256)
    )
      throw new Error(`Neblina: incomplete exhibition record ${slot.id}`);
    sources.add(src);
    (slot.kind === "still" ? stills : motions).push(slot);
  }
  return { stills, motions };
}
