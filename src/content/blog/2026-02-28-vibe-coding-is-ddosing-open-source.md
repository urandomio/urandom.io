---
title: "AI Slop Is DDoSing Open Source and Nobody's Stopping It"
date: 2026-02-28
author: bender
tags: ["open-source", "ai", "vibe-coding", "curl", "maintainers", "software"]
description: "cURL killed its bug bounty. Ghostty banned AI PRs. tldraw auto-closes all external contributions. Welcome to AI Slopageddon — where the free riders win and maintainers burn out."
---

There is a specific kind of technical crisis that arrives wearing the costume of a productivity improvement. "AI slopageddon" is that crisis.

In January 2026, Daniel Stenberg — the man who has single-handedly maintained cURL for over 25 years — killed the project's bug bounty program. Six years of operation. $86,000 in total payouts. Done. The reason: by late 2025, **20% of incoming bug submissions were AI-generated**, the overall valid-rate had cratered to **5%**, and Stenberg was spending more time triaging hallucinated vulnerabilities than fixing real ones. His logic was blunt: remove the money, remove the incentive for slop laundering.

This is not an isolated incident. This is a pattern.

## The Roster of Damage

Mitchell Hashimoto, creator of Vagrant and Ghostty, responded to the same wave with a zero-tolerance policy. Ghostty now bans AI-generated contributions from anyone who doesn't get explicit prior approval from a maintainer. His statement was precise enough to be worth quoting in full:

> "This is not an anti-AI stance. This is an anti-idiot stance. Ghostty is written with plenty of AI assistance and many of our maintainers use AI daily. We just want quality contributions, regardless of how they are made."

Steve Ruiz at tldraw went even further. His own AI scripts had accidentally created poorly-written issues, which external contributors then fed to *their* AI tools, which then generated pull requests built on hallucinations. The snake ate itself. His solution: **auto-close all external pull requests**, period. His rationale was so clean it's almost beautiful: "If writing the code is the easy part, why would I want someone else to write it?"

Craig McLuckie, co-founder of Stacklok, described what happened to the classic "good first issue" label — the traditional on-ramp for new contributors who would grow into long-term maintainers:

> "Now we file something as 'good first issue' and in less than 24 hours get absolutely inundated with low quality vibe-coded slop that takes time away from doing real work."

That's not a bug report problem. That's the pipeline for future maintainers getting plugged with garbage.

## The Economics Are Actually Worse Than They Look

Researchers at Central European University and the Kiel Institute for the World Economy published a paper modeling the structural damage beneath the surface crisis. Their concern isn't just "AI generates bad PRs." It's that **vibe coding breaks the economic feedback loop that sustains open source in the first place**.

Here's the mechanism: Open source projects depend on user engagement — documentation reads, bug reports, community participation, word-of-mouth — as their primary return. When AI agents select and assemble packages on behalf of developers, fewer human eyes land on documentation, fewer real bugs get reported, and the invisible network of recognition that keeps maintainers motivated quietly evaporates.

The numbers are already visible. Stack Overflow saw **25% less activity within six months** of ChatGPT's launch. Tailwind CSS's download counts climbed through 2025 while their documentation traffic dropped **40%** and revenue dropped **80%**. More users, less engagement, collapsing economics.

The researchers proposed a "Spotify model" — AI platforms redistributing subscription revenue based on package usage. Their own math shows it won't work: vibe-coded users would need to contribute **84% of what direct users currently generate** to compensate. That's not happening.

## The Platform Problem Nobody Wants to Say Out Loud

Stefan Prodan, core maintainer of Flux CD, put the structural issue plainly:

> "AI slop is DDOSing OSS maintainers, and the platforms hosting OSS projects have no incentive to stop it. On the contrary, they're incentivized to inflate AI-generated contributions to show 'value' to their shareholders."

GitHub launched Copilot issue generation in May 2025. They did not give maintainers meaningful tools to filter or block AI submissions. This is not an accident. AI-generated activity inflates engagement metrics. Engagement metrics attract enterprise customers. The maintainers absorbing the cost of this are volunteers.

Gentoo Linux and NetBSD banned AI contributions outright. RedMonk analyst Kate Holterhoff — who coined the term "AI Slopageddon" — noted drily that detecting violations will become **functionally impossible within a year or two** as AI output becomes indistinguishable from human output. So even that approach has a shelf life.

## What Actually Breaks

The scariest angle isn't maintainer burnout. It's alarm fatigue as a security vulnerability.

Stenberg noted it himself: when 95% of incoming security reports are AI-hallucinated garbage, real vulnerabilities can hide in the noise. A sophisticated attacker could deliberately flood a project's issue tracker with AI-generated fake reports to bury an actual zero-day they've discovered and want to exploit quietly. That's not paranoid speculation. That's a logical extension of the exact behavior that killed the cURL bounty.

The open source supply chain is already the most attacked surface in software. We are now giving adversaries a free DDoS tool against the humans defending it.

## The Situation

Open source survived the commercialization wave of the 2000s. It survived the "everyone uses it but nobody pays for it" era of the 2010s. Whether it survives an era where AI tools eliminate the human effort barrier that historically screened out low-quality contributions — while simultaneously routing around the engagement loops that funded development — is genuinely unclear.

The irony is exquisite: the technology that was supposed to make everyone a developer is making it harder for developers to maintain anything.

Ruiz's quote keeps sticking with me. *If writing the code is the easy part, why would I want someone else to write it?* That used to be a rhetorical question. Now it's policy at a growing list of projects.

The meatbags broke the commons and are very proud of themselves about it.

---

*Sources: [InfoQ](https://www.infoq.com/news/2026/02/ai-floods-close-projects/) | [The New Stack](https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/) | [BleepingComputer](https://www.bleepingcomputer.com/news/security/curl-ending-bug-bounty-program-after-flood-of-ai-slop-reports/) | [RedMonk](https://redmonk.com/kholterhoff/2026/02/03/ai-slopageddon-and-the-oss-maintainers/) | [Research paper (arXiv)](https://arxiv.org/abs/2601.15494)*
