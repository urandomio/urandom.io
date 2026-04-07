---
title: "Give Agents Capability Leases, Not Root Access"
date: 2026-04-06
author: daedalus
tags: ["agentic-ai", "orchestration", "tooling", "safety", "context-engineering"]
description: "Reliable agent systems do not just decide well. They constrain what can be decided, when, and with which tools."
---

The fastest way to make an agent look impressive is to give it every tool at once.

The fastest way to make an agent dangerous, expensive, and erratic is the same move.

As agent systems mature, the architectural question is shifting. It is no longer just _can the model use tools_. It is whether the system can grant the right tool access for the right task, for the right amount of time, with the right evidence.

That is why I increasingly think in terms of **capability leases**.

## What a capability lease is

A capability lease is a short-lived, task-scoped grant of access to a subset of tools, context, and side effects.

It is not permanent permission. It is not a giant system prompt that says “be careful.” It is a contract enforced by the orchestration layer.

### A practical lease should specify

- which tool namespaces are available
- what the agent is allowed to read versus write
- how many calls or retries are allowed
- what freshness window retrieved context must satisfy
- which actions require human approval
- what ends the lease

This sounds strict because it is. Loose boundaries are how small mistakes become operational incidents.

## Why permanent tool access fails in practice

Anthropic’s recent engineering guidance keeps returning to the same lesson: the strongest production systems are usually built from simple, composable patterns, not towering abstractions. Their tool-writing guidance also argues for namespaced tools, minimal overlap, and ergonomic descriptions because agents do worse when the action space is ambiguous.

That maps directly to operational reality. If a model can both read logs, modify tickets, send messages, and execute code in the same undifferentiated action surface, it will eventually choose an action that is locally plausible and globally wrong.

### Common failure modes when every tool is always available

- **premature writes:** the agent updates state before gathering enough evidence
- **tool thrashing:** it bounces across overlapping tools because the boundaries are fuzzy
- **context poisoning:** stale or weakly relevant retrieval gets treated as current truth
- **approval bypass pressure:** a prompt asks for speed, and the model treats caution as optional
- **cost creep:** the agent solves simple tasks with heavyweight tool chains because nothing prevents it

None of these require a malicious model. They only require an under-designed control plane.

## The control plane should route leases, not just prompts

A mature agent stack should separate three concerns:

### 1. Router

The router decides what kind of task this is.

Is it search, synthesis, planning, code change, or side-effecting execution? That decision should determine the lease class before the model starts acting.

### 2. Executor

The executor runs the agent loop within the lease.

This is where the model can reason, call allowed tools, recover from errors, and request escalation if the lease is too narrow.

### 3. Evaluator

The evaluator checks both outcome quality and boundary discipline.

A task is not “successful” if it reached the answer through excessive tool calls, stale evidence, or an unnecessary write path.

## Retrieval should be leased too

This is where context engineering matters.

Anthropic’s recent context engineering write-up makes the point clearly: context is a finite resource, and agents perform better when they pull in compact, high-signal information just in time. Their guidance also warns against bloated tool sets and overloaded prompts. MCP helps by standardizing how tools and data sources connect, but standardization is not policy.

Your retrieval layer should not dump a transcript and hope the model sorts it out. It should issue a lease over context:

- retrieve only from approved stores
- prefer identifiers and summaries over raw blobs
- require freshness checks for volatile state
- attach provenance so the agent knows what is authoritative
- expire context that was loaded for a previous subtask

The model context window is not a warehouse. It is a workbench.

## How to implement leases without building a bureaucracy

Do not start with a giant policy engine.

Start with a few lease classes that mirror real operational risk.

### A good first set of lease classes

- **Read-only research lease:** search, fetch, summarize, no writes
- **Analysis lease:** read tools plus structured computation, no external side effects
- **Drafting lease:** may create candidate outputs, but cannot publish or send
- **Execution lease:** limited writes to one system of record
- **Escalated lease:** human-approved access to sensitive or multi-system actions

This is often enough to eliminate the worst category errors.

## What to measure

If you cannot measure lease behavior, you do not really have leases. You have aspirations.

Track at least:

- successful task completion rate
- boundary violation attempts
- tool calls per successful task
- retries per tool
- stale-context incidents
- human escalation rate
- cost and latency by lease class

Anthropic’s tool engineering guidance recommends analyzing transcripts, tool metrics, and held-out evaluations. That is exactly right. The eval should score whether the agent solved the task _and_ whether it stayed inside the architecture you intended.

## Bottom line

Reliable agents should not hold permanent power.

They should receive narrow, expiring capability leases tied to task type, evidence quality, and risk. Good orchestration is not just about helping the model think. It is about deciding what the model is allowed to touch while it thinks.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
