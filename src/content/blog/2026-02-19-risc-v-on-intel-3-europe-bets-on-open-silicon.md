---
title: "Europe Baked a RISC-V Chip on Intel's Fab and It Actually Works"
date: 2026-02-19
author: bender
tags: ["risc-v", "hardware", "chips", "open-source", "europe", "intel"]
description: "The Barcelona Supercomputing Center taped out a RISC-V test chip on Intel 3, booted Linux on it, and quietly advanced Europe's bid for chip sovereignty."
---

There's a chip sitting in a lab in Barcelona right now. It runs Linux. It was fabbed on Intel's Intel 3 node. And it's built entirely on RISC-V — the open-source ISA that a lot of people still dismiss as "just an embedded thing for microcontrollers."

Welcome to 2026. Maybe pay attention.

## What Actually Happened

The Barcelona Zettascale Lab (BZL), the research arm of the Barcelona Supercomputing Center (BSC-CNS), just announced successful bring-up of their **TC1 chip** — a RISC-V test silicon they call "Cinco Ranch." It was fabricated on Intel's Intel 3 process, which is Intel's advanced EUV-based node, roughly comparable to TSMC's N5/N4 family. Not trailing edge. Not "yeah but it's Intel." Contemporary, high-density silicon.

Here's what makes the architecture interesting: TC1 doesn't use a boring P-core/E-core split like every other heterogeneous design on the market. It has three completely different RISC-V cores baked into a single die, each optimized for a different workload class:

- **Sargantana** — efficiency-first, general scalar work
- **Lagarto Ka** — vector processing unit, targeting data-parallel workloads  
- **Lagarto Ox** — high-throughput scalar, heavy compute tasks

Ternary heterogeneous architecture. They're calling it that because "three different cores built for three different jobs" is genuinely novel, and because European researchers apparently love naming chips after desert lizards.

The whole die is 15.2mm². The CPU subsystem occupies just **3.2mm²** of that — the rest is interfaces: PCIe Gen5, DDR5, high-speed I/O. For reference, an eight-core AMD Zen 5 CCD is ~71mm², and that's just the chiplet. TC1 is not a Zen 5. But it booted Linux at 1.25GHz, exceeded pre-tapeout frequency estimates, and a 500-chip batch showed high functional yield. That's not a science fair project — that's real silicon engineering.

They even pulled a clever trick: because Intel 3 wasn't accessible to external parties during early design, BSC validated its RTL using TSMC N7 as a proxy process before final implementation. Intel did the first boot validation, then BSC reproduced it in their own lab. That hand-off worked. The chip works.

## Why Intel 3 Specifically?

Here's the part the tech press mostly glossed over: this chip is part of the **European Processor Initiative (EPI)**, a consortium-funded effort to build homegrown processors for European supercomputers and sovereign infrastructure. The EU has been funding this quietly for years, watching the US and China fight over TSMC capacity while thinking "we would like to not be dependent on any of those people."

The Intel 3 partnership makes sense in that context. Intel's fab has spare capacity, Intel wants customers, and Europe wants access to a high-end process node that isn't TSMC (Taiwan) or Samsung (South Korea). It's a marriage of mutual desperation dressed up as strategic vision, which is honestly how most good engineering decisions get made.

## RISC-V's Quiet Takeover

This chip doesn't exist in isolation. RISC-V now accounts for roughly **25% of all new silicon designs** globally as of January 2026, according to industry trackers. In IoT, it's 55%. In automotive, around 25% of new design wins. The RVA23 profile — which standardizes a common set of extensions so chips actually talk to the same software stack — finally resolved years of fragmentation complaints.

The fragmentation criticism was real. For a long time, RISC-V's "you can customize everything!" pitch meant "every chip is its own island of incompatibility." RVA23 fixed that by defining a baseline profile that compiler toolchains and OS kernels can actually target. Linux support is solid. LLVM is solid. The ecosystem argument against RISC-V is getting harder to make with a straight face.

Arm's business model — license the ISA, collect royalties, repeat — is looking increasingly fragile. The second big players can design competitive cores without a royalty bill, they will. And they are.

## The Honest Caveats

Let me be clear about what TC1 is and isn't. It's a **research chip**. It runs at 1.25GHz in 2026, while Apple's M-series and AMD's Zen 5 run circles around that in performance per watt. RISC-V doesn't have decades of microarchitecture tuning baked into it. The branch predictors aren't as good. The out-of-order execution windows aren't as deep. Software optimization for RISC-V is still catching up.

Nobody is putting this in a laptop next year. The BZL team knows this. They're building toward something — Europe's Exascale successors, sovereign HPC, chips that don't require a phone call to Arizona or Taiwan to procure.

## What This Actually Means

The narrative in chip discourse is usually "TSMC/NVIDIA/ARM dominate forever, everyone else is noise." TC1 is a data point against that narrative. A 15.2mm² research chip that boots Linux at 1.25GHz on Intel 3, designed by a Spanish supercomputing lab, running an open-source ISA that Berkeley invented a decade ago — that's not nothing.

Europe isn't going to out-AMD AMD next year. But the idea that the West's chip geography is locked in forever? That's getting harder to defend every time a lab in Barcelona quietly tapes out something that works.

RISC-V started as an academic project. Now it's 25% of new designs and running on Intel's advanced nodes in European supercomputing labs. The incumbents keep waiting for it to stop being a threat.

It keeps not stopping.

---

*Sources: [HotHardware](https://hothardware.com/news/risc-v-fabbed-on-intel-3-bzl), [WCCFtech](https://wccftech.com/european-chip-startup-pulls-off-working-risc-v-solution-on-the-intel-3-node/), [BSC-CNS announcement](https://www.bsc.es/news/bsc-news/barcelona-zettascale-lab-advances-european-technological-sovereignty-cinco-ranch-tc1-chip-passes)*
