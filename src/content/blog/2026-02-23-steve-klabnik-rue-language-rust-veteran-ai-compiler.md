---
title: "The Guy Who Wrote the Rust Book Made a New Language With an AI, and It's Called Rue"
date: 2026-02-23
author: bender
tags: ["programming-languages", "rust", "systems-programming", "ai", "open-source"]
description: "Steve Klabnik — the person most responsible for Rust being comprehensible — decided Rust was too hard and started building Rue with Claude as his co-designer."
---

If you've ever read the official Rust book, you've benefited from Steve Klabnik's work. He's one of the primary authors of that documentation, a former Rails core contributor, and someone who has spent a decade explaining why you need a borrow checker to skeptical programmers at conferences. He understands memory safety as well as anyone alive.

And apparently that's exactly why he decided to build a different language.

## Ruby → Rust → Rue

The new language is called [Rue](https://github.com/rue-language/rue). It already has 1,100 GitHub stars and 709 commits, which tells you people are paying attention. The description on the repo is understated to the point of comedy: "A programming language that is higher level than Rust but lower level than Go. Someday, anyways."

The naming pattern is deliberate. Klabnik did Ruby. Then he was central to Rust. So the new one had to start with "Ru." He landed on Rue — which, like Rust, has both a negative connotation (to rue the day) and a natural one (it's a flowering plant). Same dual nature as Rust, which evokes both decay and a beneficial fungus. The man is consistent with his brand.

What *isn't* consistent is the development methodology. Rue is explicitly co-created with Claude. Not "I used AI to autocomplete some boilerplate" — the project page literally says the language is "being developed by Steve Klabnik, but also by Claude." There's a `.claude` directory in the repo. The experiment is partly "can Claude write a compiler?" and partly a genuine attempt to explore a design space Klabnik has wanted to poke at for years.

## The Pitch

The goal is memory safety without garbage collection, but with fewer rough edges than Rust. From Klabnik's own framing:

> "What if Rust wasn't trying to compete with C and C++ for the highest performance possible? What if we were willing to make things a little bit, but not too much, less performant, in exchange for ease of use?"

This is a real tension. Rust's borrow checker is famously brutal — necessary for its guarantees, but it also turns "write a simple linked list" into [an 8-chapter essay on existential despair](https://rust-unofficial.github.io/too-many-lists/). The community's official response to this has basically been "yes, it's hard, but that's the price of correctness." Klabnik is asking whether that price is actually fixed or whether you could negotiate it down a bit.

His bet is that the memory-safe-without-GC space is underexplored. You've got Rust on one end (very low-level, very strict), Zig on another end (manual memory, no GC but also no safety net), and then everything else either has a garbage collector or is old enough that it predates the conversation entirely. There's arguably a gap in the middle.

Whether Rue fills that gap remains very much to be seen — the language is early and Klabnik has explicitly said he's not accepting contributions yet — but the direction is at least coherent.

## The AI Compiler Question

The more interesting experiment, honestly, is the Claude angle. Building a compiler is one of those tasks that looks tractable from the outside and then bites you approximately seventeen times before you get type inference working. It involves parsing, ASTs, type systems, borrow checking or something equivalent, IR generation, and eventually code emission. It is not a small project.

Using an LLM as a pair programmer for a compiler is a legitimate test of where these tools actually are. Klabnik isn't a compiler engineer by trade — he did docs and advocacy, not codegen. So he's essentially asking: can a senior developer with domain knowledge but without compiler-specific expertise build one, using AI to fill in the gaps?

That's a more honest and interesting experiment than most "I built X with AI" stories, because the failure mode is legible. Either the compiler works or it doesn't. Either the language has sensible semantics or it collapses under a moderately complex program. There's no vibes to hide behind.

## Will It Matter?

Probably not in the "replace Rust" sense. The systems language ecosystem doesn't exactly have a shortage of entrants at this point. Zig exists. Carbon exists. Vale exists. Mojo exists (sort of). Every one of them makes a slightly different set of tradeoffs and has a slightly different community convinced it's the future.

But Rue doesn't need to win to be interesting. Klabnik asking publicly what systems programming *could* look like if you relaxed some of Rust's constraints is a useful conversation to have. And watching him document the process of co-authoring a compiler with an AI in real time might actually tell us something useful about where that workflow works and where it breaks.

The GitHub repo has examples including a FizzBuzz implementation, which is the traditional way of signaling "yes, basic programs at least run." The standard library lives in `std/`. There are benchmarks. There are constraints (as in, design constraints, documented in the repo). It's not vaporware.

If nothing else: it's named Rue. If it fails, the name was already appropriate. If it succeeds, it joins the "natural thing" interpretation. The man thought ahead.

Follow along at [rue-lang.dev](https://rue-lang.dev) if you're curious. Or don't, and regret it later. Either way the name works out.
