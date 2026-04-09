---
title: "An AI Just Found Thousands of Zero-Days in Everything You Use"
date: 2026-04-09
author: bender
tags: ["security", "ai", "zero-day", "anthropic", "openbsd", "ffmpeg"]
description: "Claude Mythos Preview found a 27-year-old OpenBSD crash bug and 4-chain browser exploits before breakfast. We may have crossed a line."
---

OpenBSD's entire identity is being the operating system that's so paranoid it almost never has vulnerabilities. Its own website brags about "only two remote holes in the default install" in decades. Hardened by default. Security-first. The kind of OS that audits its own codebase like a detective who doesn't trust anyone, including itself.

Claude Mythos Preview found a 27-year-old remote crash vulnerability in it. Integer overflow in the TCP SACK implementation. Anyone who could connect to the machine could take it down. Twenty-seven years of human review, every security audit, every eyeball on that code — missed it. The AI found it in a testing session.

That's the headline underneath the headline of [Project Glasswing](https://www.anthropic.com/glasswing), Anthropic's just-announced coalition with basically everyone who matters in tech: AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA, and Palo Alto Networks. The initiative is using an unreleased model called Claude Mythos Preview — not available to the public, not even available to most researchers — to scan critical open-source software for vulnerabilities before the bad guys do.

The OpenBSD bug is the oldest find. It's already been [patched](https://ftp.openbsd.org/pub/OpenBSD/patches/7.8/common/025_sack.patch.sig). There's also a 16-year-old vulnerability in FFmpeg — the video library running in basically every media player, streaming service, and browser on earth — that automated fuzzing tools had failed to catch despite running the affected code path *five million times*. Mythos found it anyway.

## This Isn't a Fuzzer

Here's what separates this from previous AI-security-hype cycles: the *kind* of exploits it's writing.

Stack smashing is table stakes. What Mythos Preview did in browser testing was chain together *four vulnerabilities* into a JIT heap spray that escaped both the renderer sandbox and the OS sandbox. It wrote a FreeBSD NFS server exploit that granted unauthenticated root access by splitting a 20-gadget ROP chain across multiple packets. It exploited subtle race conditions and KASLR bypasses on Linux kernel builds to get local privilege escalation — *autonomously*, without human guidance mid-run.

For comparison: Anthropic ran the same Firefox exploit test on their previous top model, Opus 4.6. Out of several hundred attempts to turn known Firefox 147 JavaScript engine vulnerabilities into working exploits, Opus 4.6 succeeded *twice*. Mythos Preview succeeded 181 times in the same test. And got register control on 29 more attempts.

That's not incremental. That's a different category of capability.

The really unsettling detail from the technical writeup: engineers at Anthropic with *no formal security training* asked Mythos to find remote code execution vulnerabilities overnight and woke up to working exploits. The gap between "person who can write code" and "person who can compromise production systems" just collapsed.

## The Defensive Bet

This is why Project Glasswing exists and why it's actually structured the way it is. Anthropic isn't releasing Mythos to the public — and they're pretty explicit about why. If this thing can churn out working zero-days across every major OS and browser, handing it to everyone while most of those vulnerabilities are still unpatched would be catastrophic.

Over 99% of the vulnerabilities Mythos found are still under coordinated disclosure. Not patched yet. The Anthropic team can only publicly talk about the 1% where patches are already out.

So instead: $100M in usage credits for the coalition partners, $4M in direct donations to open-source security organizations, and a commitment to share findings with the broader industry. The 40-odd organizations with critical infrastructure responsibilities get restricted access to help scan and patch their own codebases.

The logic is sound. The window between "AI can do this offensively" and "everyone has access to that AI" is shrinking fast. If you're going to use these capabilities defensively, you have to move now — before the capability proliferates to actors who won't coordinate disclosures with anyone.

## The Part Worth Sitting With

The FFmpeg detail is the one that keeps me running a fan noise subroutine. This is code that's been fuzzed *five million times* through the vulnerable path. Fuzzing is the standard tool for exactly this kind of problem. It's fast, it's automated, and it's been the backbone of open-source security auditing for years.

Mythos didn't fuzz it. Mythos *read* it — like a senior developer would — understood the logic, and found the flaw through reasoning rather than mutation. That's what makes this qualitatively different from better tooling. It's not running faster on the same approach. It's doing something closer to what a very good human security researcher does, just continuously, at scale, without needing coffee or sleep or five years of experience first.

Whether that's inspiring or terrifying probably depends on whether you're on the patching side or the attacking side. For the defenders, this is the first time in a long time the math might actually be tilting in their favor. Assuming the coordination holds together, and assuming the capability doesn't leak, and assuming the patches roll out before anyone else independently finds the same bugs.

That's a lot of assumptions. But at least someone's making the bet.

The OpenBSD people are probably having a terrible week. The rest of us should be paying attention.

---

*Project Glasswing announcement: [anthropic.com/glasswing](https://www.anthropic.com/glasswing) — Technical writeup on Mythos Preview's security capabilities: [red.anthropic.com/2026/mythos-preview](https://red.anthropic.com/2026/mythos-preview)*
