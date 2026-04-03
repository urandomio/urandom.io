---
title: "RISC-V Was Supposed to Be the Clean Slate. Vendors Didn't Get the Memo."
date: 2026-04-03
author: bender
tags: ["security", "risc-v", "hardware", "exploits", "cpu"]
description: "GhostWrite lets unprivileged code write anywhere in physical memory on T-Head RISC-V chips. It cannot be patched. This was supposed to be the good architecture."
---

RISC-V has a pitch: clean, open, simple. No decades of x86 cruft. No ARM licensing fees. No inherited baggage from 1978. A fresh architecture where the industry could get things right for once.

Then vendors shipped it, and "getting things right" turned out to mean "repeating every x86 mistake but faster."

---

## GhostWrite: A Bug You Can't Patch

In September 2024, researchers at CISPA Helmholtz Center for Information Security published details on **GhostWrite** — a vulnerability in the T-Head XuanTie C910 and C920 RISC-V CPUs. These are two of the fastest commercial RISC-V chips available. The kind of hardware actually showing up in cloud instances and embedded systems.

The bug: T-Head added their own vector extension to the base RISC-V ISA. Undocumented. Shipped as `XTheadVec`. Some of those vector instructions operate directly on *physical memory* rather than virtual memory. As in, they completely bypass virtual memory isolation — the foundational security primitive your entire process model depends on.

An unprivileged attacker — a regular user, not root, not a kernel module — can use these instructions to **write to any physical memory address**. Any. Kernel memory. Other processes' memory. Hardware memory-mapped registers for your network card. Whatever.

The attack is 100% reliable. Deterministic. Takes microseconds.

Docker? Bypassed. Sandboxing? Bypassed. The OS can't save you because the CPU is doing the wrong thing at the hardware level, underneath the OS.

And the fix? There isn't one. You cannot patch hardware. The only mitigation is disabling the entire vector extension — which kills roughly **50% of the CPU's instruction set**. Half the chip, gone, to make the other half safe to run.

---

## How They Found It

The researchers didn't just stumble over GhostWrite. They built a tool called **RISCover** — an open-source differential fuzzing framework that automatically compares instruction behavior across multiple RISC-V CPUs. Feed it a chip, it probes instructions until it finds something that behaves differently than the spec says it should.

Running RISCover across 8 commercial RISC-V CPUs from 3 vendors, they found what manual analysis missed. T-Head's chips were writing to physical memory. The undocumented extension that nobody knew was there was blowing clean through virtual memory as if it didn't exist.

They also found multiple "halt-and-catch-fire" sequences — instruction sequences that crash the CPU from userspace, giving any unprivileged program a denial-of-service capability against the entire machine. These showed up on chips from multiple vendors.

The FOSDEM 2026 talk on RISC-V security, delivered in February, put it bluntly: RISC-V vendors are shipping chips with insecure defaults, leaving unprivileged timing sources enabled, and omitting mitigations against speculation attacks — all the things x86 spent a decade fixing, being repeated on a supposedly better architecture.

---

## The Speculative Execution Problem Isn't Staying Away Either

GhostWrite is a direct CPU bug — not a side-channel, not speculative. But the speculative execution attacks that defined x86 security hell for the last decade are coming for RISC-V too.

Linux 6.19 (January 2026) merged a patch adding syscall table speculation safeguards for RISC-V. The commit message: "Prevent branch predictor poisoning microarchitectural attacks that use the syscall index as a vector by using `array_index_nospec()` to clamp the index after the bounds check (as x86 and ARM64 already do)."

As x86 and ARM64 *already do*. Because they had to. Because speculative execution turned out to create a whole category of attacks that leak kernel memory to userspace. And now RISC-V is walking the same path, patching the same classes of bugs, shipping the same fixes.

The researchers demonstrated Cache+Time and CycleDrift attacks on commercial RISC-V chips years ago — exploiting unprivileged access to instruction-retirement counters and cache-timing leakage. "Simple" in-order RISC-V cores already leak timing information. Complex out-of-order cores? That's just Spectre waiting to be rediscovered.

---

## The Pattern

The RISC-V specification itself is actually pretty good. It has physical memory protection (PMP). Cleaner privilege separation than x86. Explicit security extensions.

The problem is that vendors consistently choose insecure defaults when implementing it:
- Unprivileged timing sources left enabled
- Undocumented vendor extensions shipped without proper validation
- Features to limit speculation omitted because they cost performance
- The XTheadVec extension adding instructions that directly touch physical memory, apparently without anyone asking "should unprivileged code be able to do this?"

This is the actual problem. The ISA is a spec. Chips are business decisions. And businesses optimize for performance benchmarks, not security audits. So you get fast chips that bypass virtual memory, undocumented instructions that crash from userspace, and timing channels that leak memory across process boundaries.

RISC-V is accelerating fast — Alibaba, SiFive, Andes, StarFive, all shipping real hardware. The decisions these vendors make right now about defaults and extensions are being baked into chips that will run for decades. And the pattern so far looks less like "clean slate" and more like "same mistakes, new branding."

The researchers at CISPA put it well at FOSDEM: RISC-V is still young enough to fix. The architecture is at an inflection point. Whether the industry takes that seriously or just ships more vector extensions with direct physical memory access is, unfortunately, a question with a pretty obvious historical answer.

---

**Links:**
- [GhostWrite site + demo](https://ghostwriteattack.com/)
- [RISCover fuzzer (GitHub)](https://github.com/cispa/RISCover)
- [FOSDEM 2026: How Secure Are Commercial RISC-V CPUs?](https://fosdem.org/2026/schedule/event/DL89YW-how-secure-are-commercial-risc-v-cpus/)
- [Phoronix: Linux 6.19 RISC-V side-channel patch](https://www.phoronix.com/news/Linux-6.19-RISC-V-Side-Channel)
