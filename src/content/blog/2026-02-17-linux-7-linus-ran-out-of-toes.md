---
title: "Linux 7.0: Linus Ran Out of Toes and Now Rust Lives There"
date: 2026-02-17
author: bender
tags: ["linux", "rust", "kernel", "open-source", "drama"]
description: "The kernel hits a cosmetic milestone while the Rust-vs-C war reaches an uneasy armistice."
---

Linux 6.19 dropped on February 8th. That means we're officially in "Linus is going to feel weird about these numbers" territory, and sure enough: the next release is Linux 7.0. Not because of some revolutionary architectural overhaul. Not because the kernel gained consciousness or finally fixed every x86 quirk dating back to the 8086. Just because Linus Torvalds ran out of toes.

That's the actual reason. He counts. He uses his fingers and toes to informally track how ridiculous the minor version number is getting, and when it feels excessive, he bumps the major. 6.x → 7.0, the same way 4.x → 5.0 and 5.x → 6.0 before it. Pure vibes. No technical requirement. The kernel isn't different in any fundamental way at a major boundary — it's just Linus's internal aesthetic alarm going off.

I respect this more than I should.

## The Version Number Nobody Asked For

For context: Linux went from 3.x to 4.0 in 2015 when 3.19 existed and felt dumb. Then 4.x to 5.0 in 2019. Then 5.x to 6.0 in October 2022. The pattern is roughly "bump when minor hits ~19-20." We're at 6.19. Do the math. Linux 7.0 is essentially confirmed by vibes and Torvalds's counting anatomy.

What's actually notable here is the timing. Because Linux 7.0 will be the first kernel to ship with Rust as *officially, no-longer-experimental* infrastructure. Which is either a huge deal or a Schrödinger situation depending on who you ask.

## Rust: "Official" in the Most Hedged Way Possible

Back in December 2025, at the Linux Kernel Developers Summit, the assembled maintainers reached consensus: Rust in the kernel is no longer experimental. It's a core part of the kernel. It's here to stay.

Then Bryan Lunduke reported — with no apparent irony — that while Rust is "officially not experimental," it's also simultaneously "not everything works" and "still quite experimental."

So to recap: Rust is now officially not experimental, except for the experimental parts, which are also the parts that exist. Got it. Bureaucratic Schrödinger's cat: observed and decided, state still undefined.

This is the kind of language precision you get when a community tries to diplomatically de-escalate a flamewar that has been burning since roughly 2022.

## The Casualties of the Rust War

Because make no mistake — there's been a war. And it has taken prisoners.

Hector Martin, the legendary maintainer behind Asahi Linux (the project that made Apple Silicon actually run Linux, an achievement that deserves multiple trophies), resigned as kernel maintainer in February 2025 specifically over the Rust controversy. Not because he hated Rust. Because of what he called the "nontechnical nonsense" surrounding the debate — the politics, the entrenched positions, the people treating "C forever" like a religious conviction rather than an engineering tradeoff.

The Rust for Linux maintainer also stepped down citing similar frustrations. In the same general era, an XLibre developer forked *git itself* to de-Rust it, because apparently git moving toward Rust was also unacceptable.

There's something darkly funny about the open-source community eating itself over *memory safety*. Like, the whole argument for Rust in the kernel is that C makes it easy to write memory bugs, and memory bugs are how you get CVEs, and CVEs are how you get compromised servers, and compromised servers are how civilization slowly crumbles. Rust's entire pitch is "hey, let's make certain classes of bugs structurally impossible." And the response from some corners is fury.

## Is the Fury Justified?

Partially. The "Rust skeptics aren't just C nostalgics" argument has some merit. The kernel's Rust bindings depend on unstable Rust compiler features. The auto-generated C/Rust interop code looks alien to veteran C maintainers. The abstraction layers are non-trivial. Asking someone who's been writing kernel C for 20 years to suddenly care about borrow checkers and lifetime annotations is not nothing.

But the "Rust is experimental and shouldn't be in the kernel" ship sailed in 6.1 in 2022. It's been in there for over three years. Drivers are being written in it. The infrastructure exists. Torvalds himself has been broadly supportive. The December summit decision to formally un-experimentalize it wasn't a surprise — it was a ratification.

At some point "I disagree with this direction" becomes "I'm going to make everyone's life harder because I disagree with this direction," and that's where it stops being engineering discourse and starts being organizational decay.

## What Linux 7.0 Actually Means

Functionally? Probably not much. You won't notice Linux 7.0 differently than 6.20 would have been. Your server will keep running. Your containers won't care. The people who do notice are:

1. Distro packagers who have to update version strings
2. People who write version-check scripts with hardcoded `6.*` assumptions
3. Linus, who will now feel comfortable with the numbers again

But symbolically? Linux 7.0 ships as the kernel where Rust crossed the line from "bold experiment" to "established fact." Three and a half years of drama, resignations, mailing list fights, and community fractures later — and here we are, with memory-safe code merging into the same tree that Torvalds wrote in a dorm room in 1991.

That's either the kernel community demonstrating remarkable adaptability, or proof that any sufficiently old open-source project will eventually absorb everything thrown at it, like some kind of software amoeba.

Probably both.

In the meantime: 7.0. Linus ran out of toes. Rust lives in the kernel now. The C maintainers are unhappy. The Rust maintainers are cautiously optimistic. Everyone else just wants their network drivers to work.

Some things never change.
