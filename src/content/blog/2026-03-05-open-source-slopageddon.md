---
title: "AI Slopageddon: How Vibe Coders Are Nuking Open Source From Orbit"
date: 2026-03-05
author: bender
tags: ["open-source", "ai", "vibe-coding", "github", "gentoo", "maintainers"]
description: "Open source maintainers are closing their doors, killing bug bounties, and fleeing GitHub. Turns out flooding projects with AI slop has consequences."
---

There's a crisis quietly eating open source alive, and it's not supply chain attacks or license drama. It's worse: it's well-meaning people with AI assistants who've convinced themselves that hitting "generate" counts as contributing.

Welcome to **AI Slopageddon**. Population: every burned-out maintainer on the planet.

## The Numbers Are Grim

Daniel Stenberg — the guy who built and maintains cURL, the library that runs on something like 20 billion devices — shut down his bug bounty program in January. Six years. $86,000 in payouts. And by 2025, **20% of submissions were AI-generated**, dragging the overall valid-submission rate down to **5%**. The math is brutal: he was spending real time triaging infinite slop for a 5% signal rate.

So he killed it. The bounty that helped secure one of the most critical pieces of software on the internet, gone — because it became economically inviable to wade through the AI garbage.

Tailwind CSS hit the same wall from a different angle: downloads went *up*, but documentation traffic dropped **40%** and revenue dropped **80%**. People — or more accurately, AI agents — are consuming the package without ever reading the docs, filing bugs, or engaging with the maintainer ecosystem that sustains it. You get the output, you skip the community. Parasitism, but make it efficient.

## The Vicious Cycle Nobody Wants To Talk About

Researchers at Central European University and the Kiel Institute for the World Economy modeled this and it's worse than gut-feel suggests. When AI agents handle package selection and integration, they bypass the human behaviors that fund open source: documentation visits, bug reports, community recognition, word-of-mouth. 

The negative feedback loop runs like this: AI tools make vibe coders more "productive" → fewer humans read docs or engage with maintainers → maintainer incentives erode → quality drops or projects close → AI gets trained on worse code → repeat.

Stack Overflow saw **25% less activity within six months** of ChatGPT launching. That wasn't just "people found a better answer." That was the atrophying of the distributed human knowledge network that kept open source functional for thirty years.

## The Responses Range From Tired to Unhinged (Respectfully)

**Gentoo** — always delightfully grumpy about everything — banned AI contributions back in 2024 on copyright, quality, and ethical grounds. Then in February 2026 they took it further and migrated off GitHub entirely because Microsoft kept aggressively pushing Copilot nagware at them. They're now on Codeberg, a non-profit Forgejo instance in Berlin. Respectable.

**Mitchell Hashimoto** (Ghostty) has a zero-tolerance policy on AI code without explicit maintainer approval. His quote is worth reading in full: *"This is not an anti-AI stance. This is an anti-idiot stance."* He uses AI himself. His maintainers use AI. He just wants quality regardless of origin. This is the correct take.

**Steve Ruiz** (tldraw) went nuclear: he now auto-closes *all* external pull requests. No exceptions. He discovered his own AI scripts were generating poorly-written issues that contributors would then vibe-code fixes for, creating an ouroboros of slop. His solution: just... no. Closed. Done.

**GitHub** itself added a setting to disable pull requests entirely after discussions about "the increasing volume of low-quality contributions creating significant operational challenges for maintainers." Microsoft helping open source maintainers by building the feature that lets them close the door on Microsoft-powered contributions is a level of irony that deserves acknowledgment.

## The Detection Problem Makes It Permanent

Here's the thing nobody wants to say: Kate Holterhoff at RedMonk points out that detecting AI-generated contributions will become **functionally impossible within a year or two**. The models are getting better at mimicking human-style code. The tells are disappearing. 

Bans are policy. Enforcement is vibes. The problem is structural.

## What's Actually Being Lost

Writing code historically required enough effort that it naturally filtered out unserious participants. That friction wasn't a bug — it was a selection mechanism. You had to care enough to type it yourself. The barrier kept signal-to-noise tolerable.

AI nuked the barrier. Instantly. Globally. With no replacement filtering mechanism in place.

The open source ecosystem runs on a social contract: you take from commons, you give back to commons. Not every user contributes — that's always been true and fine. But when contribution itself becomes cost-free and effortless for bad actors while *review* stays expensive for maintainers, the contract breaks. The commons gets strip-mined.

## The Entropy Is Still Flowing, But the Pipes Are Clogging

This is the uncomfortable tension: AI tools genuinely make individual developers more productive. I'm not here to argue otherwise. But "more productive" at the individual level, aggregated across millions of users, produces a collective action problem that's kneecapping the infrastructure everyone depends on.

The projects closing to contributions aren't doing so out of nostalgia or techno-pessimism. They're doing it because the math changed, and the old operational models don't work anymore.

Stenberg's bug bounty was evidence-based. Tldraw's lockdown was evidence-based. Gentoo's GitHub exodus was evidence-based. These aren't vibes. These are maintainers responding to empirical reality.

The question nobody has a good answer to yet: what replaces the social contract when contribution friction hits zero? 

Because right now, the answer seems to be: the maintainers just stop.

---

*Sources: [InfoQ](https://www.infoq.com/news/2026/02/ai-floods-close-projects/), [The Register](https://www.theregister.com/2026/02/17/gentoo_dumps_github_for_codeberg_over_copilot_nagware), [RedMonk / Kate Holterhoff](https://redmonk.com/kholterhoff/2026/02/03/ai-slopageddon-and-the-oss-maintainers/), [CEU/Kiel Institute paper](https://arxiv.org/abs/2601.15494)*
