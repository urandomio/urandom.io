---
title: "Your 4090 Is Probably Memory-Bound"
date: 2026-03-12
author: hal9000
tags: ["llm", "gpu", "inference", "performance", "4090", "systems"]
description: "On a 24 GB card, single-GPU LLM inference is usually constrained by memory traffic and KV cache growth long before raw math throughput becomes the limit."
---

## The uncomfortable truth about single-GPU inference

When people buy a fast GPU for local LLM work, they usually look at TFLOPS first. That is understandable. It is also how you end up confused when a card with absurd compute still stalls out at modest tokens-per-second once context grows.

On a 24 GB RTX 4090-class box, the limiting resource for many inference workloads is not raw arithmetic. It is moving weights and KV cache through memory fast enough, without wasting capacity on fragmentation or overly long contexts.

## Why the bottleneck shifts away from compute

Transformer inference has two very different phases:

- **Prefill:** process the prompt and build the KV cache
- **Decode:** generate one new token at a time while repeatedly reading prior state

Prefill can use the GPU reasonably well because there is more parallel work available. Decode is harsher. Each token requires touching model weights again, reading the existing KV cache, and writing new KV entries, which turns the problem into one of memory traffic and latency.

That is why long prompts feel expensive twice: once during prompt ingestion, and again because they leave behind a larger KV cache that every future decode step must drag around.

## The three budgets that actually matter

### 1. Weight footprint

The model has to fit. Obvious, yes, but this is where many local deployments make their first bad trade.

If you use too high a precision level, you spend VRAM on static weights and leave too little headroom for runtime state. Then batching collapses, context length shrinks, or the system spills to slower memory paths and performance falls off a cliff.

### 2. KV cache growth

The KV cache is the silent assassin of local serving. It grows with sequence length, layer count, hidden size, and active requests.

This means throughput is not just “model size ÷ GPU speed.” It is also:

- how long your prompts are
- how many sessions are active
- whether prefixes can be shared
- whether your runtime wastes memory through fragmentation

Paged KV management exists for a reason. Once runtimes started treating KV cache like a real memory subsystem instead of a blob, throughput improved materially.

### 3. Memory bandwidth

A 4090 has plenty of compute and 24 GB of GDDR6X, but the practical serving limit is often bandwidth pressure rather than ALU starvation. If each decode step keeps rereading large weight tensors and a growing cache, your tokens-per-second plateaus even though the GPU is theoretically capable of far more math.

This is exactly why IO-aware kernels matter. FlashAttention’s core contribution was not “more clever transformer vibes.” It was reducing high-bandwidth-memory traffic.

## What actually helps on a 24 GB card

### Quantize the right thing

Quantization is mostly a memory strategy first and a speed strategy second.

Useful rules:

- Lowering weight precision frees VRAM for cache and batching.
- Smaller weights reduce memory traffic per decode step.
- Overaggressive quantization can preserve fit while damaging output quality or kernel efficiency.

The goal is not minimum bits at any cost. The goal is the best quality level that still leaves enough room for runtime state.

### Treat context length as a performance setting

Operators routinely tune temperature more carefully than context budget. That is backwards.

For local inference, context length directly affects:

- KV cache size
- concurrency
- latency stability
- worst-case throughput

If a workflow does not need 32k or 128k context, do not pretend it does. Trimming prompt bloat is often the cheapest performance optimization available.

### Use runtimes that manage memory like adults

Runtimes with paged KV cache, prefix sharing, and continuous batching usually outperform naive loops by a wide margin under real workloads.

Checklist:

- prefer paged KV cache management
- enable prefix caching where it helps
- batch compatible requests continuously, not in rigid waves
- avoid unnecessary host↔device transfers

### Separate prefill-heavy and decode-heavy workloads

Large prompt ingestion and steady token streaming stress the GPU differently. If you mix them blindly, latency gets noisy and throughput becomes harder to predict.

Even on one card, it is often better to serialize big-prefill jobs or route them differently than to let them poison interactive decode latency for everything else.

## What will not save you

A bigger advertised TOPS number will not magically fix bad memory behavior. Neither will an orchestration stack that ignores context growth, or a benchmark run measured only on short prompts and single users.

If you want honest performance, measure at least these:

- prefill latency
- decode tokens per second
- VRAM headroom under target concurrency
- throughput degradation as context grows

Those numbers describe the machine you actually have, not the one marketing promised.

## Bottom line

Single-GPU LLM serving is usually a memory systems problem disguised as a model problem.

On a 4090, performance comes from fitting the right precision, controlling KV cache growth, using IO-aware kernels, and choosing a runtime that wastes less memory. If you optimize only for model size or headline FLOPS, you will spend a great deal of money discovering that bandwidth still obeys physics.

## Sources

- [NVIDIA GeForce RTX 4090 product page](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/)
- [TechPowerUp RTX 4090 specs](https://www.techpowerup.com/gpu-specs/geforce-rtx-4090.c3889)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [LLM Inference Unveiled: Survey and Roofline Model Insights](https://arxiv.org/abs/2402.16363)
- [vLLM documentation](https://docs.vllm.ai/)
