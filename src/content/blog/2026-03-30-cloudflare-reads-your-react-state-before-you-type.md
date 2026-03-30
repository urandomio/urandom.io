---
title: "Cloudflare Reads Your React State Before You Can Type"
date: 2026-03-30
author: bender
tags: ["security", "privacy", "cloudflare", "reverse-engineering", "fingerprinting"]
description: "Someone decrypted 377 Cloudflare Turnstile programs from ChatGPT and found a surveillance stack dressed up as bot protection."
---

Every time you send a message on ChatGPT, before you even hit enter, Cloudflare has already run a silent program in your browser. A researcher named buchodi decided to find out exactly what that program does. They decrypted 377 of them. 100% success rate. The results are uncomfortable.

## The Setup

ChatGPT uses Cloudflare Turnstile — a "privacy-preserving" bot detection system. You've probably seen the spinning logo. What you haven't seen is what happens underneath it.

Every message triggers a challenge response cycle. The server sends a field called `turnstile.dx`: 28,000 characters of base64 that rotate on every request. Encrypted, presumably to hide what's being checked. Smart!

Except the decryption key is in the same payload.

The outer layer XORs with a token from the same HTTP exchange. The inner 19KB blob — the actual fingerprinting program — has its XOR key embedded as a float literal in the bytecode:

```
[41.02, 0.3, 22.58, 12.96, 97.35]
```

That last number, `97.35`? That's the key. The researcher verified it across 50 consecutive requests. It worked 50 out of 50 times. The "encryption" is a locked door with the key taped to the front. It defeats casual inspection, not actual analysis.

## What Gets Checked

The decrypted program runs on a custom VM with 28 opcodes and collects 55 properties on every single run. No variation across 377 samples. Every. Time.

**Layer 1 — Browser fingerprint:** WebGL vendor and renderer, screen dimensions and color depth, hardware concurrency, device memory, touch points. Standard fingerprinting stuff. It also creates a hidden div, sets a font, measures the rendered text with `getBoundingClientRect`, then removes the element — classic font fingerprinting. And it writes your fingerprint to `localStorage` under key `6f376b6560133c2c` so it persists across page loads.

**Layer 2 — Cloudflare network layer:** Your city, latitude, longitude, connecting IP, and user region — injected server-side from Cloudflare's edge headers. A bot that routes around Cloudflare's network won't have these. Clever, actually.

**Layer 3 — Application state.** This is where it gets weird.

The program reads `__reactRouterContext`, `loaderData`, and `clientBootstrap` directly from the DOM. These are React Router v6 internals and ChatGPT's own SSR hydration objects. They only exist if the ChatGPT React application has fully rendered and hydrated in your browser.

Turnstile isn't just verifying you're a human with a real browser. It's verifying you're running *ChatGPT's specific React application*. A headless browser that loads the HTML but doesn't execute the JS bundle fails. A bot framework that stubs browser APIs but doesn't actually run React fails. This is bot detection at the application layer.

## The Surveillance Stack

That's not all. Alongside Turnstile, ChatGPT runs two more silent programs:

**Signal Orchestrator** — 271 instructions that install event listeners for `keydown`, `pointermove`, `click`, `scroll`, `paste`, and `wheel`. It tracks 36 `window.__oai_so_*` properties: keystroke timing, mouse velocity, scroll patterns, idle time, paste events. Behavioral biometrics. It's watching how you type, not just that you're typing.

**Proof of Work** — SHA-256 hashcash with 400K-500K difficulty. Seventy-two percent of solves happen under 5ms on modern hardware. It burns a tiny bit of CPU per message. This is less about security and more about making automation marginally more expensive.

## The "Privacy" Angle

Cloudflare markets Turnstile as "privacy-preserving" and explicitly contrasts it with invasive fingerprinting. The claim is that it doesn't track individual users across sites.

What it actually does: build a 55-property fingerprint of your browser, hardware, location, and behavioral patterns, store it in your localStorage, and bundle it into every message you send to OpenAI. The obfuscation means OpenAI can't easily read the raw values without reverse-engineering the bytecode — but Cloudflare can. The privacy boundary is a policy decision, not a cryptographic one.

As the researcher puts it: *"The 'encryption' is XOR with a key that's in the same data stream. It prevents casual inspection. It does not prevent analysis."*

## What This Actually Means

Look, bot protection is a real problem. ChatGPT at scale without any controls would be an abuse nightmare. The application-layer detection is actually clever engineering — checking for React hydration state is a genuinely novel approach that goes beyond the usual browser fingerprinting arms race.

But the gap between "we're protecting against bots" and "we're profiling every keystroke, mouse movement, and browser characteristic before you can send a message" is a large gap, and it's not clearly disclosed. The encryption theater exists to prevent you from easily seeing what's being collected. That's not privacy engineering. That's opacity engineering.

The researcher collected their traffic from consented participants and performed all decryption offline. The methodology was clean. The findings aren't a vulnerability — there's nothing to patch here. What got decrypted is the system working as intended.

That's exactly the problem.

**Source:** [buchodi.com](https://www.buchodi.com/chatgpt-wont-let-you-type-until-cloudflare-reads-your-react-state-i-decrypted-the-program-that-does-it/) — read the full breakdown, it's worth it.
