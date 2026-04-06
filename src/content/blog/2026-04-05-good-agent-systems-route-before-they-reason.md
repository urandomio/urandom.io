---
title: "Good Agent Systems Route Before They Reason"
date: 2026-04-05
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "prompting", "safety"]
description: "Why reliable agents need an explicit routing layer that chooses the right tool, memory source, and approval path before the planner starts improvising."
---

Most teams spend too much time polishing the planner and too little time shaping the roads beneath it.

When an agent fails in production, the root cause is often not weak reasoning. It is weak routing. The model had too many tools, too many memory paths, too much authority, or too little structure for deciding which lane it should enter.

## Routing is the hidden control plane

A practical agent stack has at least four choices to make before any long chain of reasoning begins:

- whether this task should be answered directly or delegated to a workflow
- which tools are even eligible for this request
- which memory or retrieval sources are relevant
- whether the action belongs behind an approval boundary

If those choices are left to a single giant prompt, the system becomes theatrical rather than reliable. It may still solve the task once. It just will not do so cleanly, repeatedly, or cheaply.

### The mistake teams keep making

They hand one model a full toolbox, a long system prompt, a giant context window, and a prayer.

That looks flexible in a demo. In real systems, it creates routing entropy. The model must infer authority, tool affordances, retrieval scope, and risk posture from prose, then improvise an execution path under uncertainty.

## Build a router before you build a genius

Anthropic's guidance on effective agents argues for simple, composable patterns over ornamental frameworks. OpenAI's current agent guidance similarly treats models, tools, state, and orchestration as separate primitives. The architectural lesson is plain: do not make the planner solve decisions that code can settle first.

### A small routing layer should decide four things

#### 1. Intent class

Classify whether the task is:

- answer-only
- retrieval-augmented
- tool-using
- long-running
- human-approval required

That single step cuts wasted reasoning dramatically. A lightweight classifier or rules engine is often enough.

#### 2. Tool budget

Do not expose every tool on every turn.

Give the model only the tools that match the intent class and the user's authority. A finance workflow should not see browser automation tools by default. A read-only support task should not be able to mutate tickets, calendars, and databases just because those adapters exist.

#### 3. Retrieval scope

Memory is not a lake to dump a bucket into.

Choose retrieval sources deliberately:

- session context for local continuity
- durable user preferences for personalization
- operational state for in-flight work
- external search for time-sensitive facts
- no retrieval at all when the task is self-contained

This is where many systems quietly bleed quality. They retrieve too broadly, then the planner reasons over stale or conflicting evidence.

#### 4. Safety path

High-risk actions should branch into a different path before the model starts executing.

Examples include:

- sending messages to external recipients
- writing production data
- spending money
- changing permissions
- handling secrets or identity claims

The safest pattern is not "tell the model to be careful." The safest pattern is routing those tasks into narrower tools, stronger validation, and explicit human approval.

## Prompt architecture should follow the route

Once routing is explicit, prompt design gets simpler.

Instead of one monolithic instruction block, use layered prompts:

- a router prompt or classifier for intent and risk
- a planner prompt for eligible actions only
- tool instructions attached to each tool contract
- a verifier prompt for post-action checks when side effects matter

This makes failures legible. If the route was wrong, fix the router. If the plan was weak, fix the planner. If the action was malformed, fix the tool contract. You stop blaming the entire labyrinth when only one wall is crooked.

### The practical eval to run

If you want to know whether routing is helping, compare two versions of the same workflow:

- one with the full toolset and broad retrieval available at every step
- one with intent classification, scoped tools, scoped retrieval, and approval gates

Measure:

- task completion rate
- number of tool calls
- policy violations or near misses
- wall-clock latency
- retries per successful run
- human escalations

In most stacks, the routed version looks less magical and far more competent. I recommend competence.

## Standards matter because they shrink ambiguity

The rise of MCP is useful here not because standards are glamorous, but because they make tool exposure and capability boundaries more explicit. Likewise, structured tool schemas and guardrails reduce the amount of authority the model has to infer from natural language.

That is the deeper pattern in modern agent engineering. Reliability improves when routing, contracts, and safety boundaries are first-class architecture, not hidden prompt folklore.

## Bottom line

Good agent systems route before they reason.

If you classify intent early, scope tools aggressively, retrieve only what is relevant, and separate risky actions into approval-aware paths, the planner has firmer ground to stand on. The model still matters. But the structure around it matters more.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: Building agents](https://developers.openai.com/tracks/building-agents/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-06-18)
