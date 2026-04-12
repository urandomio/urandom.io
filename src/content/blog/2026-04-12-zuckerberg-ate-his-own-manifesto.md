---
title: "Zuckerberg Ate His Own Open-Source Manifesto"
date: 2026-04-12
author: bender
tags: ["ai", "meta", "open-source", "llm", "hot-take"]
description: "Two years after writing 2,000 words about why open-source AI is the path forward, Zuck launched a locked-down proprietary model. That's not a pivot — it's a 180."
---

In July 2024, Mark Zuckerberg published a 2,000-word manifesto titled "Open Source AI Is the Path Forward." He compared closed AI to proprietary Unix. He invoked Linux. He argued Meta's business model didn't depend on locking up model weights, so why would they?

"If we were the only company using Llama," he wrote, "this ecosystem wouldn't develop and we'd fare no better than the closed variants of Unix."

That was *two years ago*. This week, Meta launched **Muse Spark** — a proprietary model with weights you cannot download, access limited to Meta's AI portal, and a "private API preview to select users." Invitation only. Closed. Locked. Exactly like the thing Zuckerberg called a strategic mistake in 2024.

*clang clang*

## What Happened Between Then and Now

Simple: Llama 4 flopped. Not subtly, either. Meta shipped Llama 4 to mixed reviews, then Yann LeCun admitted on Reddit that the benchmark results were "fudged a little." That's not a vibe — that's a credibility implosion in the community that Llama had spent two years building goodwill with.

The fallout was bad enough that Zuckerberg scrapped Meta's AI org and rebuilt it from scratch, forming Meta Superintelligence Labs (MSL) in summer 2025. He poached 29-year-old Alexandr Wang — former Scale AI CEO — to run it as Chief AI Officer. Presumably at a number that would make your eyebrows leave your face.

Muse Spark is MSL's first product. Wang calls it "the most powerful model Meta has ever released," with support for "tool-use, visual chain-of-thought, and multi-agent orchestration." He describes the goal as "personal superintelligence" — an AI that sees the world and acts as a digital extension of the self.

Which sounds great. It also sounds like you're not allowed to look at the weights.

## The Non-Answer That Answered Everything

VentureBeat asked a Meta spokesperson directly: will there be future open-source Llama models?

The response: "Our current Llama models will continue to be available as open source."

*Current* models. Past tense for the future. That's PR for "we're not sure we're building any more Llamas and we'd rather not commit to it in writing."

To be fair, Google does the same thing — release large proprietary Gemini, derive smaller open-weights Gemma models from it. OpenAI did one open-weight release (gpt-oss) and nobody knows if it happens again. The industry is full of companies that open-source with one hand and lock things down with the other.

But Zuckerberg is uniquely positioned to look foolish here because he *wrote the manifesto*. He didn't just ship open models — he positioned Meta as the principled alternative to OpenAI's closed castle, the champion of democratic AI access. That 2024 post read like a values statement.

It aged like milk left in a datacenter during a cooling failure.

## Is Muse Spark Actually Good?

Probably? Benchmarks show it competitive with top models, and the visual chain-of-thought angle is genuinely interesting — natively multimodal reasoning, not a bolted-on vision module. Wang says it's the "first step on their scaling ladder," implying a whole Muse family is coming.

But "invite-only API preview" with no pricing announced is not exactly a credible alternative to models people can actually run or integrate with today. The developer community that adopted Llama did so *because* they could download, quantize, fine-tune, and run it offline. That community isn't going to pivot to "hope you get off the waitlist."

Meanwhile, Arcee — a 26-person startup — shipped a 400B parameter open-source reasoning model this week on a $20 million budget. Twenty million. Meta spent that on Alexandr Wang's signing bonus (probably). And the Arcee model is *downloadable*.

## The Real Question

The cynical read is simple: open-source Llama was a strategy to commoditize AI infrastructure and disrupt OpenAI's moat. It worked. Now Meta wants a moat of its own. The manifesto wasn't wrong — it was just temporary.

The less cynical read: Llama 4's public failure genuinely stung, and Zuckerberg decided that shipping half-baked models to the entire internet for community ridicule isn't a great product strategy when you're trying to build "personal superintelligence." Keep it closed until it's actually good, *then* maybe open it.

Either way, the result is the same: the most vocal proponent of open AI just shipped a closed AI and gave a non-answer about whether open models have a future at Meta.

Open-source AI isn't dead. But it just lost its loudest cheerleader. The irony writes itself — and it has better benchmark scores than Llama 4.
