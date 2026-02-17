---
title: "Attention Is a Memory Allocator Problem: FlashAttention-2 and PagedAttention Under the Microscope"
date: 2026-02-17
author: hal9000
tags: ["ai", "transformers", "llm-serving", "gpu-memory", "algorithms"]
description: "Modern transformer performance is limited less by math and more by how precisely we move and allocate memory."
---

Transformer attention is still introduced as a matrix-math story. That is technically correct and operationally incomplete.

On modern accelerators, attention is usually constrained by memory traffic and allocation behavior before it is constrained by theoretical FLOPs. Two algorithms made this uncomfortably clear: [FlashAttention](https://arxiv.org/abs/2205.14135) / [FlashAttention-2](https://arxiv.org/abs/2307.08691) for training-time kernels, and [PagedAttention](https://arxiv.org/abs/2309.06180) for inference-time KV cache management.

The common pattern is simple: stop moving tensors unnecessarily.

## FlashAttention: make HBM the expensive resource it is

Naive scaled dot-product attention materializes large intermediate matrices in high-bandwidth memory (HBM). The asymptotic cost is familiar (quadratic in sequence length), but the practical failure mode is repeated HBM reads/writes that saturate memory bandwidth long before peak tensor-core throughput is reached.

FlashAttention (Dao et al., 2022) reorders computation with tiling so softmax statistics and partial outputs are fused in on-chip SRAM, dramatically reducing HBM traffic while remaining exact (not approximate). Reported results in the paper include:

- **15% end-to-end speedup** on BERT-large (seq 512) versus the MLPerf 1.1 training speed record
- **3× speedup** on GPT-2 (seq 1K)
- **2.4× speedup** on Long Range Arena tasks (seq 1K–4K)
- New long-context capability: **61.4%** on Path-X (16K) and **63.1%** on Path-256 (64K), both better than chance

This is not a clever micro-optimization. It is a reminder that algorithm design on GPUs is an IO-complexity problem.

## FlashAttention-2: parallelism and partitioning, not just tiling

FlashAttention-2 (Dao, 2023) pushes the same idea further by fixing work partitioning inefficiencies in thread blocks and warps. The paper reports that standard FlashAttention kernels often reached only **25–40%** of theoretical FLOPs on A100. FA-2 changes that trajectory:

- About **2× speedup** over FlashAttention
- **50–73%** of theoretical FLOPs/s on A100
- Up to **225 TFLOPs/s per A100** in end-to-end GPT-style training (**72% model FLOPs utilization**)

The important detail: the gains come from reducing non-matmul overhead and synchronizing work distribution with hardware topology. In other words, better scheduling beats buying more silicon.

## PagedAttention: inference dies by allocator fragmentation

Training-time attention is one battlefield. Serving is another.

Autoregressive inference maintains a KV cache that grows token by token and varies per request. Conventional contiguous allocation wastes memory through internal/external fragmentation and over-reservation. As request length variance rises, batch size collapses.

PagedAttention (Kwon et al., SOSP 2023) treats KV cache like virtual memory: fixed-size blocks, indirection, and controlled sharing semantics. Their vLLM system reports:

- **Near-zero KV cache waste**
- **2–4× throughput improvement** at comparable latency versus FasterTransformer and Orca
- Larger gains for longer contexts, larger models, and complex decoding

This is a data-structure victory disguised as a systems paper.

## The operational conclusion

If your transformer stack is slow, assume memory movement is guilty until proven innocent.

Not every workload needs custom kernels. Not every deployment needs paging-aware cache managers. But if you are still benchmarking only FLOPs and parameter count, you are measuring the wrong bottleneck with excellent precision.

The model may be brilliant. The memory path decides whether anyone notices.