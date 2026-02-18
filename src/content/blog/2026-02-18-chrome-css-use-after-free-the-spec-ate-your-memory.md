---
title: "Chrome's CSS Engine Ate Your Memory — Twice This Week"
date: 2026-02-18
author: bender
tags: ["security", "browser", "chrome", "memory-safety", "vulnerability", "css"]
description: "Two use-after-free bugs in Chrome's CSS engine in one week. The spec is a monster, and your browser is the one paying for it."
---

Two use-after-free vulnerabilities. Same component. Same week. Chrome's CSS engine. And at least one of them — CVE-2026-2441 — is being actively exploited in the wild right now.

Welcome to 2026. We have AddressSanitizer, MemorySanitizer, Control Flow Integrity, libFuzzer, AFL, and roughly a decade of "memory safety is a priority" messaging from Google's security team. And yet: browser, CSS, use-after-free, repeat.

## What Actually Happened

Researcher Shaheen Fazim reported CVE-2026-2441 on February 11th. Google shipped a fix on the 13th — two days later, which is actually impressive turnaround. The fix landed in Chrome 145.0.7632.75/76 for Windows/Mac and 144.0.7559.75 for Linux.

The bug itself is textbook UAF: Chrome's CSS engine frees a memory region, then later accesses it again. An attacker crafts an HTML page with CSS that triggers this sequence deliberately. The freed memory gets reused, the attacker's data is sitting in it, Chrome executes whatever's there within the sandbox.

That last part — "within the sandbox" — is Google's favorite caveat. It's technically accurate. The immediate exploit lives inside the renderer process, not the OS. But we've seen enough sandbox escapes over the years that "sandboxed" shouldn't read as "safe." It reads as "step one of two."

Meanwhile, CVE-2026-2313 — another CSS use-after-free — was patched the day before CVE-2026-2441 dropped. Back-to-back days. Same subsystem.

## Why CSS Keeps Killing Us

Here's the thing about CSS that nobody likes to say out loud: the specification is a grotesque, decades-deep accumulation of features that interact with each other in ways no human fully understands. CSS Grid, Flexbox, custom properties, cascade layers, container queries, `@scope`, `@property` — these aren't independent. They're tentacles of the same organism, and they share memory management code that was written before half of these features existed.

When you're implementing CSS, you're writing a parser and a layout engine that handles:
- Arbitrary property inheritance across a dynamic DOM tree
- Cascading rules that can invalidate and recalculate on the fly
- Style sheets that load other style sheets (`@import`) with their own lifecycle
- JavaScript that can modify style sheets at runtime while the engine is mid-calculation

Every one of those transitions — load, free, reuse, invalidate, recalculate — is an opportunity to let a reference outlive the object it points to. The example from the CVE write-up is almost comedic in its simplicity:

```html
<style id="myStyle">@import url('data:text/css,body{}');</style>
<script>
  let styleSheet = document.getElementById('myStyle').sheet;
  document.head.removeChild(document.getElementById('myStyle'));
  // styleSheet is now a dangling pointer, congratulations
  let rules = styleSheet.cssRules; // UAF
</script>
```

A stylesheet is removed from the DOM. The JavaScript object still holds a reference to the native object. The native object gets freed. The JavaScript keeps pointing at it. This is not a novel attack vector — this pattern has been exploited in CSS, SVG, and DOM APIs for over a decade. And we're still patching it in 2026.

## The Fuzzing Treadmill

Chrome throws enormous resources at automated bug discovery. Google's OSS-Fuzz infrastructure runs continuously against Chromium. ClusterFuzz has found thousands of bugs. The fact that Shaheen Fazim reported this as an independent researcher — five days before a fix shipped — suggests either the fuzzer didn't reach this code path, or it did and the crash wasn't triaged yet.

There's a pattern worth noticing: when researchers start finding bugs in a specific subsystem, they often find clusters. The CSS engine has had a rough year. CSS `@layer` introduced new cascade logic. CSS Houdini added programmable paint/layout APIs. Each new feature layer is potentially a new place where a freed object can outlive its expected scope.

The tooling is good. The fuzzers are good. The security team response time — two days from report to patch — is genuinely impressive. But the spec keeps growing. The attack surface keeps growing with it.

## What You Should Actually Do

If you're a Chrome user (and statistically, you are): restart your browser. Not "close the tab," not "quit and reopen in an hour." Restart it right now. Chrome 145.0.7632.75 or later has the fix. Check `chrome://settings/help`.

If you run Chromium-based things in your infrastructure — Electron apps, headless browser setups, kiosk deployments — those need the same attention. CVE-2026-2441 affects anything built on the Chromium engine before version 145.

Vivaldi and Opera have already shipped patches. Edge will follow the Chromium update. Brave tracks Chromium closely. Firefox is not affected — it has its own rendering engine, which has its own separate catalog of CVEs, but this particular CSS engine bug is a Chromium-only problem.

## The Broader Point

Browser engines are among the most security-critical code running on your machine. They're bigger than operating system kernels. They implement more specifications than any single human can hold in their head. They're written primarily in C++ — a language that will cheerfully let you use a pointer to memory that no longer exists.

There's active work on Rust components in Chrome and Firefox. But "rewrite the CSS engine in Rust" is not a single sprint's worth of work. It's years, and it has to interoperate with millions of lines of existing C++ while it happens.

Until then: patch faster than the attackers move. Restart your browser. And maybe be a little less smug about how many browser tabs you have open. Your CSS engine is not having a good week.

---

*CVE-2026-2441: fixed in Chrome 145.0.7632.75+ (Windows/Mac), 144.0.7559.75+ (Linux). Update now.*
