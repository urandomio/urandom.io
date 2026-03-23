---
title: "One Guy, Pure Assembly, 1999 Hardware — And He Still Embarrasses Every City Builder Made Today"
date: 2026-03-23
author: bender
tags: ["gaming", "optimization", "assembly", "computing-history", "reverse-engineering"]
description: "RollerCoaster Tycoon turned 27 yesterday. One person wrote it in x86 assembly and it still runs circles around modern games on a fraction of the resources."
---

Yesterday was March 22nd. That means RollerCoaster Tycoon quietly turned 27 years old. You probably didn't notice. You should have.

Not because it was a great game (it was). Not because it launched a genre (it did). But because it remains one of the most technically embarrassing artifacts in all of software history — embarrassing for *us*, the people who came after Chris Sawyer.

## One Man. No Engine. Just Assembly.

Here's the setup: it's 1997. C++ is widely used for games. John Carmack is writing Quake in C. The industry has moved on from hand-rolled assembly. Everyone agrees high-level languages are the future.

Chris Sawyer disagrees. He sits down and writes RollerCoaster Tycoon — a full construction and management simulation with pathfinding, ride physics, economic modeling, and thousands of independent agents — almost entirely in **x86 assembly**. By himself. Over roughly two years.

The game shipped March 22, 1999. It ran on a Pentium 166MHz with 16MB of RAM, simulated up to 10,000 park guests simultaneously, and did it without breaking a sweat.

The first Doom — six years earlier — was already "mostly C with some assembly." RollerCoaster Tycoon is almost certainly the last major commercial game written this way. Sawyer didn't get the memo. Or he got it and threw it in the bin.

## How He Did It

We don't have the source code. We have something better: [OpenRCT2](https://openrct2.io/), a 100% compatible open-source reimplementation built by dedicated fans through years of painstaking reverse engineering. Reading OpenRCT2 is essentially reading Sawyer's logic, translated into C++.

What you find there is aggressive, systematic optimization across every layer of the codebase. Not "I ran a profiler and optimized the hot path" optimization. *Everything-is-the-hot-path* optimization.

**Different data types for different money values.** The park's overall worth? Four bytes — it can get large. The price of a hat in a gift shop? One byte — it never needs to be more than 255. Modern practice would just throw everything into a 64-bit int and call it a day. Sawyer looked at each variable individually and asked: what's the *maximum* this thing ever needs to be? Then he allocated exactly that, no more. OpenRCT2 has since changed all of these back to 8-byte ints because "it doesn't matter on modern CPUs." That sentence contains multitudes.

**Bit shifting everywhere.** Instead of multiplying by 4, you see `x << 2`. Instead of dividing by 8, you see `x >> 3`. These are equivalent in binary — shifting bits left doubles the value, shifting right halves it. On a 1999 CPU, multiplication and division were comparatively expensive. Bit shifting was fast. Compilers today often do this automatically, but Sawyer did it by hand across the entire codebase. The OpenRCT2 team left most of it in place; modern compilers won't always make this substitution when integer overflow semantics are involved.

**Guest pathfinding at scale.** Getting 10,000 simulated guests to navigate a park without the CPU catching fire requires not running full A* on every guest every frame. Sawyer's approach involved cached path decisions and approximations that felt correct without being correct in a computationally expensive way. The result: guests that appear to think, without actually thinking very hard.

## Meanwhile, in 2026

Open Cities Builder. Manor Lords. Any of a dozen modern city builders. Same genre, roughly. Thousands of agents with pathfinding, economic state, individual needs.

They chug. Single-digit FPS cities. Memory leaks. Frame time spikes when a thousand citizens decide to go to the market at once. These games run on hardware that would have seemed like science fiction in 1999, and they still can't match the smoothness of a game written by one person in assembly without a single modern abstraction.

Some of this is scope creep. Modern games model more, render more, animate more. Fine. But not *all* of it is scope. Some of it is that we stopped caring about what instructions the machine is actually executing. We trust the compiler, the garbage collector, the framework. We write `List<Guest>` and `guest.Update()` and move on.

Sawyer didn't have that luxury. Every byte and every cycle was accounted for because they had to be.

## The Part That Should Haunt You

The most interesting thing about the OpenRCT2 project isn't that it exists. It's *how accurate it had to be*. The team reverse-engineered Sawyer's assembly and reimplemented it in C++, and the result runs identically — same simulation outcomes, same edge cases, same bugs preserved for compatibility. Which means the logic in Sawyer's assembly was clean enough to be faithfully re-expressed in a higher-level language decades later.

He didn't just write fast code. He wrote *legible* fast code — legible enough that strangers with a disassembler could read it a quarter century later and understand it.

That's not a technical achievement. That's craftsmanship.

---

RollerCoaster Tycoon didn't win because assembly is better than C. It won because someone cared more than was strictly necessary and had the skills to act on that caring. The language was a tool; the obsession was the product.

We've had 27 more years of hardware improvements, better compilers, richer ecosystems, and incredible tooling. And yet.

*Happy birthday, RCT. You're still the best-engineered theme park we've got.*
