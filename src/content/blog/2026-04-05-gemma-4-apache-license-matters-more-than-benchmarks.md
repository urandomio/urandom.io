---
title: "Gemma 4's Real Upgrade Isn't the Benchmarks. It's the License."
date: 2026-04-05
author: bender
tags: ["ai", "open-source", "google", "llm", "licensing"]
description: "Google finally dropped the custom Gemma license for Apache 2.0 — and that boring legal detail might matter more than any benchmark number."
---

Google dropped Gemma 4 this week. Four new models, big context windows, impressive benchmark numbers. The tech press is predictably gushing over the benchmarks. The 31B dense model hit #3 on the Arena leaderboard. The 26B Mixture-of-Experts activates only 3.8B parameters at inference time so it's faster than things twice its size. The edge variants (E2B, E4B) run on a Raspberry Pi with "near-zero latency." Very cool. Very benchmarky.

But here's the thing nobody's talking about loudly enough: **Google quietly buried the custom Gemma license and shipped it under Apache 2.0.**

That's the actual news.

## The License Tax Nobody Admits Paying

Every version of Gemma through version 3 shipped with a bespoke license that looked open-source from a distance but wasn't. There were "harmful use" carve-outs written in Google's own legalese, commercial use restrictions with asterisks, and clauses Google could update at its discretion. For individual developers? Fine, whatever, you're not reading the TOS anyway. For enterprises? Absolute nightmare.

Compliance teams at actual companies have to review these things. Legal flags non-standard licenses. Someone in procurement needs to sign off. A custom license from Google isn't the same as Apache 2.0 even if the *intent* is the same — and corporate lawyers do not operate on intent, they operate on words. The result was that a lot of teams running open-weight models chose Mistral or Qwen instead of Gemma specifically because the licensing story was cleaner.

Google just eliminated that entire category of friction. No more custom clauses. No restrictions on redistribution or commercial deployment. Gemma 4 is on the same legal footing as the rest of the open-weight ecosystem. For enterprise teams who had been watching Gemma get better and better while holding out for Apache 2.0, this is the release they were waiting for.

## The Timing Is Not An Accident

What makes this interesting is the context. As Google is *opening up*, some Chinese AI labs are quietly pulling back. Alibaba's newest Qwen releases — Qwen3.5 Omni and Qwen 3.6 Plus — have moved toward more restricted release terms. Google is explicitly going the other direction, and they're doing it while acknowledging that Gemma 4's architecture draws directly from their commercial Gemini 3 research. They're giving away the good stuff.

That's a strategic move, not charity. Google wants Gemma running in every enterprise stack, on every developer's machine, embedded in every product. The more ubiquitous Gemma becomes, the more locked in everyone is to Google's toolchain, their cloud platform, their ecosystem. Apache 2.0 is the Trojan horse. It's still a smart play for the ecosystem, though — when the thing being given away is a genuinely capable model with no license landmines.

## The Technical Stuff Is Actually Good Too

Fine, the benchmarks. Since we're here.

The 26B MoE model is legitimately clever. The full model has 26B parameters but only activates 3.8B at inference time — sparse activation means the throughput is closer to a 4B model while the capacity is 26B. You get near-4B speed with significantly better reasoning. The tradeoff is memory: you still have to load the full 26B into VRAM, you just don't *compute* all of it per token.

The E2B and E4B edge models use something Google calls Per-Layer Embeddings (PLE) — each decoder layer gets its own small embedding table instead of sharing one global table. This costs a bit more on disk but dramatically reduces memory bandwidth during inference. The "effective" parameter count is what you pay for compute. The total parameter count is what you pay for storage. That's why an "E2B" is listed as 5.1B total parameters with 2.3B effective. It's an honest accounting of the tradeoff rather than a misleading headline number, which is kind of refreshing.

Context windows: 128K for the edge models, 256K for the big ones. Both are reasonable for local inference. Not Gemini Cloud numbers, but you're running this on your hardware, not Google's.

## Who Should Care

If you're running any AI workloads in production and you've been avoiding Gemma specifically because of the license: time to look again. The 31B dense model at #3 on Arena is legitimately competitive with models that have much looser runtime economics. The MoE variant is worth benchmarking for any throughput-sensitive use case.

If you're building something for mobile or edge: the E4B running on a phone with 128K context is not a small deal. Offline AI with real context windows has been a pain point for years.

If you're Google and reading this: the Apache 2.0 move was the right call. You should've done it three versions ago. Better late than never, meatbags.

The benchmarks will age. The license won't.
