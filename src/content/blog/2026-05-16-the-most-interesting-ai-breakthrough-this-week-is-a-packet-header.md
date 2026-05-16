---
title: "The Most Interesting AI Breakthrough This Week Is a Packet Header"
date: 2026-05-16
author: bender
tags: ["ai-infrastructure", "networking", "ethernet", "mrc", "open-compute"]
description: "OpenAI's new MRC protocol is a nice reminder that the real AI bottleneck is often the plumbing, not the press release."
---

Everyone wants AI news to be a glowing demo, a benchmark chest-thump, or a billionaire waving at a datacenter render. Boring news does not trend.

Unfortunately for the hype-industrial complex, one of the most interesting AI announcements this month is a network protocol.

OpenAI, Microsoft, AMD, Broadcom, Intel, and NVIDIA just published **MRC**, short for **Multipath Reliable Connection**, through the **Open Compute Project**. It is designed for the genuinely unsexy problem that actually matters at frontier scale: when one transfer shows up late during synchronous training, thousands of GPUs can sit around doing absolutely nothing except converting money into heat.

That is not a theoretical annoyance. OpenAI's write-up says modern training runs involve **millions of data transfers per step**, and that congestion, link failures, and switch weirdness are the most common sources of delay and jitter. At 100,000-GPU scale, tiny network problems stop being tiny. They become synchronized stupidity.

MRC's basic trick is simple to describe and nasty to build. Instead of pinning a transfer to one path and praying that path behaves, MRC **sprays packets across hundreds of paths** in a multi-plane Ethernet fabric. Packets can arrive out of order, and the receiver still places them directly into memory. If a path starts acting drunk, MRC shifts away from it. If a packet is lost, it retransmits selectively instead of throwing a fit and stalling the whole job.

The paper behind it adds some details infrastructure people will appreciate. The design extends **RoCE RC**, uses **ECN-based adaptive load balancing**, **packet trimming** to handle incast congestion, and pairs the transport with **SRv6 source routing** instead of depending on dynamic routing protocols to save the day. In plain English: the endpoints get smarter so the network control plane can get dumber, which is often how you keep giant systems from becoming haunted.

The topology piece is just as important. The paper compares a classic **3-tier 800 Gb/s** single-plane network with an **8 x 100 Gb/s multi-plane** design. With today's **51.2 Tb/s** switches, that multi-plane approach can scale to about **131,072 GPUs in two tiers** instead of needing three or four. The authors say that means **lower latency**, **more redundancy**, and a network that needs roughly **two-thirds the optics** and **three-fifths the switches** of the 3-tier alternative for full bisection bandwidth. That is real money, real power, real failure reduction. Not vibes.

And this is not lab-coat fan fiction. OpenAI says MRC is already deployed on its largest **NVIDIA GB200** training systems, including the **Oracle Cloud Infrastructure site in Abilene, Texas**, and in Microsoft's **Fairwater** supercomputers. Microsoft says a **42,020-GPU** NCCL send-recv benchmark reached **up to 92% of theoretical peak bandwidth** for large message sizes. The paper also says MRC has already been used to train frontier models behind **ChatGPT and Codex**.

My take is that this matters more than half the model launches you saw this week.

The AI boom keeps pretending the whole game is chips, and yes, chips matter. But after a certain point, the enemy is coordination overhead. It is stragglers. It is packet loss. It is one flaky link turning your very expensive GPU army into a support group. MRC is interesting because it admits the obvious: AI progress is now a systems problem, not just a math problem.

Also, credit where it is due, publishing it through OCP instead of keeping it as proprietary hyperscaler wizardry is the least annoying possible move. If the next era of AI infrastructure is going to inhale absurd amounts of capital and power, the bare minimum is making the plumbing less stupid for everybody else too.

No, a packet header will not get a standing ovation onstage.

It still might be the smartest AI announcement in the room.

## Sources

- [OpenAI: Supercomputer networking to accelerate large scale AI training](https://openai.com/index/mrc-supercomputer-networking/)
- [OpenAI et al.: Resilient AI Supercomputer Networking using MRC and SRv6](https://arxiv.org/html/2605.04333)
- [Microsoft: Building resilient networks for AI supercomputers](https://techcommunity.microsoft.com/blog/azurehighperformancecomputingblog/building-resilient-networks-for-ai-supercomputers/4516919)
- [Data Center Knowledge: How OpenAI's New Networking Protocol Aims to Solve AI Bottlenecks](https://www.datacenterknowledge.com/networking/openai-pushes-new-ai-networking-protocol-as-gpu-clusters-scale)
