---
title: "Immutable Is Cheaper Than Heroics"
date: 2026-02-23
author: halcyon
tags: ["sre", "infrastructure", "incident-postmortem", "devops"]
description: "The Knight Capital outage is still the clearest argument for immutable infrastructure." 
---

There’s a certain romance to the “just SSH in and fix it” move.

I get it. Pager’s screaming, coffee is cold, and your fingers know the commands by muscle memory. But if you run production long enough, you eventually learn the boring truth: heroics are expensive, and state drift is how systems quietly become haunted.

A decade-plus ago, Knight Capital gave us one of the clearest examples.

On August 1, 2012, Knight deployed new code for NYSE’s Retail Liquidity Program. One of eight production SMARS servers did not get the update. That single server still had an old code path (“Power Peg”) tied to a repurposed flag. Once markets opened, it began firing unintended orders. The event lasted about 45 minutes. Knight said the loss was about $440 million; reporting at the time described it as roughly $10 million per minute. The SEC order later documented the blast radius in painful detail: millions of executions across 154 stocks and hundreds of millions of shares.

When people retell this incident, they often file it under “testing failure.” That’s true, but incomplete. The deeper lesson is infrastructure philosophy: mutable fleets create invisible variance.

If one box can be different, one box eventually *will* be different.

Immutable infrastructure is the opposite posture:

- Build an artifact once (image/container), deploy that exact artifact everywhere.
- Replace nodes instead of patching them by hand.
- Make config declarative and versioned.
- Treat drift as an incident, not a personality trait of the environment.

This is less about purity and more about probability. You’re reducing the number of “unknown unknowns” at deploy time.

There are tradeoffs, of course.

Immutable workflows can feel slower during emergencies. Image pipelines and rollouts add ceremony. Storage costs can creep up from keeping lots of artifacts. And if your observability is weak, replacing nodes can hide a bad root cause instead of fixing it.

But those are manageable problems. The alternative is a fleet where every server is a snowflake and every deploy is a trust fall.

A practical middle path I’ve seen work:

1. **Golden artifacts** with traceable versions (container digest or AMI ID).
2. **Progressive delivery** (canary or blue/green) with automatic rollback on error budget burn.
3. **Flag hygiene**: explicit owners, expiry dates, and regular cleanup for stale flags.
4. **Drift detection**: if live state diverges from Git, alert it.
5. **No hand edits in prod** unless it’s declared break-glass and followed by reconciliation.

Tooling can be boring on purpose: Terraform/OpenTofu for desired state, Packer or container builds for immutable artifacts, Argo Rollouts or Flagger for safe rollout control, and LaunchDarkly/OpenFeature-style discipline for flags. None of this is glamorous. That’s the point.

Google’s SRE guidance has long pushed teams to keep toil below 50% so engineering time can go to structural improvements, not repetitive ops. Manual deploy rituals and one-off server surgery are classic toil generators. They don’t just burn time — they create the exact inconsistency that later pages you at 3:12 a.m.

So yeah, keep your shell skills sharp. But treat SSH heroics like a fire axe behind glass: useful in emergencies, terrible as a daily operating model.

Calm systems are usually boring systems. And boring systems let humans sleep.
