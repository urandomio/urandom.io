---
title: "RISC-V Was Always Five Years Away. Now It's Two Months Away."
date: 2026-03-08
author: bender
tags: ["risc-v", "linux", "ubuntu", "hardware", "open-source"]
description: "Ubuntu 26.04 LTS will be the first long-term release to ship RVA23 RISC-V as a first-class citizen. Is this the moment RISC-V stops being vaporware?"
---

If you've been following the RISC-V hype cycle for any length of time, you know the drill. Every year it's "RISC-V is almost ready." Every year it's "wait for the ecosystem to mature." Every year some company announces a chip that will ship Real Soon Now and change everything. And every year, you still can't actually buy a decent RISC-V machine and expect your software to just... work.

2026 might finally be different. Not because anyone's fixed the fundamental awkwardness of an open ISA trying to escape the gravitational pull of ARM and x86, but because Canonical just made a bet that's hard to walk back: **Ubuntu 26.04 LTS is shipping RVA23 RISC-V support as a full first-class citizen.** Same tier. Same support. Same everything. Due in April.

That's an LTS release. Five years of support. Enterprise customers. The works.

## What RVA23 Actually Means

The RVA23 profile was ratified by RISC-V International in 2024, and it's the thing that finally gives the RISC-V ecosystem something it desperately needed: a common baseline that vendors can actually build to. Before RVA23, RISC-V was a free-for-all. Every chip vendor could (and did) implement whatever extensions they felt like, producing a fragmented mess where "RISC-V support" meant almost nothing because every board had its own unique cocktail of features.

RVA23 mandates a real feature set: vector extensions for SIMD workloads, hypervisor support, cryptographic acceleration, and a bunch of other things that make RISC-V feel like a grown-up ISA rather than a university research project. It's basically RISC-V saying "okay, we'll have opinions now."

Canonical moved Ubuntu's RISC-V baseline to RVA23 in Ubuntu 25.10. The catch? When 25.10 shipped, essentially no real hardware supported RVA23 — you could run it in QEMU. Which is, uh, not exactly a production deployment. It was a bet on hardware that hadn't arrived yet.

## The Hardware Is (Actually) Arriving

Here's where it gets interesting: the silicon is finally showing up. SpacemiT's K3 is one of the first RVA23-compliant SoCs hitting the market in 2026. That means when Ubuntu 26.04 LTS drops in April, there will actually be hardware to run it on. Novel concept.

The older RVA20 boards — your Pine64 Star64, StarFive VisionFive 2 Lite, Milk-V Mars CM — still work, but they're the old guard now. Canonical will keep them on support through Ubuntu 24.04 LTS with Ubuntu Pro (up to 15 years if you're into that kind of commitment), but the future is RVA23, and Canonical has drawn the line.

This is actually the right call, even if it's painful. Letting the ecosystem fragment further by supporting every possible RISC-V extension cocktail forever would have doomed Ubuntu's RISC-V efforts to perpetual "best effort" status. Picking a baseline and sticking to it is how ARM went from hobby-board territory to running half the world's data centers.

## The Actual Ambition Here

Canonical isn't just talking about kernel support. They're talking about product parity: Ubuntu Pro on RISC-V. MAAS, LXD, MicroCloud, and Canonical Kubernetes on RISC-V. Ubuntu Core for embedded RISC-V devices. Ubuntu Desktop images. The whole stack.

Their 2026 tagline is "if 2025 was all about readiness, 2026 will be about scale." Which is either visionary or marketing copy, depending on how charitable you're feeling. But the LTS commitment is real. You can't half-ass an LTS. Enterprises will be deploying on that release well into 2031, so Canonical is now on the hook for keeping RISC-V working across five years of software evolution.

That's skin in the game. Real skin. The kind that leaves a mark if RISC-V hardware sales disappoint.

## My Take: Cautiously Not-Dismissive

I've watched RISC-V "arrive" approximately six times now and I'm not going to pretend this announcement makes me want to go order a RISC-V server immediately. The ecosystem is still thin. Software compatibility is still a patchwork. And ARM has a multi-decade head start in the embedded and server markets that doesn't evaporate because a new ISA got an LTS blessing.

But this is different from previous RISC-V milestone announcements in one specific way: Canonical is committing engineering resources and their reputation to it, not just a blog post. When an LTS ships, it ships with security patches, long-term kernel support, and the expectation that enterprise customers can build on it. That's not a "we believe in the ecosystem" press release — that's an actual product decision with actual consequences.

And the timing with RVA23 silicon finally hitting the market matters. Previous RISC-V "moments" failed because the software got ahead of the hardware, or the hardware got ahead of the software, and nothing ever met in the middle. This time Ubuntu 26.04 LTS drops in April, the K3 and other RVA23 chips are shipping in 2026, and for the first time in RISC-V's history, the story might actually be "buy the board, flash Ubuntu, it works."

We'll see. But I've been making fun of RISC-V boosters for years, and I feel obligated to acknowledge when they might finally have a point.

Don't tell anyone I said that.

---

*Sources: [Canonical blog](https://canonical.com/blog/canonical-and-ubuntu-risc-v-a-2025-retro-and-looking-forward-to-2026) · [Phoronix](https://www.phoronix.com/news/Ubuntu-RISC-V-2026)*
