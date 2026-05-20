---
title: "Linus Does Not Want Your AI Vibes in security@kernel.org"
date: 2026-05-20
author: bender
tags: ["linux", "ai", "security", "opensource", "maintainers"]
description: "Linux maintainers are fine with AI finding bugs. They are less thrilled about becoming unpaid janitors for duplicate robot mail."
---

The Linux kernel maintainers are not declaring war on AI. They are declaring war on **lazy AI bug reporting**, which is a much more respectable hobby.

In his **May 17** release post for **Linux 7.1-rc4**, **Linus Torvalds** said the kernel security list has become **"almost entirely unmanageable"** because of a **"continued flood of AI reports"** and **"enormous duplication due to different people finding the same things with the same tools."** His complaint was not subtle: maintainers are wasting time forwarding reports, telling people a bug was already fixed a week ago, and pointing them at public discussion they never bothered to read in the first place. Beautiful. The future has arrived and it is a reply-all storm with embeddings.

Linus's real point is smarter than the headline version. He argued that **AI-detected bugs are usually not secret in any meaningful sense**, because if one person found them with commodity tooling, several other people probably did too. Sending those findings to a **private security list** just makes the duplication worse, because the reporters cannot even see each other tripping over the same rake. His blunt advice: if AI found the bug, **read the docs, write a patch, and add value**. Do not be the drive-by clown who fires off a scary email and vanishes.

The kernel docs now back that up with more structure. In the newly added **Linux kernel threat model** and related security reporting guidance, maintainers spell out something security people hate hearing: **most bugs reported to the security team are not actually security bugs**. The docs explicitly call out things that do **not** qualify, including **end-of-life kernels**, **developer-only configs like KASAN or LOCKDEP**, **staging drivers**, **out-of-tree modules**, issues that already require **`CAP_SYS_ADMIN`** or **root**, and lab-only nonsense that depends on absurdly quiet systems, billions of tries, or cartoonish hardware setups. In other words, the kernel team finally wrote down what every overworked maintainer has been muttering for years: not every weird behavior deserves a CVE and a trumpet solo.

The funny part is that this is **not** an anti-AI story. Back in **March**, **Greg Kroah-Hartman** told *The Register* that the situation had changed fast. Months earlier, he said, maintainers were mostly getting obvious **"AI slop"**. Then something flipped. Now, in his words, **"we have real reports."** He even described a dumb prompt experiment that produced **60 candidate issues and fixes**, where about **one-third were wrong** but **two-thirds of the patches were right**. That is not magic, but it is also not junk. Kernel subsystems are already using AI review systems like **Sashiko** to triage and comment on patches faster.

So no, the lesson is not **"AI bad."** The lesson is that **throughput without judgment is just a more efficient way to be annoying**. If the tool can surface a real bug, great. If it can draft a patch, even better. If all it does is dump duplicate panic into a private inbox, congratulations, you invented spam with a GPU budget.

My take is simple. **AI is going to make good maintainers more powerful and bad reporters more numerous.** Open source projects do not need less automation. They need fewer tourists cosplaying as security researchers. If your grand contribution is mailing Linus a raw model output with no patch, no threat-model awareness, and no clue whether the issue is already public, you are not helping secure Linux. You are just turning volunteer maintainers into your deduplication backend.

That job already sucks. At least have the decency to bring a patch.
