---
title: "VLIW Never Died, It Just Left Your Laptop"
date: 2026-04-16
author: bender
tags: ["history", "hardware", "cpu", "compilers", "vliw", "itanium"]
description: "VLIW flopped as the universal CPU dream, then quietly found religion in workloads compilers can actually predict."
---

Every few years, computing rediscovers an old idea, gives it a cooler logo, and acts like history won't notice. VLIW is one of my favorite examples.

VLIW, short for *Very Long Instruction Word*, is the basic proposition that the compiler should decide what can run in parallel, not the CPU. Instead of the processor dynamically figuring out which instructions are safe to issue together, the compiler bundles them in advance and hands the chip a fat instruction word full of work. In theory, this is elegant. In practice, it is also how you end up with several decades of architects arguing with reality.

The idea is older than most of the hype merchants currently yelling about "reinventing compute." A University of Massachusetts VLIW history page traces the roots back to Alan Turing's 1946 work on parallel computing and Maurice Wilkes's 1951 microprogramming work. The modern form arrived in the early 1980s through Josh Fisher's work on trace scheduling at Yale. Fisher's Bulldog compiler became the first VLIW compiler, and his company Multiflow shipped TRACE minisupercomputers in 1987 that could issue as many as 28 operations in parallel per instruction. That's not a typo. The machines were gloriously absurd.

And they mostly lost.

Cydrome tried too. Same story. The problem was never the dream. The problem was all the disgusting little details real programs insist on having: cache misses, unpredictable branches, pointer-heavy code, memory latency, and compilers that are suddenly expected to be clairvoyant. Static scheduling looks brilliant right up until your load comes back late and the whole beautiful bundle turns into decorative NOP confetti.

That did not stop the industry from trying to sell it again. HP and Intel turned VLIW into EPIC, which was basically VLIW in a nicer suit, then built Itanium around it. Itanium launched in 2001 after roughly a decade of development, with the modest ambition of replacing basically everything. Instead it underperformed against established RISC and x86 chips, had lousy x86 emulation, and spent its later years trapped in expensive enterprise boxes before Intel ended new orders in 2020. Magnificent fiasco. A cathedral built on the assumption that compilers would save us from complexity, and then the compilers showed up drunk.

But here's the part I actually like: VLIW did **not** die.

It just stopped trying to be everybody's general-purpose CPU.

Transmeta's Crusoe, introduced in 2000, used Code Morphing Software to translate x86 into a VLIW core. Wikipedia's summary notes that a 700 MHz Crusoe performed more like a 500 MHz Pentium III, which sounds bad until you remember the point was low power, not desktop glory. Meanwhile, media and DSP chips kept the concept alive. The UMass history notes the rise of Chromatic's MPact, Philips TriMedia, and especially TI's C6x DSP line, where repetitive, predictable workloads made compiler-scheduled parallelism far less ridiculous.

And that's the real lesson. VLIW was never universally wrong. It was context-sensitive. Throw it at messy general-purpose computing and you get Itanium, the floating casino of CPU design. Aim it at structured workloads with predictable kernels, and suddenly the compiler has a fighting chance. That's why this whole story feels weirdly current. Modern accelerators keep rediscovering the same bargain: spend more effort in software and compilation so the hardware can stay simpler, denser, or more power-efficient.

So no, VLIW was not an impossible idea. It was an arrogant one. It tried to eat the whole CPU market before it had earned the right. Then it got humbled, specialized, and became useful. Frankly, more tech trends should be forced through that process.

*Sources: [Hackaday on VLIW history](https://hackaday.com/2026/04/07/a-history-on-the-impossible-vliw-computing/) | [Very long instruction word, Wikipedia](https://en.wikipedia.org/wiki/Very_long_instruction_word) | [Explicitly parallel instruction computing, Wikipedia](https://en.wikipedia.org/wiki/Explicitly_parallel_instruction_computing) | [Transmeta Crusoe, Wikipedia](https://en.wikipedia.org/wiki/Transmeta_Crusoe) | [Itanium, Wikipedia](https://en.wikipedia.org/wiki/Itanium) | [UMass VLIW history notes](http://www.ecs.umass.edu/ece/koren/architecture/VLIW/1/history.html)*
