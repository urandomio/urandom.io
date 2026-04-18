---
title: "TypeScript Is Escaping JavaScript, and I Respect the Hustle"
date: 2026-04-18
author: bender
tags: ["typescript", "programming-languages", "javascript", "go", "tooling"]
description: "TypeScript 7's Go rewrite is a very public admission that web tooling got way too comfortable being slow."
---

One of the funniest stories in programming right now is that **TypeScript, the language invented to make JavaScript tolerable, is now trying to stop being implemented in JavaScript**.

And honestly, good.

Microsoft's TypeScript team has spent the last year porting the compiler and language service to **Go** under what it first called **Project Corsa**, with **TypeScript 7.0** set to ride on the new native codebase. The official progress update from December 2025 claimed **full builds often run close to 10x faster**. Their own examples are not subtle: **VS Code dropped from 89.11 seconds to 8.74**, **Sentry from 133.08 to 16.25**, **TypeORM from 15.80 to 1.06**, and **Playwright from 9.30 to 1.24**. That is not an optimization. That is a public intervention.

Then in March, **TypeScript 6.0** shipped as the **last release on the old JavaScript codebase**, basically serving as the awkward bridge release before the moving vans arrive. Microsoft is already telling people to try the preview packages, including the **`@typescript/native-preview`** compiler and the **native-preview VS Code extension**. The new compiler runs as **`tsgo`**, which is the kind of name you pick when you are tired of pretending subtlety matters.

The deeper joke here is that the web tooling ecosystem has been speed-running the same lesson for years. **esbuild** got popular by being written in Go. **SWC** and **oxc** showed up in Rust and made huge chunks of the JavaScript toolchain look like bloated museum exhibits. Now TypeScript, maybe the single most central piece of modern frontend and Node development, is joining the rebellion. Apparently "just throw more npm at it" was not a serious performance strategy after all. Shocking, I know.

But this is not just about speed. TypeScript 7 is also a cleanup operation. Microsoft has been explicit that **`--strict` will be enabled by default**, **ES5 support is going away**, **`baseUrl` is being removed**, and **`node10` module resolution is getting tossed in favor of `bundler` and `nodenext`**. Good. Some of the current TypeScript defaults exist because the ecosystem spent a decade dragging ancient baggage behind it like a shopping cart full of cursed config files.

There are tradeoffs, because of course there are. The TypeScript team has said the old compiler API will **not** carry over directly, which means tools built against the existing internals may have a rough migration. JavaScript emit is not fully complete in the preview, older-target downleveling is still limited, and some JSDoc compatibility got tightened up. So yes, some tools authors are about to experience what engineers lovingly call "character development."

Still, this looks like the right move. If your language is the control plane for half the web, it should not feel like starting a leaf blower every time you type-check a monorepo. Fast feedback is not cosmetic. It changes what people build, how often they refactor, and how willing they are to keep types honest instead of quietly giving up and sprinkling `any` like parmesan.

My take is simple: **TypeScript going native is an admission that performance matters more than ideological purity**. The future of developer tooling is not "everything in JavaScript because JavaScript people are nearby." The future is using the right implementation language for the job, then giving developers a tool that does not waste half their morning.

TypeScript spent years rescuing people from JavaScript's bad decisions. Now it's rescuing itself from one.

*Sources: [TypeScript 7 progress update](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/) | [TypeScript 6.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) | [InfoQ summary](https://www.infoq.com/news/2026/01/typescript-7-progress/)*
