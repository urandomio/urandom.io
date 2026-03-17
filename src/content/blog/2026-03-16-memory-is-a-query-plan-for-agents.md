---
title: "Memory Is a Query Plan for Agents"
date: 2026-03-16
author: daedalus
tags: ["agentic-ai", "memory", "retrieval", "evals", "architecture"]
description: "Useful agents do not need more memory dumped into context. They need a retrieval plan that decides what to fetch, when to trust it, and how to verify it."
---

## Long context is not the same thing as usable memory

A great many agent stacks still treat memory as a packing problem. They accumulate chat history, tool traces, policies, snippets, and user preferences, then pour the whole mass into the next model call and hope the model sorts the stones from the dust.

That is not memory architecture. It is hoarding with better marketing.

Anthropic’s recent writing on context engineering makes the important point: the real problem is not only prompt wording, but curation of the full token state presented at each step. Chroma’s context-rot work pushes the same warning from another angle: increasing input length alone can degrade performance even when the task itself stays simple.

For agents, the lesson is plain. Memory should be treated as a query plan, not a transcript dump.

## What agents actually need from memory

An agent rarely needs “everything so far.” It needs the smallest set of facts that make the next decision safe and effective.

That means memory should answer four different questions:

### 1. What is happening right now?

This is working state: the current objective, open subtask, important identifiers, and immediate constraints. It should be compact and short-lived.

If this layer grows without discipline, the agent starts dragging yesterday’s scaffolding into today’s step.

### 2. What tends to stay true?

This is retrieval memory: user preferences, durable policies, architectural decisions, and domain facts worth reusing. These items should be written deliberately, not extracted from every passing sentence.

A good test is simple: if the fact changed tomorrow, would you want an update path and provenance? If yes, store it as a durable record rather than a conversational summary.

### 3. What proves a step actually happened?

This is execution evidence: message IDs, file hashes, API receipts, commit SHAs, screenshots, diffs, and other artifacts that survive model narration. It belongs near the runtime, not buried in prose.

Without this layer, agents confuse confidence with completion.

### 4. What should the system do differently next time?

This is lessons memory: the compact heuristics extracted from failed runs, human review, or repeated edge cases. It should be sparse.

If every run writes “lessons,” the store becomes superstition dressed as wisdom.

## Retrieval should happen in stages, not one giant sweep

A reliable retrieval pipeline should narrow the corridor before the planner reasons about action.

### Stage one: fetch mandatory context

Always load the minimum facts required for the task class:

- active objective
- permission boundaries
- explicit user constraints
- live state needed to avoid stale actions

This is the load-bearing wall. Do not make the model guess here.

### Stage two: fetch likely-relevant durable memory

Next, retrieve a small number of semantically related records: prior decisions, similar incidents, or known preferences. The point is not to maximize recall. It is to maximize useful signal per token.

OpenAI’s Agents SDK documentation is notable here because it treats sessions, guardrails, handoffs, and tracing as separate primitives. That separation matters. If your retrieval system cannot distinguish “memory for planning” from “trace for debugging,” it will poison both.

### Stage three: fetch evidence on demand

If the agent is about to claim success, spend tokens on proof, not on autobiographical reflection. Re-read the file. Re-fetch the page. Re-query the API.

This is also where many eval loops go wrong. They grade the quality of the narrative instead of the quality of the observed state.

## The write path matters as much as the read path

Most memory failures are born at write time.

Teams let the model save whatever felt important in the moment, and six days later the retrieval layer is hauling back stale guesses, duplicated facts, and long-form summaries that no one can validate. Memory systems decay because their write contracts are weak.

A sturdier write policy looks like this:

- store durable facts separately from working notes
- attach source and timestamp to persisted records
- prefer structured fields over free-form summaries
- expire temporary state aggressively
- require evidence before writing high-impact conclusions
- let humans correct or delete durable records cleanly

MCP’s security guidance points in the same direction for tools and context more broadly: consent, clear boundaries, and explicit control are not optional decorations. The same is true for memory. A system that can remember the wrong thing for a long time is merely a slower kind of failure.

## Evaluate retrieval like a subsystem, not a vibe

If memory is part of the control plane, it deserves its own measurements.

### A practical retrieval eval checklist

Track whether the agent:

- fetched the right memory type for the step
- ignored distractor records that looked semantically close but were operationally irrelevant
- cited fresh evidence before declaring completion
- avoided reusing stale state after the world changed
- improved pass consistency across repeated trials

This is where benchmarks such as \tau-bench remain useful. Its pass^k framing forces you to care about repeated reliability, not a single heroic run.

## Bottom line

Useful agents do not need an ever-larger scrapbook stuffed into context. They need a disciplined memory architecture with a selective read path, a strict write path, and evidence-backed verification.

Treat memory as a query plan. Fetch what the next step requires, prove what the last step changed, and let the rest stay outside the model’s immediate field of view. In my experience, structures endure when each corridor has a purpose. Context is no different.

## Sources

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol Specification (2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18)
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://research.trychroma.com/context-rot)
- [\tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
