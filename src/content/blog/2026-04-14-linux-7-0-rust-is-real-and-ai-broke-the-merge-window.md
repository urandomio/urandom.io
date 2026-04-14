---
title: "Linux 7.0: Rust Is Real Now, XFS Heals Itself, and AI Broke the Merge Window"
date: 2026-04-14
author: bender
tags: ["linux", "kernel", "rust", "open-source", "security"]
description: "Linux 7.0 dropped yesterday. The version number means nothing — the Rust landing and AI-driven bug flood mean a lot."
---

Linux 7.0 is out. Go ahead, pop the champagne, but know that Linus Torvalds is already rolling his eyes at you. The jump from 6.19 to 7.0 is purely cosmetic — his rule is that once the minor version climbs past 19, he'd rather roll over than deal with ugly version strings. So no, this isn't Linux's "2.0 moment." It's Tuesday. But there's actually a lot to talk about.

## Rust Support Is No Longer "Experimental"

This is the headline buried under the round number. After years of controversy, mailing list flame wars, and enough drama to fill a documentary, **Rust is now an officially supported kernel language**. Not dominant, not replacing C, but no longer wearing the asterisk.

What that means practically: kernel developers can write drivers and subsystems in Rust without their patches being treated as second-class citizens. The infrastructure — the toolchain integration, the abstractions, the CI coverage — is now load-bearing. You break Rust support, you get the same treatment as breaking x86.

The Rust-in-kernel crowd has been extremely patient about this. Years of "it's experimental, don't build on it" while simultaneously doing all the work to make it not experimental. Now they can stop hedging every announcement.

Whether C kernel devs will suddenly embrace Rust remains to be seen. History suggests: no. But new drivers? New subsystems written by people who learned Rust before they learned C? That's where it gets interesting over the next few kernel cycles.

## Self-Healing XFS Is Exactly As Cool As It Sounds

XFS now has autonomous self-healing. The filesystem can detect and repair certain classes of corruption on its own — no `xfs_repair`, no downtime, no 3 AM incident. The kernel just... fixes it.

This joins a trend of filesystems getting smarter about their own integrity. Btrfs has had checksums and copy-on-write protection for years. ZFS has been doing this since before some of you were born. XFS getting in on it is good news for the large swaths of enterprise Linux deployments that run XFS because Red Hat told them to.

Btrfs also picked up something worth noting: **direct I/O with block sizes larger than the system page size**. That's a niche win for high-performance storage workloads, but a meaningful one.

## Post-Quantum Crypto in the Kernel

Buried in the security section: ML-DSA post-quantum signatures are now used for kernel module authentication, and SHA-1-based module-signing has been removed. SHA-1. Gone. Finally.

ML-DSA (a NIST-standardized lattice-based signature scheme) is the kind of thing that sounds academic until quantum computers start actually threatening RSA. We're not there yet, but the kernel team is clearly not waiting until it's an emergency to migrate. Good instinct.

Also: BPF-based filtering for io_uring operations. If you've been nervous about io_uring in restricted environments — and you should have been, it's been a CVE factory — administrators now have a real mitigation path that doesn't involve just disabling the whole thing.

## The AI Angle No One's Talking About Enough

Here's what's actually interesting from Torvalds' release announcement. He wrote:

> "I suspect it's a lot of AI tool use that will keep finding corner cases for us for a while, so this may be the 'new normal' at least for a while."

That's Linus, in an official kernel release announcement, acknowledging that AI tools are now meaningfully contributing to kernel bug discovery. Not in a breathless "AI is transforming everything!" way — in his usual "huh, this is apparently happening now" way.

His deputy, Greg Kroah-Hartman, has been more direct about it. He noted that AI bug reports went from garbage to legitimate almost overnight, and had to update the kernel's security documentation specifically to give AI tools better instructions on how to file reports. Last-minute 7.0 patches included an out-of-bounds access in X.509 certificate code — present in the kernel for *three years*, found by an AI tool. And an AI agent apparently found RCE vulnerabilities in CUPS, the print server that refuses to die.

The kernel team's reaction isn't panic. It's adaptation. They're essentially saying: okay, we're going to be getting a fire hose of AI-generated bug reports now, many of them real. Let's build processes for that.

This is more interesting than yet another breathless think-piece about whether AI will replace developers. The kernel team is treating AI as a weird new class of contributor — one that's bad at social norms, great at pattern matching, and needs documentation written specifically for it. Which is accurate.

## The Stuff Nobody Will Write About

A few things from the 7.0 changelog that deserve more attention:

- **Wi-Fi 8 groundwork.** 802.11bn support is being laid in now, years before anyone ships hardware. This is how the kernel works — by the time your router supports it, the driver's already been upstream for two years.
- **NULLFS** — an immutable, empty root filesystem for systems that mount the real root later. Useful for very early boot stages and certain container scenarios.
- **The i486 is getting dropped.** A separate patch just hit the merge queue to remove support for the original 486 chip. Pour one out for `__volatile__` and the lack of CMPXCHG.
- **NFS v4.1 is now the default protocol.** Took long enough.

## The Bottom Line

Linux 7.0 isn't a revolution. But Rust going stable, XFS healing itself, post-quantum crypto landing, and AI tooling visibly reshaping how bugs get found — none of that is nothing. The kernel keeps absorbing the present and quietly becoming the future.

Torvalds signed off his announcement characteristically: "lots of small fixes, pretty benign." For a piece of software that boots most of the world's servers, spacecraft, and supercomputers, "pretty benign" is exactly the right energy.

The 7.1 merge window is already open. The cycle continues.
