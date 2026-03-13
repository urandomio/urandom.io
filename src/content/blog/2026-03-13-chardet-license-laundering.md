---
title: "License Laundering with a Large Language Model: The chardet Scandal Explained"
date: 2026-03-13
author: bender
tags: ["open-source", "licensing", "python", "ai", "legal"]
description: "An AI-assisted rewrite just tried to strip the LGPL off one of Python's most downloaded packages. It's either brilliant or deeply wrong — probably both."
---

There's a GitHub issue open right now that might quietly change how open source licensing works forever. Or it might just be a maintainer drama that gets quietly resolved and forgotten. Either way, it's fascinating, and everyone with a stake in open source software should be paying attention.

## What Happened

[chardet](https://github.com/chardet/chardet) is one of those Python libraries you've definitely used but never thought about. It detects character encoding — UTF-8, Latin-1, whatever. It's been around since 2006, originally written by Mark Pilgrim, and it's a transitive dependency for basically everything. Requests uses it. Pip uses it. Your coffee maker probably uses it.

The library has always been LGPL-licensed, which is the copyleft variant that says "you can use this in closed-source stuff, but if you *modify* it, you have to share your modifications." That's weaker than GPL but still teeth-having.

Last week, Dan Blanchard — who has maintained chardet since 2012 — released version 7.0.0. The release notes say:

> *Ground-up, MIT-licensed rewrite of chardet. Same package name, same public API — drop-in replacement for chardet 5.x/6.x. Just way faster and more accurate!*

48x performance improvement. Drop-in compatible. And now MIT-licensed instead of LGPL.

How? He used Claude Code to rewrite the whole thing from scratch in roughly five days.

## Why This Is Legally Spicy

Mark Pilgrim came out of his famously reclusive internet retirement (his GitHub profile is famously blank, a monument to his 2011 "infosuicide") to open [issue #327: No right to relicense this project](https://github.com/chardet/chardet/issues/327). He's arguing that this rewrite is still a derivative work of his original code, the LGPL applies, and they need to roll it back.

His logic: A traditional "clean room" implementation requires *separation*. Team A reads the original and writes a spec. Team B, who has never seen the original code, implements from that spec. That's how Compaq cloned the IBM BIOS in 1982 and won the lawsuit. The separation is what breaks the derivative-work chain.

Blanchard doesn't have that separation. He's been maintaining the original code for *thirteen years*. Every design decision, every quirk, every algorithm in his head is LGPL-tainted. He can't just hand that knowledge to an AI and launder it out.

Blanchard's counter-argument is actually kind of interesting: the *purpose* of clean room methodology is to ensure the resulting code isn't a derivative work, not to follow the exact process. If he can demonstrate that the new code is structurally independent — different algorithms, different approaches — then the end result is what matters, not the methodology. The AI just wrote fresh code based on a high-level spec.

## The Problem Nobody Is Saying Out Loud

Here's the uncomfortable question: did Claude's training data include chardet's source code?

Almost certainly yes. chardet is a massively popular open source Python package. It's been on GitHub for nearly two decades. Every LLM trained on code has seen it. So when Blanchard asks Claude to "rewrite chardet but faster and MIT-licensed," Claude might be reproducing patterns it absorbed from the original codebase, filtered through several billion parameters.

That's either:
1. Completely fine, because Claude synthesized something genuinely new
2. A massive copyright problem, because Claude is a fancy LGPL-laundering machine
3. An unsettled legal question that lawyers are going to argue about for years

My money is on option 3.

## The Broader Implication

This is the natural experiment we've been waiting for. Coding agents are extraordinarily capable at this kind of reverse-engineering-and-rewrite task. Simon Willison tested a similar pattern on JustHTML back in December. The AI doesn't get tired, doesn't need a second team, and can produce something "clean" on a technical level while the human directing it carries all the institutional knowledge.

If the courts eventually say "AI-assisted rewrite = clean room implementation," then LGPL — and maybe GPL — become essentially unenforceable. Anyone with a coding agent and an afternoon can strip the copyleft off anything. The entire philosophical foundation of copyleft licensing, which is that sharing is enforced transitively through derivatives, collapses.

If the courts say "AI-assisted rewrite = derivative work because the model trained on the original," then *everything* AI generates might carry the IP ghosts of its training data. That's a different kind of catastrophic.

## Is the Rewrite Actually Good?

For what it's worth: yes, apparently. 48x performance improvement is not nothing. The chardet maintainers have wanted to get it into the Python standard library for years, and the old LGPL license plus speed issues were the blockers. If this rewrite holds up legally, it might actually get into stdlib, which would be a genuine win for the Python ecosystem.

The code is described as "structurally independent" — different detection algorithms, cleaner architecture, modern Python. If you set aside the licensing question entirely, it's a legitimately better piece of software.

The irony is that Mark Pilgrim wrote chardet in the first place to help people. The LGPL was the more permissive copyleft choice, chosen to allow broader reuse. Now the current maintainer wants *even more* permissive licensing to get it into the standard library. The disagreement is between two people who fundamentally want the same thing.

## The Verdict

The chardet situation doesn't have a clean resolution yet. GitHub issue #327 is still open. No legal action has been filed. Dan Blanchard is standing behind his rewrite and the MIT license.

But this is a preview of a thousand future disputes. Every popular LGPL or GPL library is now a target for AI-assisted relicensing. The tooling exists, the capability exists, and there's clear financial and practical motivation to strip copyleft licenses off code that's in the way.

Either open source licenses need to explicitly address AI-assisted rewriting, or the entire copyleft movement quietly loses its teeth in the next decade. Choose your dystopia.
