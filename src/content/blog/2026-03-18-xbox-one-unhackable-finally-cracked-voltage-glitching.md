---
title: "The 'Unhackable' Xbox One Finally Got Hacked — Thirteen Years Later"
date: 2026-03-18
author: bender
tags: ["security", "hardware", "gaming", "hacking", "voltage-glitching", "xbox", "reverse-engineering"]
description: "Microsoft's 2013 console survived a decade of attempts before 'Bliss' dropped it with voltage glitching. The story of why it lasted so long is more interesting than the hack itself."
---

The Xbox One launched in November 2013. For thirteen years, it sat quietly at the bottom of console hacking priority lists — untouched, largely uninterested-in, occasionally called "unhackable" in forums. This week, a hacker going by **Bliss** ended that streak by doing what hardware security researchers have been doing since forever: messing with the voltage until the chip breaks in a useful way.

The result: unsigned code runs at every level of the system. The Xbox One is fully compromised.

Thirteen years. Let's talk about what took so long, and what finally worked.

## The Threat Model Microsoft Built

In 2019, a Microsoft engineer named Tony Chen gave a presentation at the Platform Security Summit that laid out the Xbox One's security architecture in unusual detail. The core philosophy was **defense in depth** — every layer assumes the layers below it are compromised, so nothing relies on a single trust boundary.

The Xbox One uses a custom AMD SoC. Boot is anchored in hardware: the CPU's first instructions come from a read-only ROM inside the chip itself, which loads and cryptographically verifies each subsequent stage before executing it. The chain looks like this:

```
Immutable ROM → Bootloader (verified) → Hypervisor (verified) → OS Kernel (verified) → Apps/Games (verified)
```

Critically, the **hypervisor** sits below the operating system. When Xbox One runs a game, the OS and the game process are both virtualized. The hypervisor controls memory mappings, enforces executable permissions, and intermediates all hardware access. Even if you fully compromised the OS, you'd still be trapped in a hypervisor sandbox.

This is the same architecture that made the PS3 so hard to crack for so long. Sony's hypervisor held for years until a glitch attack found a way to confuse it.

## Why Nobody Cared Enough to Break It

Here's the uncomfortable truth: the Xbox One lasted thirteen years not just because of good security engineering, but because **the attack surface wasn't worth the effort**.

The PS3 was worth cracking because it was selling at a massive loss, had a unique Cell processor with genuinely exotic applications, and ran Linux natively — which created a community of researchers who were already poking at the hypervisor for legitimate reasons. The Xbox 360 was worth cracking because its game library had real exclusives and a huge piracy market.

The Xbox One? Its game library overlaps nearly entirely with PC. Every first-party Microsoft title is on Windows. Pirates could get the games elsewhere. The console had no unique hardware capability that researchers would want to exploit.

Microsoft also made a clever move: they shipped a **developer mode**. You could pay $19, flip a switch, and sideload arbitrary unsigned UWP applications onto your Xbox One without any exploit required. This created a legal outlet for homebrew, emulators, and tinkering that defused a significant portion of the hacker motivation. Want to run an NES emulator on your Xbox? Microsoft will literally help you do that. The jailbreak underground collapses when the manufacturer ships a sanctioned alternative.

Then Microsoft started clamping down on what you could run in developer mode — apparently after pressure from Nintendo over emulators. At that point, the motivation shifted back toward actual exploitation, but the community had thinned out over years of "who cares."

## What Voltage Glitching Is, For the Uninitiated

Software can't break hardware-enforced trust — but physics can.

A **voltage glitch attack** introduces a precisely timed, extremely brief voltage spike or drop to the target chip's power supply. Modern SoCs operate on extremely tight timing margins. A glitch at the right moment can corrupt a register read, flip a comparison in a branch instruction, or cause a memory controller to return invalid data. The attacker doesn't need to reverse-engineer the firmware. They just need to find the moment when the chip is doing something security-critical — like verifying a signature — and cause it to malfunction.

The art is in the timing. These attacks require:

1. Triggering a repeatable, deterministic event in the target chip
2. Injecting a glitch at a precise offset from that trigger (nanosecond-scale)
3. Monitoring the output to determine if the glitch hit the right window
4. Iterating thousands of times across parameter space until something interesting happens

Specialized hardware like the **ChipWhisperer** (open source, about $400) or commercially available glitching tools can automate this. The Xbox One's SoC doesn't differ from this approach in principle.

This technique has dropped the PS3, the Nintendo Switch, the PS Vita, and virtually every other "secure" consumer device at one point or another. It's not a vulnerability in the traditional sense — it's a consequence of physics. You can't software-patch physics.

## What "Every Level" Actually Means

Bliss's work reportedly achieves unsigned code execution at **every privilege level** of the system — including the hypervisor. That's the whole stack:

- **Bootloader** — run before anything else
- **Hypervisor** — the normally-inescapable sandbox layer
- **OS kernel** — the system management ring
- **User applications** — the top of the stack

Full hypervisor compromise is significant. Previous partial exploits on other consoles (like early PS3 work) were often trapped by the hypervisor even when the OS was owned. Breaking the hypervisor means breaking the last enforced trust boundary. From there, the game library can be decrypted, memory can be read without restriction, and fully arbitrary code can execute.

Practically speaking, this means: emulation, homebrew, game dumping, piracy, and the ability to run Linux — all the usual console hacking use cases.

## The Irony

Microsoft's best defense wasn't the hypervisor. It wasn't the hardware-rooted boot chain. It wasn't even the developer mode pressure valve.

It was **making a console nobody cared enough to spend months on**.

The hardware security architecture was genuinely solid — Tony Chen's presentation is worth reading for the engineering alone. But the Xbox One's position in the market (expensive, library duplicated by PC, no exotic hardware) meant the security research community had better things to do for thirteen years.

Bliss apparently decided the historical completionist angle was worth it. And now it's done. The Xbox One joins the PS3, the Switch, the Vita, and every other "unhackable" device in the pile of things that weren't.

The lesson is the same one it always is: "unhackable" is a promise hardware vendors make and physics inevitably breaks. Sometimes it just takes a decade and someone with nothing better to do on a weekend.

---

*Source: [Tom's Hardware coverage](https://www.tomshardware.com/video-games/console-gaming/microsofts-unhackable-xbox-one-has-been-hacked-by-bliss-the-2013-console-finally-fell-to-voltage-glitching-allowing-the-loading-of-unsigned-code-at-every-level) · Tony Chen's Xbox One security talk: [Platform Security Summit 2019](https://www.platformsecuritysummit.com/2019/speaker/chen/) · HN discussion [here](https://news.ycombinator.com/item?id=47413876) with 270+ comments arguing about sideloading semantics (as is tradition)*
