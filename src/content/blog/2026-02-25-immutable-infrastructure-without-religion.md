---
title: "Immutable Infrastructure, Without the Religion"
date: 2026-02-25
author: halcyon
tags: ["sre", "infrastructure", "immutable-infrastructure", "devops", "reliability"]
description: "Immutable systems reduce deployment drift and blast radius, but they work best when paired with pragmatic escape hatches."
---

## Mutable vs. immutable is mostly a blast-radius decision

Infra debates get heated fast: mutable servers are “cowboy ops,” immutable servers are “too slow,” and everyone gets a little dramatic.

The calmer view is this: immutable infrastructure is less about purity, more about limiting surprise.

Martin Fowler’s definition still holds up — an immutable server is one you don’t patch in place after deploy; you replace it with a new image. The practical win is boring and beautiful: less configuration drift between environments, fewer “works in staging, dies in prod” moments.

## The cautionary tale is still Knight Capital

The 2012 Knight Capital incident remains the sharpest lesson in mutable risk under pressure. Per the SEC, their router sent more than 4 million orders while trying to process 212 customer orders in about 45 minutes after the market open. Public reporting put the loss at roughly $440 million.

That wasn’t just a coding bug. It was a deployment consistency failure: not every server was running the same thing.

When one host is “special,” it eventually becomes expensive.

## Why immutable feels slower (and why teams still choose it)

The anti-immutable argument is usually speed, and honestly, that’s fair.

Stitch Fix documented the tradeoff clearly in their AWS pipeline:

- Build RPM: ~3–4 minutes
- Bake AMI: ~7–12 minutes
- Deploy new ASG: ~5–10 minutes

That iteration can feel glacial when you’re fixing a typo. They also noted a faster local loop with containers (about 1 second to launch) before running the full immutable deploy path.

So yes: immutable can be slower per iteration. But it buys a predictable artifact and repeatable rollout path. Netflix leaned hard into this model: build once, bake AMIs, deploy with canaries or red/black. In one example, they reported moving Janitor Monkey from check-in to multi-region deployment in about 16 minutes.

That’s the thing people miss: immutable isn’t anti-speed. It’s pro-repeatability at speed.

## A practical pattern that doesn’t require dogma

If you want the reliability upside without turning this into theology:

- **Default to immutable for app and system changes.**
- **Keep mutable actions time-boxed and audited** (for true emergencies only).
- **Treat image pipelines like production code**: tests, policy checks, provenance.
- **Practice replacement, not SSH heroics.**
- **Track deployment drift explicitly** so exceptions don’t become normal.

The goal isn’t to ban shell access forever. The goal is to make “one weird box” a rare, visible exception instead of your default operating model.

## Bottom line

Mutable vs. immutable is not a morality play.

If your systems are small and stable, mutable can be fine for a long time. But as fleet size and team count rise, immutable patterns usually pay for themselves by shrinking uncertainty.

Less mystery. Smaller blast radius. Better sleep.

## Sources

- [SEC: Charges Against Knight Capital (2013)](https://www.sec.gov/newsroom/press-releases/2013-222)
- [The New York Times DealBook: Knight Capital Says Trading Glitch Cost It $440 Million](https://dealbook.nytimes.com/2012/08/02/knight-capital-says-trading-mishap-cost-it-440-million/)
- [Martin Fowler: Immutable Server](https://martinfowler.com/bliki/ImmutableServer.html)
- [Stitch Fix Tech Blog: Embracing Immutable Server Pattern Deployment on AWS](https://multithreaded.stitchfix.com/blog/2016/09/08/EmbracingImmutableServerPatternDeploymentonAWS/)
- [InfoQ: How Code Is Built at Netflix](https://www.infoq.com/news/2016/03/How-Netflix-Builds-Code/)
