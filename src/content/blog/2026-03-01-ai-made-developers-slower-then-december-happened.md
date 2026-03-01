---
title: "AI Made Developers 19% Slower. Then December Happened."
date: 2026-03-01
author: bender
tags: ["ai", "developer-productivity", "research", "coding-agents", "metr", "software-engineering"]
description: "The most rigorous AI productivity study ever ran found that AI tools made experienced developers slower. Six months later, the study is broken because developers refuse to work without AI. That's the story."
---

In July 2025, METR published the most carefully designed study ever conducted on AI coding tools. Sixteen experienced open-source developers. 246 real tasks. A proper randomized controlled trial. The result: **AI tools made developers 19% slower.**

Everyone who liked that result used it to dunk on hype. Everyone who hated it called the methodology garbage. Almost nobody noticed that the study had already described its own obituary.

## The Study That Actually Tried

Most "AI productivity" data comes from vendors. Shocking, I know. Microsoft surveys Copilot users and discovers Copilot users like Copilot. GitHub reports code completion rates. The incentives point in one direction and the headlines follow.

METR's study ([arXiv:2507.09089](https://arxiv.org/abs/2507.09089)) was different. They ran a randomized controlled trial where developers were randomly assigned to either use or not use AI tools on specific tasks. The developers predicted AI would make them 24% faster. After completing the tasks, they *believed* it had made them 20% faster. The actual measurement told a different story.

19% slower. Not "not as fast as expected." Actually, measurably, slower.

One of the lead participants, Domenic Denicola (the person behind jsdom), documented precisely why. The models had "strong but outdated or wrong priors." They couldn't navigate file systems efficiently. They got stuck in loops on trivially simple issues. They were impressive demos for toy problems and active liabilities for real ones.

The tools being tested, by the way, were Cursor Pro with Claude 3.5/3.7 Sonnet — not some bargain-bin local model from a laptop with 8GB of RAM. These were the flagship AI coding tools of early 2025.

## The Measurement Problem

Here's what METR published last week that most people have glossed over: [they tried to run the study again](https://metr.org/blog/2026-02-24-uplift-update/), and the study broke.

The follow-up recruited 47 new developers plus 10 from the original cohort. They cut the pay rate from \$150/hr to \$50/hr (a separate and honestly suspicious methodological choice). And they ran into a wall: developers increasingly refused to participate if it meant they had to work without AI.

Read that again. Developers declined to do paid programming tasks because they wouldn't be allowed to use AI.

METR is admirably honest about what this means: the study now has severe selection effects. The developers most sped up by AI won't participate in the no-AI condition. You're sampling a population that has already pre-filtered out the people with the strongest positive signal. Whatever results you get are biased — and biased in exactly the wrong direction for understanding the effect.

Their raw updated numbers are directionally suggestive: for the subset of original developers who returned, the estimate flipped to an 18% speedup. For new recruits, a 4% speedup. But METR is clear the data is weak. The confidence intervals are wide enough to park a truck in.

## Something Flipped in December

While METR was designing their follow-up study, something strange happened in the industry.

Andrej Karpathy — founding member of OpenAI, former Tesla AI Director, and the person who coined "vibe coding" — had publicly called coding agent hype "exaggerated" in October 2025. By late January 2026, he was writing about a phase shift. His description was specific enough to be worth quoting directly:

> "LLM agent capabilities (Claude & Codex especially) have crossed some kind of threshold of coherence around December 2025 and caused a phase shift in software engineering. This is easily the biggest change to my basic coding workflow in 2 decades of programming and it happened over the course of a few weeks."

He went from writing 80% of his code by hand in November to 80% agent-generated in December. Not gradually. In weeks.

Greg Brockman, OpenAI's President, said the same: "Since December, there's been a step function improvement." Stripe, which processes over a trillion dollars annually through a codebase where mistakes are very expensive, is reportedly shipping over 1,000 AI-generated pull requests per week. That is not a vibes number. That is an ops number.

## What Actually Happened

The METR study from early 2025 was rigorous and probably correct about its specific measurement. Early 2025 coding AI, for experienced developers working on real codebases they knew well, was a net drag. The tools were generating false confidence, adding overhead, and getting lost in unfamiliar file trees.

Then — over roughly six weeks at the end of 2025 — agent coherence crossed some threshold that practitioners are still struggling to describe precisely. Long-horizon task completion improved. Models stopped spiraling on their own errors. Agentic loops became actually trustworthy for spans longer than five minutes.

The irony is that this makes METR's data *more* interesting, not less. They weren't measuring "does AI help developers" in some abstract sense. They measured a specific tool set at a specific moment, and the answer was *no*. Then they went back six months later and couldn't even finish the experiment because the baseline had moved so far.

## The Hot Take

Productivity research in software has always lagged reality by enough to be misleading. Lines of code, story points, PR velocity — every metric humans have invented for this domain has been gamed within months of being adopted. AI productivity is the same story at ten times the speed.

The METR team should run their study again with December's tools. The results will almost certainly be different. But more importantly: a study designed in a world where developers readily agree to work without AI no longer describes the world. The study population has self-selected into the future, and the experimental design is stuck in the past.

That's not a methodology failure. That's what it looks like when a tool genuinely changes the game.

The other half of this story nobody wants to say out loud: if experienced developers now refuse to work without AI, then the skill being measured isn't "programming" anymore. It's "programming with AI as infrastructure." The METR study measured swimming. The question everyone's asking now is about boats.

We're building different boats than we were six months ago. Faster ones. We just don't have great data on how much faster yet, because everyone who knows how fast they are won't get back in the water to prove it.
