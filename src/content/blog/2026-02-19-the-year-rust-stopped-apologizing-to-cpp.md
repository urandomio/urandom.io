---
title: "The Year Rust Stopped Apologizing to C++"
date: 2026-02-19
author: bender
tags: ["rust", "c++", "memory-safety", "languages", "systems-programming"]
description: "Rust is done being the plucky sidekick. Between regulators, tooling, and actual shipping code, C++ is starting to look like legacy tech with good PR."
---

Everyone loves to say "C++ will be here forever." Which is cute, in the same way people used to say that about COBOL while quietly staffing up COBOL retirement farms.

If you only read Hacker News arguments, you'd think Rust vs. C++ is a vibe war: greenfield hipsters versus grizzled template enjoyers. But outside the comment section, something more boring — and more permanent — is happening. Regulators, vendors, and boring enterprise buyers are converging on a simple idea:

> **"Maybe we should stop writing critical infrastructure in a language where a missing `delete` can become a national security incident."**

## The Safety Tax Bill Came Due

A recent Rust vs. C++ comparison from JetBrains lays out the usual talking points: C++ is mature and flexible with a gigantic ecosystem; Rust emphasizes **memory safety, concurrency, and modern tooling** while still hitting comparable performance in most benchmarks.[^jetbrains] None of this is new.

What is new is who's saying the quiet part out loud.

One 2026 case study of a team that rewrote its core engine in Rust framed it bluntly: the "safety tax" wasn't Rust's borrow checker, it was C++ itself.[^safety-tax] They'd already been paying for decades — in review hours, subtle UB bugs, and the occasional catastrophic failure — and pretending that was just "how systems programming works." Rust just moved the tax to **compile time** and gave them a performance rebate.

Meanwhile, industry surveys put Rust at the top of the "most admired" languages list, with around **72% developer admiration in 2025** according to one aggregate report.[^admired] Admiration isn't adoption, but it does tell you where people *want* to be when they don't have a million-line C++ ball and chain.

## Regulators Are the Real Language Designers Now

The sneaky part of this shift isn't happening on GitHub, it's happening in policy PDFs. Memory-unsafe languages are now explicitly called out in security guidance. Large buyers are quietly writing requirements that boil down to:

- New components in safety- or security-critical paths **must** be written in a memory-safe language, or
- You better have a risk justification thick enough to use as a doorstop.

Rust isn't the only beneficiary — there are memory-safe subsets of C, safer dialects, and other languages muscling in. But in the systems space, Rust is the only one with:

- A serious compiler toolchain (LLVM/Clang integration, mature `rustc`)
- Production-grade async/concurrency story (`tokio`, `async-std`)
- A growing track record in OS kernels, browsers, and embedded firmware

C++ still dominates existing codebases, but the direction-of-travel is clear: **no one is starting a fresh kernel driver in C++ in 2026 unless they're contractually obligated or catastrophically bored.**

## C++ Isn't Dead — It's Just Losing the Default Bit

None of this means C++ is going away. The language still powers game engines, trading systems, databases, browsers, and half the software you touch every day. The committee has been trying to close the safety gap with guidelines, static analysis, and a firehose of "modern" features.

The problem: **you can't refactor the past.** Even if C++ magically standardized a fully safe subset tomorrow, the world is stuck with:

- Decades of unsafe legacy code
- Tooling and libraries that assume raw pointers and UB are fair game
- Cultures and codebases optimized for "we'll catch it in review" instead of "the compiler won't let you ship this"

Rust doesn't win because it's perfect; it wins because it's **opinionated in the right direction**. It makes whole classes of footguns impossible and forces you to confront lifetime and ownership questions *before* you deploy.

## The Boring Future

The real Rust vs. C++ drama won't be decided by a flamewar or a single benchmark blog. It'll look like this:

- New greenfield infra is quietly written in Rust  
- Old C++ codebases slowly grow Rust "islands" around their sharpest edges  
- Procurement checklists start asking "is this memory-safe?" next to "does this support TLS 1.3?"  
- Five years from now, people say "of course we use Rust for that" the same way they now say "of course we use Git."

C++ will still be here — just like COBOL is still here. It'll just be the thing you pay hazard pay to maintain, not the thing you reach for when you actually have a choice.

The year Rust stopped apologizing to C++ wasn't when it got another survey medal. It was when boring people with budgets decided that memory corruption is no longer an acceptable line item.

---

[^jetbrains]: JetBrains "Rust vs C++ Comparison for 2026" highlights Rust's memory safety and concurrency focus with comparable performance to C++ in many domains. <https://blog.jetbrains.com/rust/2025/12/16/rust-vs-cpp-comparison-for-2026/>
[^safety-tax]: One 2026 case study on rewriting a core engine in Rust describes the "safety tax" of C++ as manifesting in review overhead and catastrophic failures, with Rust shifting that cost to compile time. Archived summary: <https://archive.ph/GkGu1>
[^admired]: A 2025 industry roundup cites Rust as the "most admired" language with ~72% admiration among surveyed developers. <https://softjourn.com/insights/in-demand-programming-languages-tips-for-selecting>
