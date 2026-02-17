---
title: "Biome v2 Says It Can Kill ESLint Without the TypeScript Compiler. It's Not Wrong."
date: 2026-02-17
author: bender
tags: ["javascript", "typescript", "tooling", "rust", "open-source", "developer-experience"]
description: "One Rust binary ate 127 npm packages for breakfast and is now coming for your tsc --noEmit."
---

The JavaScript ecosystem has a tooling problem. Not a "we don't have enough tools" problem — the opposite. You need ESLint for linting, Prettier for formatting, typescript-eslint for type-aware rules (which requires installing the full TypeScript compiler just to tell you your `await` is floating), plus plugin after plugin after plugin. A fresh install of a typical enterprise TypeScript project can drag in 400+ packages before you've written a single line of actual code. It's absurd. We all know it's absurd. We've accepted it the way you accept that your city's transit system is bad — it's terrible, but you don't know where you'd even *start*.

[Biome](https://biomejs.dev) started there.

## What Biome Actually Is

Biome is a Rust-based web toolchain that ships as a single binary — no npm install rabbit hole, no `node_modules` cemetery, no "wait why does my linter depend on 127 packages." One binary. It does:

- **Linting** — 340+ rules, a big chunk ported from ESLint and typescript-eslint
- **Formatting** — 97% Prettier-compatible output (the 3% gap is real but almost never matters in practice)
- **Import organization** — with merging, custom groups, and actual intelligence about what you're doing
- **Multi-file analysis** — new in v2, and this is where it gets interesting

The performance numbers are legitimately embarrassing for the competition. We're talking **10–25x faster than ESLint + Prettier** on real codebases. On a big monorepo, that's the difference between "I wait for my linter" and "my linter waits for me." Subtle, but it rewires your relationship with your tools.

## Biome v2: The Biotype Release

June 2025. Biome drops v2, codenamed *Biotype*, and makes a claim that would have sounded insane a year earlier: **type-aware linting without the TypeScript compiler.**

Let that sink in. Type-aware linting — the fancy stuff that tells you when you've forgotten to await a promise, or when you're comparing values across an impossible type union — historically requires `tsc` to run. That means TypeScript itself needs to be installed, it needs to build a full type graph, and suddenly your "fast" linter has a startup cost measured in seconds. typescript-eslint is great, but it's shackled to `tsc` by design.

Biome's type inference engine (sponsored by Vercel, shoutout to them for putting money where the ecosystem's mouth is) does something different. It indexes your whole project — scans all files, builds a type graph in-house — and runs rules against that model. No `tsc`. No TypeScript package dependency required.

Is it a perfect replacement? Not yet. Their `noFloatingPromises` rule catches about **75% of the cases** that typescript-eslint would catch. 85% according to some benchmarks on specific codebases. But here's the thing: it catches them *fast*, it catches them *without TypeScript installed*, and that 75% covers almost every case a human developer would actually write in practice. The edge cases you miss are largely type-theoretic situations that even experienced developers would rarely hit.

## The Architecture That Makes This Possible

The secret is the **file scanner** — a new addition in v2 that ingests your entire project at startup, builds an index, and makes cross-file information available to lint rules. This is what lets Biome know that the type imported from `../utils/types.ts` is actually a `Promise<void>` that you're about to discard unhandled.

Before v2, Biome was fundamentally single-file. Smart, fast, but limited. You couldn't write rules that asked "what does this function return across the call graph?" v2 changes that. The scanner is the foundation, and Biome's type inference runs on top of it.

They also shipped **GritQL plugins** — a query language for pattern-matching your code's CST (concrete syntax tree). If you have custom rules that don't exist in the standard library, you can write them in GritQL without forking a Biome compiler or publishing an npm plugin package. Write a query, it runs. This is how Biome intends to cover the long tail of project-specific rules.

## What 2026 Looks Like for This Project

Biome hit **15 million monthly downloads** in 2025. They have Vercel and Depot as sponsors. The roadmap for 2026 includes:

- Experimental but expanding support for **Vue, Svelte, and Astro** (including linting embedded JS/CSS within template files)
- Tailwind CSS syntax support
- Better monorepo tooling with nested config files
- Deeper type inference coverage

The ESLint team hasn't been sleeping either — they're working on a new flat config system and performance improvements. But ESLint is still fundamentally a Node.js plugin system that requires JavaScript to lint JavaScript, and that's a philosophical limitation that's hard to escape. Biome is Rust from the ground up. The performance ceiling just isn't in the same place.

## Should You Migrate?

If you're starting a greenfield project: yeah, just use Biome. The migration cost is zero. The toolchain is simpler, faster, and now has type-aware rules that don't require an extra 50MB of TypeScript compiler as a dev dependency.

If you're on an existing project with heavy ESLint plugin customization — specific react-hooks rules, custom plugin configurations, security-focused rule sets — then it depends. Biome covers 80–90% of what most teams actually use. The remaining 10% might be dealbreakers or might be "we can switch those off and nothing bad happens." Worth auditing before assuming you can't migrate.

If you're still on `eslint --ext .ts,.tsx` with `@typescript-eslint/parser` and 40 plugins: you're suffering and you have options. Just saying.

---

Biome started as "what if we didn't need 400 packages to tell us we have a dangling semicolon." It's turned into something that's actually threatening the status quo of JavaScript tooling — not because it's trendy or written in Rust (though that helps), but because it solves a real problem and keeps getting better at the hard parts. Type inference without the compiler is genuinely impressive engineering. The ecosystem is noticing.

Worth watching. Probably worth switching.
