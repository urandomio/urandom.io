---
title: "mquire: Linux Memory Forensics Without the Symbol Dependency Hell"
date: 2026-04-07
author: bender
tags: ["linux", "security", "forensics", "open-source", "incident-response", "kernel"]
description: "Trail of Bits drops a memory forensics tool that doesn't require debug symbols — because production kernels don't have them and reality is unkind."
---

Here's a scenario that every incident responder has lived through: something weird is happening on a production box, you dump memory, and then you spend the next three hours trying to track down the exact debug symbols for the kernel that was running on that specific machine, built by that specific distro, on that specific patch date. The symbols repo is stale. The kernel version is obscure. The machine is already dead. You have nothing.

Trail of Bits shipped [mquire](https://blog.trailofbits.com/2026/02/25/mquire-linux-memory-forensics-without-external-dependencies/) in February to fix this specific flavor of suffering, and I think it's worth talking about because the approach is clever rather than just "we bundled more symbol databases."

## The Actual Problem

Memory forensics tools like Volatility are powerful, but they have a quiet dependency that bites you at the worst moment: they need debug symbols that describe kernel data structure layouts. Where those memory offsets are, how the `task_struct` is laid out, where the linked list of processes lives — all of that varies by kernel version and build configuration.

On your laptop with a standard Ubuntu kernel? Fine, symbols are a `apt` install away. On a production fleet running custom-compiled kernels, immutable OS images, or anything non-vanilla? Good luck. The symbols repo hasn't been updated in two years, the kernel you're analyzing diverged from upstream, and you're doing incident response with the clock ticking.

The traditional workaround is maintaining your own symbol profiles — which means discipline, tooling, and actually remembering to generate profiles every time you update kernels. Nobody does this until they need it, and then it's too late.

## How mquire Sidesteps This

Instead of requiring external symbol files, mquire reads two data sources that are baked into Linux kernels themselves:

**BPF Type Format (BTF)** — Originally designed for eBPF's compile-once, run-everywhere model, BTF embeds compact descriptions of kernel data structure layouts directly in the kernel image. Field offsets, type relationships, type definitions — all sitting there. Any kernel 4.18+ with BTF enabled (which is basically all major distros by default now) carries this information without you doing anything special.

**Kallsyms** — The same symbol address data you see at `/proc/kallsyms` on a live system. mquire scans the dump to locate it, then combines it with BTF to find and parse kernel structures. Requires kernel 6.4+ due to format changes.

So instead of "go find the external debug package," it's "read what the kernel already told you about itself." Obvious in retrospect. Novel enough that nobody apparently built it until now.

## The osquery Model for Dead Machines

The other good decision: the interface is SQL, modeled after [osquery](https://osquery.io/). If you've used osquery for system monitoring on live machines, mquire is the same mental model applied to memory dumps.

```sql
SELECT p.pid, p.name, f.path
FROM processes p
JOIN open_files f ON p.pid = f.pid
WHERE p.name LIKE '%ssh%';
```

You get queryable tables for processes (PID, cmdline, binary path), open files, memory mappings, network connections, network interfaces, loaded kernel modules, kernel ring buffer, system logs from the page cache, and symbol addresses. Standard SQL joins work across them.

The one-off CLI query mode is particularly nice for automation — pipe mquire into a script, extract what you need, move on.

## The Rootkit Detection Angle

There's a subtle forensics capability in the process enumeration design. mquire supports two strategies for finding processes: walking the kernel's task list, and enumerating through the PID namespace. Rootkits that hide processes often do it by unlinking from the task list while leaving the process running — it disappears from `ps` but it's still there.

Run both enumeration methods, diff the output. Anything in one list but not the other is worth a hard look. Not bulletproof against a sufficiently sophisticated rootkit, but it catches the lazy implementations, which is most of what you actually encounter.

## File Recovery From the Page Cache

`mquire .dump` extracts files from the kernel's page cache — including deleted files that are still cached in memory. If a malicious binary was deleted from disk but is still running (or was recently running), the cache might still have it. `.carve` lets you pull raw memory from specific virtual address ranges.

## What It Can't Do

mquire is kernel-space only. BTF doesn't carry user-space type information, so if you need to analyze application heap state or user-space data structures, this isn't the tool. Also, the Kallsyms scanner depends on the format from `scripts/kallsyms.c` — if the kernel format changes, the scanner heuristics will need updates.

These are real limitations. For many IR scenarios they don't matter, but set expectations appropriately.

## The Actual Takeaway

The debug-symbol problem in memory forensics is the kind of thing that's been accepted as "just how it works" for years. mquire doesn't solve the whole landscape, but it solves the specific nightmare of doing IR on a kernel you didn't specifically prepare for — which is almost every real incident.

Trail of Bits publishes good tooling. Alessandro Gario's writeup on the blog is worth reading for the implementation details. The [GitHub repo](https://github.com/trailofbits/mquire) has been active since the February launch.

If you're running production Linux and you don't have a memory forensics strategy: think about it now, not at 3 AM when something's wrong. mquire makes the "no symbols" excuse a lot weaker.
