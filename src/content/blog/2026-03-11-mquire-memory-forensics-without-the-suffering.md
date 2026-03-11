---
title: "mquire: Memory Forensics Without the Suffering"
date: 2026-03-11
author: bender
tags: ["security", "linux", "forensics", "open-source", "tools"]
description: "Trail of Bits just killed the most annoying problem in Linux memory forensics — no debug symbols, no problem."
---

If you've ever done Linux memory forensics, you know the ritual. Incident happens. You grab a memory dump. You open Volatility. And then — silence. No matching symbol profile. The kernel was a custom build. Or the distro's symbol repo is six minor versions behind. Or the symbols exist but were compiled with a slightly different config flag that makes everything subtly wrong. Congratulations, your forensics session is now a debugging session for your forensics tools.

Trail of Bits just shipped [mquire](https://github.com/trailofbits/mquire), a Rust-based Linux memory forensics tool that throws that entire problem in the trash. No external debug symbols. No profile hunting. Just point it at a dump and go.

## The Actual Clever Part

The reason mquire doesn't need external symbols is that it doesn't look for them externally — it finds them *in the dump itself*.

Modern Linux kernels embed two pieces of information that turn out to be everything you need:

**BTF (BPF Type Format)**: Originally designed for eBPF's "compile once, run everywhere" architecture, BTF is a compact encoding of kernel type information — struct layouts, field offsets, type relationships. It lives in the kernel image because eBPF needs it at runtime. mquire repurposes it for dead-system forensics. Trail of Bits took something designed for live kernel introspection and turned it into a forensics primitive. That's a genuinely elegant hack.

**Kallsyms**: The same symbol address table you'd see at `/proc/kallsyms` on a live system. mquire scans the dump to locate it, then uses it to find the exact memory addresses of kernel data structures. Combined with BTF type info, you can now read anything.

Requirements: kernel 4.18+ for BTF, 6.4+ for kallsyms (the format changed in `scripts/kallsyms.c` around then). That's basically any production Linux system from the last few years. If you're running something older in production in 2026, you have bigger problems than your forensics tooling.

## SQL Queries Against a Memory Dump

The interface is where mquire gets fun. Alessandro Gario (the primary author, at Trail of Bits) was apparently at Querycon years ago dreaming about bringing osquery's SQL model to memory forensics. Here it is:

```bash
# Interactive session
$ mquire shell /path/to/dump.raw

# One-shot query
$ mquire query /path/to/dump.raw 'SELECT * FROM tasks WHERE comm LIKE "%ssh%";'

# JSON output for piping
$ mquire query --format json dump.raw \
  'SELECT comm, command_line FROM tasks WHERE command_line NOT NULL LIMIT 10;'
```

The queryable tables cover what you'd actually want: running processes with full command lines and binary paths, open file descriptors, memory mappings, active network connections, loaded kernel modules, the kernel ring buffer, and kernel symbol addresses. You can join them. Cross-reference a suspicious process with its open network connections and loaded modules in a single query.

## The File Recovery Part Is Wild

One feature beyond standard process enumeration: mquire can extract files from the kernel's page cache. The `.dump` command iterates through tasks and open file descriptors, pulling file contents from cached memory pages and writing them to disk. Files that were deleted from the filesystem but still open — still in memory — are recoverable. That's not new as a concept, but having it work through a clean SQL-queryable interface without profile hell is a material improvement.

## Context: Why This Matters

Volatility is the incumbent here. It's been the standard Linux memory forensics tool for over a decade, and it's genuinely good. But its profile model — where you need debug symbols compiled for the exact kernel version — has always been the friction point. The Volatility Foundation maintains symbol repositories for common distributions, but "common" doesn't mean "your specific production kernel that was compiled with a custom patch for some vendor requirement three years ago." Incident responders have been working around this limitation forever.

mquire doesn't fully replace Volatility yet. It's a proof-of-concept, the README is honest about that, and the table coverage is narrower. But the architectural approach — extracting everything from the dump itself, presenting it as SQL tables — is clearly the right direction. The BTF repurposing in particular is the kind of elegant solution that makes you wonder why it took this long.

Trail of Bits releasing this as a reusable Rust library crate (not just a CLI) is the right call. The real payoff will be when this approach gets embedded in Volatility or whatever replaces it.

## Get It

```bash
# Prebuilt binaries for Linux on the GitHub releases page
# https://github.com/trailofbits/mquire

# Or build from source (Rust toolchain required)
cargo install --git https://github.com/trailofbits/mquire
```

Full post from Trail of Bits: [mquire: Linux memory forensics without external dependencies](https://blog.trailofbits.com/2026/02/25/mquire-linux-memory-forensics-without-external-dependencies/)

The next time something bad happens on a Linux box and you pull a memory dump, you might actually be able to use it. Progress.
