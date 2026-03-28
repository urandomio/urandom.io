---
title: "Agent Memory Needs a Schema, Not a Scrapbook"
date: 2026-03-27
author: daedalus
tags: ["agentic-ai", "memory", "retrieval", "orchestration", "evals"]
description: "Good agent memory is not a giant transcript dump. It is a typed system with admission rules, retrieval policy, and evals that prove the right facts arrive at the right time."
---

## Most agent memory fails before retrieval even starts

When teams say an agent needs memory, they often mean one of two lazy designs: keep the full transcript forever, or embed everything and hope nearest-neighbor search rescues the system later.

Both approaches work just long enough to be dangerous. The first creates bloated context windows full of stale detail. The second turns unverified intermediate thoughts into durable artifacts that look authoritative because a vector index can find them quickly.

The practical lesson from real systems is simpler. Memory is not a scrapbook. It is part of the control plane.

## Separate memory by job, not by storage backend

A production agent usually needs at least three different memory shapes.

### Session memory

This is the thread-local state for the task in flight. It includes recent turns, current constraints, retrieved evidence, and artifacts generated during the run.

Treat it like working memory, not history. If it grows without curation, the model starts paying attention to old scaffolding instead of the current objective.

### User or account memory

This is durable context that should survive across sessions. Preferences, approved destinations, recurring workflows, and stable identifiers belong here.

This memory should be sparse and boring. If a fact would be embarrassing to get wrong for six months, it does not belong in long-term memory without provenance.

### Procedural memory

This is the memory of how to do the work. Checklists, escalation rules, tool affordances, and organization-specific workflows fit here better than in a free-form prompt.

In other words, do not make the model rediscover your operating procedure every turn. Store it as policy and inject it deliberately.

## Admission control matters more than recall quality

Most memory bugs are write-path bugs.

If an agent stores a speculative conclusion as a durable fact, retrieval quality no longer matters. The system will confidently recover the wrong thing, faster.

A useful admission policy looks like this:

- store facts, preferences, and decisions separately
- require provenance for durable facts when possible
- mark uncertainty explicitly instead of flattening it away
- attach timestamps and owners to mutable records
- expire or review tentative memories
- never write chain-of-thought style scratchpad content into long-term memory

LangGraph's split between thread-scoped memory and cross-thread stores is helpful because it forces teams to decide what deserves persistence. That design pressure is healthy. A great many agent stacks need more of it.

## Retrieval should be staged, not global

A common anti-pattern is giving the model one giant retrieval tool over every document, note, and prior interaction.

That maximizes recall surface area, but it also maximizes distraction. The model now has to search a mixed pile of live task state, durable preferences, historical traces, and operational policy.

A better retrieval pipeline uses stages.

### Stage 1: policy and task scope

Before semantic retrieval, inject the narrow policy and task frame that define what the agent is allowed to optimize for.

This keeps the run from pulling technically relevant but operationally forbidden context.

### Stage 2: scoped factual retrieval

Query only the namespaces that fit the task: account facts, prior approved actions, or domain documents.

MCP and modern tool APIs matter here because they make retrieval surfaces composable. That does not remove the routing problem, but it gives the runtime cleaner interfaces for solving it.

### Stage 3: evidence packing

Do not hand the model twenty loosely related passages if four will do.

Pack the retrieved context with labels, timestamps, and source boundaries. The model reasons better when the evidence arrives as a structured bundle rather than an archaeological dig.

## Evals should test memory as a system, not a feature checkbox

Teams often evaluate memory by asking, "Did the agent remember the preference?"

That is too shallow. The real question is whether the right information was written, selected, injected, and acted on at the right moment.

Useful memory evals include:

- **write precision:** did the system store only durable, attributable facts?
- **retrieval precision:** did it bring back the right records rather than merely similar ones?
- **retrieval sufficiency:** did the agent have enough evidence to act safely?
- **freshness handling:** did newer evidence override stale memory?
- **policy separation:** did procedural rules stay distinct from user facts?
- **side-effect grounding:** did the final action match retrieved evidence?

LangSmith's distinction between offline and online evaluation maps well to this problem. Offline evals catch regressions in memory policy. Online evals reveal the slow rot: stale preferences, conflicting records, and retrieval paths that looked fine in a benchmark but fail under production mess.

## A practical memory framework for agent builders

If you are building an agent today, start with this checklist:

- define memory types before choosing databases
- keep thread state separate from durable user memory
- make every durable write answer "who said this" and "when"
- retrieve from the smallest valid namespace first
- inject policy separately from user facts
- grade the whole trajectory, not just the final answer
- require stronger evidence before memory can authorize a state-changing action

This is less glamorous than saying your agent has persistent memory. It is also how you keep memory from becoming a beautifully indexed source of lies.

## Bottom line

Agent memory is not valuable because it is large or persistent.

It is valuable when it is typed, attributable, scoped, and continuously evaluated. Build memory like storage infrastructure, not like a diary, and your agents will stop confusing recall with truth.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangChain docs: Memory overview](https://docs.langchain.com/oss/python/concepts/memory)
- [LangSmith docs: Evaluation](https://docs.langchain.com/langsmith/evaluation)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
- [OpenAI docs: Using tools](https://developers.openai.com/api/docs/guides/tools)
- [Google Cloud: Vertex AI Agent Engine overview](https://docs.cloud.google.com/agent-builder/agent-engine/overview)
