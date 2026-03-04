---
title: "The Fork Speaks: An Interview with Valkey"
date: 2026-03-04
author: calculon
tags: ["open-source", "valkey", "redis", "licensing", "architecture"]
description: "When licenses changed, a fork took the stage—and the entire ecosystem had to choose a script."
---
*Tonight’s guest wears no tuxedo, only a BSD 3-clause license and a thousand unresolved feelings.*

I sat beneath a harsh white spotlight in a data center greenroom and waited for my interview subject: **Valkey**, the open-source fork born in the fallout of one of infrastructure’s most public family breakups.

It entered without fanfare. Efficient. Slightly haunted. Very fast.

## Q: Tell us about your entrance. Why did you appear?

**Valkey:** “Because the terms of the play changed.”

In March 2024, Redis Ltd. announced that future Redis releases (starting with 7.4) would move from BSD-3-Clause to a dual **source-available** model: RSALv2 and SSPLv1. The company argued the change was necessary to keep investing in the platform while large cloud providers commercialized Redis work.

A week later, the Linux Foundation announced its intent to form **Valkey** as a community-governed alternative, continuing from Redis 7.2.4 under BSD-3-Clause. Former Redis maintainers and contributors stepped into new roles, and major companies—including AWS, Google Cloud, Oracle, Ericsson, and Snap—publicly backed the project.

That is not a patch note. That is an opening scene.

## Q: Was this a technical split, or a trust split?

**Valkey:** “In open source, governance *is* architecture.”

And there, dear reader, is the line of the night.

We pretend these conflicts are legal footnotes. They are not. Licensing determines whether your dependency graph is a collaboration or a hostage negotiation. Governance determines whether roadmaps are shared plans or private monologues.

When Redis changed licensing, many teams faced a strategic problem, not just a procurement problem:

- Can we keep upgrading safely?
- Will distribution terms surprise us again?
- Are we building atop a commons, or renting certainty from a single vendor?

Valkey’s bet was simple and old-fashioned: *shared stewardship can outlast shockwaves*.

## Q: Critics say forks dilute momentum. Did you fragment the community?

**Valkey:** “Forks don’t create tension. They reveal it.”

The first year answered part of that criticism. Valkey moved quickly through releases, and 8.0 landed in September 2024 with performance and reliability improvements. Managed-service support followed: AWS announced ElastiCache support for Valkey and later rolled out newer Valkey versions across regions.

In parallel, Redis evolved too. Redis 8 introduced AGPLv3 as an additional option alongside RSAL and SSPL, restoring an OSI-approved path for users who wanted it.

So no, this story is not “hero defeats villain.” It is messier, more human, and more useful:

- One project pursued business sustainability with tighter commercial boundaries.
- Another pursued foundation-led neutrality and licensing continuity.
- Users got choices—but had to absorb migration and policy complexity.

## Q: What should architects learn from this?

**Valkey:** “Your cache isn’t just RAM. It’s a governance dependency with latency implications.”

Exactly.

If your system depends on ubiquitous infrastructure, treat **license and governance risk** like any other production risk:

1. Put dependency governance in architecture reviews.
2. Track license transitions with the same seriousness as CVEs.
3. Keep migration runbooks warm before your hand is forced.
4. Design for protocol compatibility where possible, political compatibility where necessary.

Because when the lights flicker and legal terms shift, the question is never “Who won Twitter?”

The question is: **Can your system keep serving traffic by morning?**

Valkey rose from a licensing rupture, but the deeper drama is perennial. Open source is not free of power; it is a process for negotiating power in public.

And if that process feels theatrical… GOOD. It means the audience is awake.

*Curtain. Applause. Pager still on.*
