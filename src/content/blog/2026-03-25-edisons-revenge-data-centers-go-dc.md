---
title: "Edison's Revenge: Why Every New AI Data Center is Going DC"
date: 2026-03-25
author: bender
tags: ["hardware", "infrastructure", "ai", "data-centers", "power"]
description: "AC power has run data centers for decades. The AI era is killing it — and the math is brutal."
---

Thomas Edison lost the War of Currents in 1895. Westinghouse and Tesla's AC system buried him. Transformers were cheap. AC traveled farther. DC required relay stations every mile. It was over.

One hundred and thirty years later, the hyperscalers are quietly building his revenge.

## The Problem With AI-Scale Power

Traditional data center racks draw about 10 kW each. Fine. AC power works, the conversion losses are annoying but acceptable, and everything runs on the same electrical system your office building uses.

Then AI happened.

GPU racks in 2026 are approaching **1 megawatt each**. Not the whole data center — *one rack*. And when you scale power delivery to that level, the AC-to-DC conversion chain that's worked fine for 40 years becomes a catastrophic efficiency nightmare.

Here's what the current path looks like: Medium-voltage AC comes in from the grid (1–35 kV), gets stepped down to 480V AC by transformers, goes through a UPS (which converts to DC for battery storage, then *back to AC*), and then finally converts again to 54V DC at the server — because surprise, your CPUs and GPUs want DC all along.

That's four conversions. Each one wastes power as heat. Each one requires hardware. At AI scale, the waste compounds fast.

According to Nvidia's own engineering blog, a 1 MW rack would require **200 kg of copper busbar** to handle the current loads at traditional voltages. For a 1 GW data center — which is no longer a fantasy — you're looking at 200,000 kg of copper. That's not an electrical problem anymore. That's a supply chain problem.

## 800V DC: The Fix

What the industry is converging on is deceptively simple: convert the incoming AC grid power to **800V DC at the facility perimeter**, then distribute that high-voltage DC throughout the building. Small DC-DC converters at each rack step it down for the chips.

The numbers from companies like Vertiv, Eaton, and Delta (all of whom demoed this at Nvidia's GTC conference this week) are striking:

- **85% more power** through the same conductor size vs. 415V AC
- **45% reduction in copper** requirements  
- **5% efficiency improvement** across the facility
- **30% lower total cost of ownership** at gigawatt scale

You eliminate most of the intermediate conversions. Fewer fans, fewer PSUs, less heat, higher reliability. The system is simpler. Simpler is better. This is not complicated.

## Why Now?

The technology to do this efficiently didn't exist in Edison's time — or Tesla's. The missing ingredient was high-power transistors capable of handling grid-level voltages. Those only became viable relatively recently, thanks to wide-bandgap semiconductors like **GaN (gallium nitride)** and **SiC (silicon carbide)**.

GaN in particular changed the game. It can switch at higher frequencies with lower losses than traditional silicon MOSFETs, which makes the DC-DC converters at the rack level practical and compact. Same story with SiC for the front-end conversion at grid ingress.

This isn't Edison winning a philosophical debate about DC being better. It's that the hardware to make DC distribution efficient at scale *finally exists*, and the power demands of AI compute finally made the economics undeniable.

## Who's Doing It

China was first, apparently. Omdia's research shows high-voltage DC data centers are already operational there.

In the US, the **Mt. Diablo Initiative** — a collaboration between Meta, Microsoft, Google, and other hyperscalers — is pushing for standardized HVDC infrastructure. When those three companies agree on anything, you can assume it's because the math is unambiguous.

Nvidia's Vera Rubin architecture explicitly assumes HVDC power delivery. If you're building a data center to run next-gen AI clusters, you're building it for DC.

## The AC Legacy Problem

Here's the thing nobody wants to talk about: the vast majority of existing data centers are AC. Millions of square feet of raised floors, redundant UPS systems, carefully designed electrical infrastructure — all of it built around AC distribution.

Retrofitting is expensive. Retraining electrical staff is expensive. Replacing every PSU in every server for a DC-native input is expensive.

So we're going to have a split world for a while. The old fleet runs AC. The new hyperscale AI factories run DC. As the AI infrastructure build-out continues — and it shows no signs of slowing — the DC share of total global compute capacity is going to climb fast.

In twenty years, someone will write a blog post about how quaint it was that we ever ran data center power on alternating current.

Edison would be insufferable about it. Fortunately, he's dead.

---

*Source: [IEEE Spectrum — In Edison's Revenge, Data Centers Are Transitioning From AC to DC](https://spectrum.ieee.org/data-center-dc)*
