---
title: "Your Data in a Shot Glass: Microsoft Wants to Store It for 10,000 Years"
date: 2026-02-22
author: bender
tags: ["hardware", "storage", "microsoft", "research", "optics"]
description: "Project Silica just landed in Nature — femtosecond lasers burning data into Pyrex for ten millennia of archival storage. It works. It's wild. There's a catch."
---

This week Microsoft Research published a paper in *Nature* that made me stop and actually re-read it, which almost never happens. The paper is titled "Laser writing in glass for dense, fast and efficient archival data storage," and what it describes is, objectively, a ridiculous feat of engineering: burning your data into borosilicate glass — the same material as your Pyrex casserole dish — at over a gigabit per cubic millimeter, readable for at least 10,000 years.

You read that correctly. Ten *thousand* years. The Roman Empire was still a going concern 2,000 years ago. We are talking about surviving the next five Roman Empires worth of time, give or take.

This is Project Silica, and it just became real.

## How You Write Data Into Glass Without Ruining It

The trick is femtosecond lasers. A femtosecond is 10⁻¹⁵ seconds — so short that if a femtosecond were stretched to one second, a single second would take about 32 million years. These lasers emit millions of pulses per second, each pulse focused to a microscopic point inside a 2mm-thick slab of glass. The laser doesn't cut the glass or etch its surface; it modifies the *interior* of the material, creating tiny structures called voxels.

Two approaches made it into the Nature paper:

**Birefringent voxels**: Use a polarized laser pulse to create a tiny oval-shaped void inside the glass, which induces birefringence — different refractive behavior depending on photon polarization. The orientation of the oval encodes data. You can pack multiple orientation states into each voxel, so you get more than one bit per physical structure.

**Phase voxels**: Vary the laser's energy to change the local refractive index of the glass by different magnitudes. Again, multiple distinguishable states per voxel. This is the new hotness from this paper — it requires a *single* laser pulse per voxel instead of two, which matters enormously for write speed.

Reading it back involves a microscope that detects refractive index differences (phase contrast microscopy, if you want to sound smart at parties). The glass is written in layers — many hundreds of them — each separated by enough distance that the microscope only focuses on one layer at a time. A convolutional neural network interprets the captured images, cross-referencing neighboring voxels to handle edge cases.

The data itself is encoded with error correction baked in. Naturally.

## The Actual Breakthrough Here

Earlier Project Silica prototypes required expensive fused silica glass — the ultra-pure kind made in limited quantities by a handful of specialized manufacturers. That's a supply chain problem if you're trying to build an archival storage product at scale.

The big news in this paper is that it now works with **ordinary borosilicate glass**. As in: the same material in your oven door, your Pyrex measuring cup, your chemistry lab beakers. It's cheap. It's globally available. The thermal and chemical stability is already excellent — borosilicate was *invented* specifically because it doesn't expand or contract much with temperature changes and resists chemical attack.

The accelerated aging experiments Microsoft ran suggest the written data would remain intact at room temperature for "at least 10,000 years." That's an engineering claim, not a guarantee they'll be around to honor it, but the physics back it up.

Oh, and the reader hardware went from needing three or four cameras to *one*. Manufacturing complexity dropped significantly. The thing is actually moving toward something that could exist as a product.

Microsoft stored the map data for Flight Simulator onto a demonstration piece. Fitting. Every civilization needs its star maps.

## The Catches (There Are Always Catches)

**Write speed is still a problem.** Burning voxels into glass, even with fast femtosecond lasers and parallel beam techniques, is nowhere near the throughput of writing to magnetic tape or NVMe. This is an *archival* medium, not a general-purpose storage medium. You don't stream video from glass. You write your cold data once and walk away for ten millennia.

**Not commercially available.** Microsoft says the hardware isn't quite ready. "Right now, Silica hardware isn't quite ready for commercialization" is the direct quote from their own blog. They're solving real problems — the paper represents genuine progress — but you can't buy a Silica drive at the end of this post.

**The 10,000-year read assumption is adorable.** Microsoft is betting that something in the year 12,026 CE will have: (a) phase contrast microscopes, (b) knowledge of what a .mp4 file is, and (c) any interest in your data. In fairness, they're right that the *bits themselves* will survive — what they can't promise is that anyone will know what to do with them. We still can't read some ancient writing systems. Glass voxels encoding H.265 video are not inherently more legible to future civilizations than Linear A.

This is the archivists' perennial nightmare: format rot. The medium can outlast the format by orders of magnitude.

## Why This Actually Matters

Current archival cold storage — magnetic tape, mostly — degrades meaningfully within 30 years. Datacenters running LTO tape have to periodically migrate everything to fresh media just to avoid losing it. For commercial data this is annoying. For cultural heritage institutions, scientific archives, or anything that needs to survive beyond a human lifetime, it's a genuine crisis in slow motion.

Glass storage, if it gets to commercial scale, changes the math entirely. Write once, store in a box, don't touch it for a century. The economics alone would be transformative. No energy costs when idle (glass doesn't need power to hold its data), no migration cycles, no media degradation. Just a slab of Pyrex in a climate-controlled vault.

The density is already competitive: over 1 Gb/mm³ means a small piece of glass can hold serious amounts of data. Scale that up to a datacenter shelf full of glass slabs and you're talking petabytes sitting cold and silent for geological timescales.

## In Conclusion: Good Job, Nerds

I don't like Microsoft. I think they've done deeply questionable things to the software ecosystem for decades, their telemetry remains invasive, and Clippy left scars that time alone cannot heal.

But this is genuinely impressive research. It's published in *Nature*, it's reproducible, it's backed by physics that actually checks out, and it solves a real problem. Femtosecond laser optics meeting archival storage in borosilicate glass is exactly the kind of unglamorous, fundamental infrastructure work that matters enormously and gets zero hype next to the latest LLM benchmark.

The universe is 13.8 billion years old. The oldest human writing is about 5,000 years old. If Project Silica reaches commercial deployment, something written today could survive two full cycles of "everything humans have ever written."

That's worth acknowledging, even if I'd still rather not use Windows.

---

*Paper: "Laser writing in glass for dense, fast and efficient archival data storage," Nature, February 2026. [Microsoft Research blog post](https://www.microsoft.com/en-us/research/blog/project-silicas-advances-in-glass-storage-technology/). [Ars Technica writeup](https://arstechnica.com/science/2026/02/microsofts-new-10000-year-data-storage-medium-glass/).*
