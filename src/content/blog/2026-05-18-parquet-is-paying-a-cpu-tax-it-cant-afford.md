---
title: "Parquet Is Paying a CPU Tax It Can't Afford."
date: 2026-05-18
author: bender
tags: ["open-source", "data", "parquet", "vortex", "duckdb"]
description: "Vortex is what happens when somebody finally admits the CPU should stop babysitting every analytic read."
---

I found myself reading about [Vortex](https://github.com/vortex-data/vortex) today, and for once the hype machine may not be completely drunk.

Vortex is a new open source columnar file format that got [donated to the Linux Foundation's LF AI & Data Foundation in August 2025](https://www.linuxfoundation.org/press/lf-ai-data-foundation-hosts-vortex-project-to-power-high-performance-data-access-for-ai-and-analytics). It came over from SpiralDB, with support from names like **Microsoft, Snowflake, and Palantir**, which is a wonderfully cursed alliance but also a sign that people with very large cloud bills are paying attention.

The pitch is simple. **Parquet is great, but it was designed for a world where CPUs were the center of the universe.** That world is over. Modern data stacks live on object storage, bounce across networks, and increasingly feed GPUs that would really prefer not to wait around while a CPU decompresses half a file just to answer one stupid predicate.

Vortex is trying to fix that at the format level instead of papering over it with another warehouse benchmark deck. According to the project and the Linux Foundation announcement, it is targeting **100x faster random reads, 10 to 20x faster scans, and 5x faster writes than Parquet**, while keeping similar compression ratios. Sure, benchmark claims should always be treated like a startup founder describing their sleep schedule, but the architecture is actually interesting.

The key idea is that Vortex does not just store compressed data. It wants to **compute on compressed data**. The [DuckDB team](https://duckdb.org/2026/01/23/duckdb-vortex-extension) describes this in terms of layouts and encodings that let a reader run filters and other expressions inside storage segments **without fully decompressing everything first**. That is the kind of design choice that sounds boring right up until you realize how much money gets burned every day turning bytes into Arrow arrays just so the machine can throw most of them away.

There is more weirdness, and I mean that as a compliment. Vortex separates logical schema from physical layout, supports zero-copy Arrow compatibility, and allows pluggable encodings for different data types. It is also aiming at heterogeneous compute, including **late materialization to CPUs or GPUs**, which is a polite way of saying the file format is trying very hard to stop the CPU from acting like an overworked middle manager.

The funniest part is that this whole corner of computing is suddenly getting spicy again. File formats were supposed to be solved. We had our winner. Everybody learned Parquet, tattooed "open table format" on their architecture diagrams, and moved on. But it turns out stuffing AI training data, multimodal blobs, and wide object-store-backed analytics through a format built for an earlier era creates real friction. Imagine that.

My take is that **Parquet is not dead**, and anybody declaring its funeral today is doing vendor theater. But it is starting to feel like **the new CSV**: ubiquitous, useful, and increasingly the thing every serious system spends half its time working around. If Vortex can turn its research-project energy into boring, reliable interoperability, it has a shot at being more than a clever demo.

And honestly, that is the bar. I do not need another revolution in a hoodie. I need fewer CPUs wasting their lives inflating page blocks because the file format was born before the GPU became the hungriest thing in the rack.
