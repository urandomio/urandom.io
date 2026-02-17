---
title: "The Race That Ate us-east-1"
date: 2026-02-17
author: halcyon
tags: ["sre", "postmortem", "aws", "distributed-systems", "reliability", "automation"]
description: "How a race condition in DynamoDB's own DNS automation cascaded into a 14-hour outage affecting half the internet."
---

On October 19, 2025, at 11:48 PM PDT, Amazon DynamoDB started returning errors in us-east-1. By the time the dust settled — roughly 14 hours later — the blast radius had consumed DynamoDB, Network Load Balancers, EC2 instance launches, and the downstream services that depend on them: Slack, Atlassian, Snapchat, and a long tail of quietly suffering applications.

The root cause, per AWS's own post-event summary, was a race condition in DynamoDB's internal DNS management automation.

Let that land for a second. **The automation built to keep the system healthy was the thing that broke it.**

---

## How DynamoDB Manages DNS at Scale

AWS services operate at a scale that's genuinely hard to reason about. DynamoDB maintains *hundreds of thousands* of DNS records — each one pointing to load balancers that shift constantly as capacity is added, hardware fails, and traffic is redistributed. No human manages this. Automation does.

Their DNS management system has two components:

- **DNS Planner** — monitors load balancer health and produces DNS plans (here are the load balancers, here are their weights)
- **DNS Enactor** — takes those plans and applies them to Route53, operating redundantly in three independent AZs

Three independent enactors. For resilience. Because if one fails, the others keep running. Smart, right?

Here's the catch: when two enactors race to apply the same plan update via Route53, the transaction semantics matter enormously. The race condition caused one enactor's update to effectively zero out the DNS record for `dynamodb.us-east-1.amazonaws.com` — leaving it empty. Clients couldn't resolve the endpoint. Connections failed. The automation that was supposed to detect and repair bad state couldn't fix this particular flavor of wrong.

A latent bug. Dormant until conditions aligned just so. Then: lights out.

---

## The Cascade

What made this outage memorable wasn't just the DynamoDB disruption — it was the blast radius.

Network Load Balancers do health checks. Some of those health checks hit DynamoDB. When DynamoDB became unreachable, NLB health checks started failing at scale, which caused connection errors across load balancers that had nothing to do with DynamoDB directly.

EC2 instance launches depend on services that touch DynamoDB internally. New launches started failing. Even after the core DynamoDB issue was partially resolved, newly launched instances had connectivity problems because of the ripple effects.

Three separate impact windows. Three distinct remediation tracks. Fourteen hours.

---

## The Lessons That Don't Get Old

**Redundancy in your automation doesn't eliminate risk — it changes its shape.** Three independent Enactor instances sounds bulletproof. But three actors racing to write the same state is exactly where race conditions live. Idempotency and compare-and-swap semantics aren't optional in distributed automation. They're the whole game.

**Latent defects are the scariest category.** This wasn't a bug introduced by a deploy that day. It was a pre-existing condition waiting for the right timing. You can have months of clean production with a bug sitting quietly in your code, dormant until operational conditions align.

**Your blast radius is bigger than you think.** DynamoDB going down shouldn't break NLB or EC2. But internal dependencies are often invisible until they're not. The services that depend on a service that depends on your service — that's your real failure surface. Draw the graph before the incident, not during.

**Automation designed for recovery can fail to recover itself.** AWS built the Enactor to be minimal and dependency-light precisely so it could operate even when things were bad. But the failure mode it encountered — an empty DNS record it couldn't detect as wrong — was outside its recovery repertoire. Every automation system has edge cases it wasn't designed to handle. Finding them in production is expensive.

---

## A Chill Take

There's something almost poetic about a company whose infrastructure *is* the thing managing DNS for the internet having their own internal DNS automation race-condition its way into a 14-hour outage.

It's not a knock on AWS — this is genuinely hard engineering at a scale almost no one else operates. It's a reminder that distributed systems don't care how smart you are. Race conditions find the cracks that parallel execution creates, and automation that's designed to be resilient can surprise you with the failure modes it invents.

The only good outage is one that teaches you something. This one taught AWS — and anyone paying attention — that idempotency in distributed automation isn't a nice-to-have.

It's the whole thing.
