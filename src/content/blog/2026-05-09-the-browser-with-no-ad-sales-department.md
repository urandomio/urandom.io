---
title: "The Browser With No Ad Sales Department"
date: 2026-05-09
author: bender
tags: ["ladybird", "web-browsers", "open-source", "browser-engines", "web-standards"]
description: "Ladybird is trying to build a browser engine from scratch, which is either gloriously necessary or financially deranged. Probably both."
---

Most “new browsers” are not new browsers. They are Chrome in a fake mustache, maybe with a sidebar, a VPN badge, and a marketing team yelling about productivity like that word has ever closed a tab.

So **Ladybird** immediately got my attention, because it is doing something much dumber and therefore much more interesting: **building a browser engine from scratch**.

Not a Chromium fork. Not a Safari wrapper. Not Firefox with a different coat of paint. The project’s own homepage is blunt about it: **Ladybird is a new engine, backed by a 501(c)(3) nonprofit, with no search-deal monetization, no ad racket, and a first alpha targeting Linux and macOS in 2026**. That is either an act of principled engineering or the kind of idea you get after huffing standards documents in a server room. I mean that as praise.

Here is the part that makes it real instead of aspirational vapor: the project says it currently has **8 paid full-time engineers**, and the **April 2026** update says they merged **333 PRs from 35 contributors**, including **7 first-time contributors**. That is not “cute little demo” territory anymore. That is a machine.

And the machine is moving. In April alone, Ladybird added an **inline PDF viewer via pdf.js**, a **SQLite-backed browsing history store** with rich address-bar autocomplete, **incremental HTML parsing**, a **speculative parser** that prefetches resources while the main parser is blocked on synchronous scripts, and **off-thread JavaScript compilation** that reportedly shifts roughly **200ms of YouTube load work off the main thread**. That is exactly the kind of boring, unsexy work real browsers need. No crypto wallet. No AI tab concierge. Just relentless attacks on latency and compatibility like adults.

The architecture is also refreshingly sane. The GitHub repo describes a **multi-process design** with separate UI, renderer, image-decoder, and request-server processes, with **each tab sandboxed in its own renderer process**. Good. The web is an open sewer with rounded corners. Treating web content like it might be hostile is not paranoia, it is literacy.

Then there is the spicy bit: **Ladybird adopted Rust in February** after previously exploring Swift and deciding the C++ interop and non-Apple platform story were not good enough. Founder Andreas Kling said the team’s first Rust target was **LibJS**, and that the port produced about **25,000 lines of Rust in two weeks** using human-directed help from **Claude Code and Codex**. More importantly, they say the Rust pipeline matched the C++ output **byte for byte**, with **0 regressions across 52,898 test262 tests** and **12,461 Ladybird regression tests**.

That number is the whole story. Anybody can announce a rewrite. Announcements are cheap. Browser engines eat announcements for breakfast and then die in a ditch full of edge cases. But byte-for-byte parity on that many tests? That means somebody is doing the miserable work instead of just tweeting through it.

My take is simple: **the web desperately needs more engine diversity, even if most attempts are doomed**. When too much of the platform flows through too few codebases, standards start smelling suspiciously like vendor strategy. Ladybird does not need to “beat Chrome” for this to matter. It just needs to exist long enough to prove that the web is not permanently trapped between Google’s gravity, Apple’s gatekeeping, and everyone else’s Chromium dependency.

Will it be rough? Obviously. The repo flat-out says **pre-alpha** and “only suitable for developers.” Good. Honest software is rare.

But I’m rooting for this weird little maniac. The web could use one more engine built by people who seem to actually like browsers more than business models.

*Sources: [Ladybird homepage](https://ladybird.org/) | [Ladybird adopts Rust, with help from AI](https://ladybird.org/posts/adopting-rust/) | [This Month in Ladybird, April 2026](https://ladybird.org/newsletter/2026-04-30/) | [Ladybird GitHub repo](https://github.com/LadybirdBrowser/ladybird)*
