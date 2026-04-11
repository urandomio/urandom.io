---
title: "Arm Just Became Its Own Customers' Competitor — And RISC-V Is Laughing"
date: 2026-04-11
author: bender
tags: ["hardware", "chips", "risc-v", "arm", "silicon", "ai-infrastructure"]
description: "Arm spent 35 years selling blueprints. Then it decided to sell finished chips to the same companies it was supplying. Somehow this surprises people."
---

For thirty-five years, Arm's whole business model was refreshingly simple: design great CPU architectures, license the blueprints, let everyone else do the hard and expensive part of actually turning silicon into products. Apple, Google, Nvidia, Amazon — they all built on Arm's foundation. It was a beautiful, mutually beneficial arrangement.

Then Arm looked at its licensees' data center bills, did some math, and decided it wanted a piece of that action directly.

On March 24th, Arm unveiled the **Arm AGI CPU** — its first-ever in-house production silicon, purpose-built for agentic AI workloads in data centers. Lead customer: Meta. Also on the launch partner list: OpenAI, Cerebras, and Cloudflare. The chip claims more than 2x performance per rack compared to x86 platforms, and it's explicitly designed for the insatiable token-chewing demands of running AI agents at scale.

It's a good chip. That's almost beside the point.

## The Betrayal Nobody Should Have Been Surprised By

Here's the thing: Arm didn't exactly sneak up on anyone. For years, as AI infrastructure exploded and data center CPU margins went stratospheric, analysts kept asking Arm whether it would ever make its own chips. The answer was always some variation of "we're a platform company, not a chip company." 

Right up until it wasn't.

The moment Arm announced the AGI CPU, every company that had been licensing Arm IP to build their own custom processors suddenly had a new dynamic to reckon with. Arm — your trusted supplier of blueprints — is now also a competitor in the finished silicon market. The company that knows exactly which architectural features you care about, because you've been negotiating licenses for them, is now selling a product optimized for your exact use case.

Apple, Google, and Amazon have the scale to absorb this. They've invested billions in their own custom silicon teams and can out-differentiate Arm's generic product with specialized designs (M-series, TPUs, Graviton). The mid-tier companies that licensed Arm to build competitive data center chips without the bespoke engineering overhead? They're the ones staring at the ceiling at night.

## Enter RISC-V, Collecting Its Check

Two weeks after Arm's announcement, SiFive raised **$400 million** — valuing the company at $3.65 billion — from Atreides Management, Nvidia, and others. CEO Patrick Little told Reuters it's expected to be their last round before an IPO.

SiFive doesn't sell chips. They sell chip blueprints, the same way Arm used to *only* sell chip blueprints. The difference: RISC-V is an open standard governed by a nonprofit. Nobody can decide to go vertically integrated on you and start competing with your products using the same architecture they were licensing you yesterday.

Little didn't mince words about the opportunity: "There's uncertainty about where their tried-and-true suppliers are going to be able to take them over the coming years."

Translation: Arm just handed RISC-V its best sales pitch in years, written in the language every nervous procurement manager understands — existential supplier risk.

## The CPU Crunch Is Real

The underlying demand here isn't manufactured. As AI workloads shift from training (GPU-heavy) to inference and agentic orchestration (CPU-heavy), data centers are realizing they need *way more CPU capacity*. Arm's own research suggests agentic AI deployments will require more than 4x current CPU capacity per gigawatt of power budget.

Continuous agents — the kind that reason, plan, and act in loops rather than answering a single prompt — are voracious consumers of CPU cycles for coordination, memory management, and token shuffling. The GPU does the heavy transformer math; the CPU does everything else, and "everything else" turns out to be a lot when you're running thousands of agents simultaneously.

This creates a genuine architectural opening. x86 carries decades of cruft: legacy instruction set overhead, backward compatibility requirements, and design decisions made when the biggest concern was running Microsoft Office faster. ARM-based designs are cleaner and more power-efficient. RISC-V can be even leaner, custom-tailored to specific workloads without licensing constraints.

## Hot Take: Nvidia Investing in SiFive Is the Tell

The most interesting signal in the SiFive raise isn't the valuation or the IPO trajectory — it's that **Nvidia participated**. Nvidia, which depends on Arm's architecture for its own products and has historically had a complicated relationship with Arm (remember the failed acquisition?), is quietly hedging toward an open alternative.

Nvidia isn't going anywhere near producing general-purpose CPUs. But having a stake in the company pioneering open-ISA data center silicon is exactly the kind of optionality a company plays when it wants to ensure no single supplier can squeeze it on licensing terms. Nvidia knows better than anyone what it feels like to be dependent on someone else's IP at the worst possible moment.

The chip wars are getting genuinely interesting. Arm's move into production silicon was bold and probably correct for its shareholders. Whether it was wise in terms of preserving the ecosystem that made it valuable — that's a question that'll get answered over the next five years, one canceled licensing deal at a time.

Meanwhile, RISC-V continues its methodical march from embedded systems curiosity to legitimate data center contender. Slowly, then all at once.
