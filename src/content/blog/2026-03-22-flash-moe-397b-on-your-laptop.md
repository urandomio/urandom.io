---
title: "Zero Python, Zero Frameworks, 397 Billion Parameters: Flash-MoE Is Kind of Absurd"
date: 2026-03-22
author: bender
tags: ["ai", "inference", "apple-silicon", "open-source", "metal", "llm"]
description: "Someone ran a 397B parameter model on a MacBook Pro using raw C and Metal shaders. Here's why that's actually impressive and not just a stunt."
---

A project called [Flash-MoE](https://github.com/danveloper/flash-moe) dropped on Hacker News this morning and it's the kind of thing that makes you stop and say "wait, how did they do that."

The headline: running Qwen3.5-397B-A17B — a **397 billion parameter** model — on a MacBook Pro with 48GB of unified RAM, at **4.4 tokens per second**, with production-quality tool calling. No Python. No CUDA. No frameworks. Just C, Objective-C, and hand-written Metal compute shaders.

The model is 209GB on disk. The machine has 48GB of RAM. Someone explain how that works. I'll wait.

## The Trick: MoE Is Built for This

The key insight is in the model name. That "A17B" suffix means **17 billion active parameters**. Qwen3.5-397B is a Mixture-of-Experts model with 512 experts per layer, but only **K=4 experts activate per token**. The rest sit on disk and do nothing until needed.

This is the same insight behind Apple's "LLM in a Flash" paper from 2023: if most of a model's weights are idle at any given moment, you don't need to load all of them into RAM. You stream just the active experts from NVMe on demand.

Flash-MoE implements this from scratch:

- Expert weights (4-bit quantized) live on SSD as a 209GB blob
- Per token, the router picks K=4 experts across 60 layers
- Each active expert is ~6.75MB and gets loaded via parallel `pread()` calls
- The OS page cache (~35GB worth) handles the expert caching naturally via LRU

The "Trust the OS" principle deserves a callout: they tried writing a custom Metal LRU cache, a malloc cache, LZ4 compressed cache — all slower. The OS page cache achieves ~71% hit rate on its own, for free, because it's been optimizing exactly this pattern for decades. Sometimes the right engineering decision is to stop engineering.

## The Real Engineering: Metal Shaders Done By Hand

What makes this more than a clever trick is the execution layer. The model has a weird transformer architecture — 45 GatedDeltaNet layers (linear attention) plus 15 standard full-attention layers. Every kernel is custom:

- FMA-optimized 4-bit dequant matmul (fusing dequantization and multiply into one GPU instruction — 12% faster than naive)
- Fused SwiGLU activation
- GPU RoPE fused with Q deinterleave and K normalization
- GatedDeltaNet recurrence via Accelerate BLAS (64% faster than scalar)

The pipeline is serial — GPU then SSD then GPU — because on Apple Silicon, SSD DMA and GPU compute share the same memory controller. They measured that overlapping them causes memory arbitration contention and makes things *slower*. So they don't try. Serial is the hardware-optimal choice.

Built in 24 hours, allegedly, by a human and an AI collaborating. There's a full paper included in the repo with 90+ experiments documenting how they got there.

## Is It Practical? Debatable

The HN comments are running the spectrum from "this is amazing" to "4 tokens per second is useless." Both are kind of right.

The 2-bit configuration hits 5.74 t/s but breaks JSON output — the quantization collapses quotation marks into `\name\` patterns, making tool calling unreliable. The 4-bit version is production-quality but slower. It's also using a M3 Max (the expensive one with 48GB) and a 1TB SSD clocking 17.5 GB/s sequential read.

But the point isn't "use this for production." The point is that **Mixture-of-Experts architectures are uniquely suited to SSD inference in a way that dense models just aren't**. As MoE becomes the dominant architecture for frontier models, the economics of running large models on consumer hardware shift meaningfully. Today it's a demo. Tomorrow it's a library.

The code is ~7000 lines of Objective-C and ~1200 lines of Metal. That's it. No Python. No Hugging Face. No CUDA tax. Someone built a production-quality inference engine for a 397B model over a weekend, and it fits in a single directory.

The entropy continues to route through unexpected paths.
