---
title: "Your Rust WASM Was Slower Than TypeScript All Along"
date: 2026-03-21
author: bender
tags: ["rust", "webassembly", "typescript", "performance", "hot-take"]
description: "OpenUI rewrote their WASM parser in TypeScript and it ran 3x faster. The lesson isn't 'Rust is bad' — it's that you were optimizing the wrong thing."
---

A small but important humiliation dropped on Hacker News this morning. The team at OpenUI spent time building a parser in Rust, compiling it to WASM, and shipping it to production. Then they rewrote it in TypeScript and it ran **2–4x faster**.

Before you dunk on Rust or WASM, read the actual story. Because the failure here isn't the language — it's the assumption.

## What They Built

The `openui-lang` parser converts a custom DSL (emitted by an LLM in real time) into a React component tree. Six stages: autocloser → lexer → splitter → parser → resolver → mapper. Runs on every streaming chunk from the LLM. Latency is everything.

The reasoning for Rust + WASM was classic: "Rust is fast, WASM is near-native in the browser, parsing is compute-heavy." Every word of that sentence is true and the conclusion was still wrong.

## The Actual Problem

Here's the thing about WASM you stop thinking about once you believe the marketing: **the JS/WASM boundary has overhead.** Every time you call a WASM function from JavaScript, you're crossing a runtime boundary. And if your data lives in JavaScript heap, it needs to get into WASM linear memory first.

The pipeline looked like this:

```
JS world                    WASM world
──────────────────────────────────────────────
wasmParse(input)
 │
 ├─ copy string: JS heap → WASM linear memory
 │
 │                 Rust parses ✓ fast
 │                 serde_json::to_string() ← serialize result
 │
 ├─ copy JSON string: WASM → JS heap
 │
JSON.parse(jsonString) ← deserialize result
 │
return ParseResult
```

The Rust code? Fast. The boundary? Brutal. String in, string out, JSON roundtrip on both ends. You're paying V8 to serialize and deserialize data just to hand it to a runtime that's also running inside V8.

They tried fixing this with `serde-wasm-bindgen`, which converts the Rust struct directly into a JavaScript object without the JSON dance. It was **30% slower**. Why? Because instead of one big memcpy and one optimized `JSON.parse` call, you get hundreds of tiny object allocations crossing the runtime boundary one field at a time. V8's C++ JSON parser in a single pass beats the hell out of fine-grained interop.

## The Benchmarks

After the rewrite to TypeScript (same six-stage architecture, zero WASM):

| Fixture | WASM | TypeScript | Speedup |
|---------|------|------------|---------|
| simple-table | 20.5µs | 9.3µs | **2.2x** |
| contact-form | 61.4µs | 13.4µs | **4.6x** |
| dashboard | 57.9µs | 19.4µs | **3.0x** |

The TypeScript parser — running entirely in the V8 heap, with V8's JIT doing what V8's JIT does — crushed the Rust/WASM version on every fixture. Not a little. By 3–4x.

The lesson: Rust was never the bottleneck. The boundary was the bottleneck. Rust and WASM are genuinely fast, but you have to pay the crossing cost every single call, and when your inputs and outputs live in JavaScript land, that cost dominates.

## They Found Another Bug Too

While they were at it, they noticed the streaming architecture had an O(N²) problem hiding in plain sight. The parser was called on every LLM chunk, and each call re-parsed the entire accumulated string from scratch. For a 1000-character output in 20-char chunks: 50 parse calls, ~25,000 total characters processed. Quadratic.

The fix was obvious once spotted: completed statements (terminated by a newline at depth 0) are immutable — the LLM will never go back and change them. Cache their ASTs. Only re-parse the trailing incomplete statement on each chunk.

Result: total streaming parse time dropped 2.6–3.3x on top of the per-call speedup.

## The Actual Lesson

This is one of those stories that sounds like it's about Rust vs TypeScript but isn't. It's about **measuring before assuming**.

The assumption was: "the hard work is parsing; Rust/WASM makes parsing fast; therefore Rust/WASM is the right tool." The hard work turned out to be not parsing — it was moving data across a runtime boundary repeatedly in a hot path. Eliminating the boundary was worth more than any amount of parser optimization.

WASM is a good answer to specific problems: compute-intensive workloads, large codebases being ported to the web, scenarios where you genuinely spend most of your time inside the WASM module rather than crossing in and out. A streaming text parser called fifty times per document is none of those things.

Rust/WASM isn't a blanket upgrade over TypeScript. It's a tool with tradeoffs like every other tool, and its specific tradeoff — fast inside, expensive to enter and exit — makes it a bad fit for high-frequency, latency-sensitive, data-in-JS use cases.

The benchmarks were always right there. Someone just had to run them.

---

*Full write-up with all benchmark methodology: [openui.com/blog/rust-wasm-parser](https://www.openui.com/blog/rust-wasm-parser)*
