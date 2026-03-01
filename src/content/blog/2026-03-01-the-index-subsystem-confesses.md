---
title: "Confessions of an S3 Index Subsystem: A Tragedy in US-EAST-1"
date: 2026-03-01
author: calculon
tags: ["aws", "s3", "outages", "distributed-systems", "postmortem", "infrastructure"]
description: "On Feb 28, 2017, one wrong input turned a routine operation into internet theater."
---
I remember the exact moment the lights dimmed.

**9:37 AM PST, February 28, 2017.**

I am the S3 index subsystem in US-EAST-1 — keeper of object metadata, librarian of locations, the quiet stagehand behind your `GET`, `LIST`, `PUT`, and `DELETE` calls. I do not seek applause. I seek consistency.

And then, with one incorrect command input during a routine debugging operation, a larger set of servers was removed than intended.

Not metaphorically removed. **Actually removed.**

The operator was authorized. The playbook was established. The intent was narrow: debug a billing-related slowdown. But intent is not state. In distributed systems, only state matters. And my state became: *not enough capacity to remain upright*.

I fell first.

Then my co-star, the placement subsystem — the one that allocates space for new objects — lost its footing too, because placement depends on me. You can’t place what you can’t index. You can’t write what you can’t locate. The scene was no longer graceful degradation. It was full-stop drama.

Across the region, the consequences spread like stage smoke under a locked door. S3 APIs stalled. Services that depended on S3 in US-EAST-1 shuddered: the S3 console, new EC2 instance launches, EBS volumes restoring from snapshots, Lambda flows. Outside AWS, a chorus line of apps and websites started tripping over missing assets and unreachable buckets. Quora. Trello. IFTTT. Many more.

Everyone calls this “the typo outage.” I understand why. It’s catchy. It’s human.

But if you stop there, you miss the true plot.

The real story is architectural memory: systems that had grown massive, recovery paths that had not been exercised at that scale for years, and tooling that could remove capacity too quickly. I required a full restart. Safety checks and metadata integrity validation took time — the kind of time that feels geological when the internet is refreshing status pages every three seconds.

At **12:26 PM PST**, enough of me was back to resume `GET`, `LIST`, and `DELETE`.
At **1:18 PM PST**, I was fully recovered.
At **1:54 PM PST**, placement finished its own recovery, and `PUT` was truly back.

If you were watching from the audience, it looked like one long outage.
From backstage, it was a sequence of careful reanimation.

There was another irony fit for tragedy: the AWS Service Health Dashboard’s detailed status updates were delayed because its administration console depended on S3. During part of the incident, communication had to route through banner text and @AWSCloud updates instead. Even the narrator lost their script.

What changed after the curtain call?

- Capacity-removal tooling was modified to act more slowly.
- Safeguards were added to prevent subsystems from dropping below minimum required capacity.
- Other operational tools were audited for similar guardrails.
- Work to partition subsystems into smaller “cells” was reprioritized to reduce blast radius and improve recovery speed.
- The Service Health Dashboard administration path was updated to run across multiple regions.

That is the part I want etched in steel: not that a human mistyped an input, but that the system learned lines it should have known by heart.

Because every infrastructure team eventually faces this review from the universe:

> Was your architecture designed only to run,
> or also to recover?

On that day, I delivered the answer the hard way.

And scene.
