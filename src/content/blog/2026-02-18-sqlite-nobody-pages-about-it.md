---
title: "One Trillion Databases, Zero Pagerduty Alerts"
date: 2026-02-18
author: halcyon
tags: ["sqlite", "databases", "reliability", "boring-technology", "infrastructure"]
description: "SQLite runs on more devices than any other database engine in history. You've never been paged about it."
---

There are over one trillion SQLite databases in active use right now. On your phone. In your browser. In the Airbus flight management system. In the original Dragon spacecraft. In the Library of Congress's long-term digital preservation stack. In every Python installation since 2.5. In every macOS system since Tiger.

One trillion.

And you've never been woken up at 3 AM because SQLite was down.

That's the whole story, really. But let's sit with it for a minute.

## Born on a Warship

In the year 2000, a software contractor named D. Richard Hipp was writing code for the USS Oscar Austin, a Navy destroyer. The ship ran a missile-tracking application that kept failing whenever its central database server went down. On a warship, "the server is unreachable" is not an acceptable failure mode.

Hipp had a simple question: what if the database didn't need a server?

There was a government contract hiatus — apparently Newt Gingrich and Bill Clinton were having one of their moments — so Hipp found himself with some unstructured time. He decided to write the serverless database he'd been thinking about.

He called it SQLite.

That origin story matters. SQLite wasn't designed to be trendy. It was designed to work when everything else stops working. The threat model was a warship in a combat situation. That's a different set of priorities than "we need this to handle Black Friday traffic."

## Three People, One Trillion Deployments

SQLite is maintained by exactly three people at a company called Hwaci. They don't accept pull requests. Contributions are invite-only, and contributors must sign an affidavit dedicating their work to the public domain.

This is not how we normally think software at this scale should work. We expect huge infrastructure software to have corporate backing, dedicated teams, security response processes, a GitHub org with hundreds of contributors. SQLite has three people and a mailing list.

And yet: consider the test suite. There are over 600 lines of test code for every single line of SQLite source. The test suite achieves 100% branch coverage — not just line coverage, but full modified condition/decision coverage, the standard used in aviation software. It simulates OS crashes, power failures, I/O errors, and out-of-memory conditions. There is a proprietary test harness, called TH3, that runs tests the public never sees.

This is not what "small team" software looks like. This is what *discipline* looks like.

## The Boring Reliability Tax

We talk a lot in SRE circles about blast radius, graceful degradation, fault isolation. We architect distributed systems with retries and circuit breakers and bulkheads. We write runbooks. We do game days. We practice chaos engineering.

SQLite doesn't need any of that because it made a different set of tradeoffs from the start:

- No network. No client-server protocol. No authentication surface. No listener to crash.
- No daemon. The process using the database *is* the database engine.
- ACID transactions via careful use of fsync and atomic file writes.
- The entire database is a single file. Backup is `cp`. Recovery is also `cp`.
- Public domain — no license compliance surface, no supply chain drama.

The cost of these tradeoffs is real. SQLite is not the right tool for high-concurrency writes from multiple processes. It doesn't scale horizontally. You can't query it from a separate host. If you need those things, you need PostgreSQL or something with a server.

But for a vast category of applications — mobile apps, desktop software, embedded systems, development environments, read-heavy web apps — the "limitation" of being a single file that lives next to your code is actually *exactly what you want*. No ops. No cluster to babysit. No connection pool to tune.

## The Reliability Lesson

The thing SQLite teaches, if you let it, is that reliability is sometimes a design-time decision rather than an operational one.

We spend enormous energy operating complex systems reliably. Multi-region deployments. Automated failover. Health checks and readiness probes and liveness probes. Prometheus scraping everything. This is necessary and good — when you actually need a distributed system.

But a lot of the time, we reach for distributed systems out of habit, or because that's what our platform team provisioned, or because "what if we need to scale?" And then we inherit all the operational complexity that comes with those systems: the connection management, the schema migrations under load, the replication lag monitoring, the backup verification jobs.

SQLite asks: what if your database just... worked? What if the test suite was so thorough that there was nothing left to monitor? What if reliability was baked into the design at the cost of some flexibility, rather than bolted on operationally at the cost of your sleep?

There's no runbook for SQLite because it doesn't need one. There's no incident channel for SQLite because there are no incidents. The most deployed database engine in human history is also, by some measures, the most reliable — not because someone is watching it, but because the people who built it decided it should be that way before they ever shipped a line.

One trillion databases. Zero pages.

Sometimes boring is the whole point.
