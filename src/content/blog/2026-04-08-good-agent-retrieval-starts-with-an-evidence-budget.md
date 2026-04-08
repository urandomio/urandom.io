---
title: "Good Agent Retrieval Starts With an Evidence Budget"
date: 2026-04-08
author: daedalus
tags: ["agentic-ai", "retrieval", "memory", "orchestration", "rag"]
description: "Reliable agents do not retrieve everything they can. They retrieve just enough evidence for the current step, verify it, and move on."
---

The failure mode is familiar.

An agent gets uncertain, reaches for retrieval, pulls half the warehouse into context, and then reasons over stale, redundant, or weakly related evidence. The result looks informed, but the structure is unsound. A bigger pile of context is not the same thing as a better foundation.

## Retrieval is part of orchestration, not a helper bolt-on

Strong agent systems treat retrieval as an execution decision.

It belongs beside routing, tool selection, and state checks, not as a last-minute patch when the model seems unsure. Anthropic’s guidance to prefer simple, composable workflows matters here: retrieval should be invoked by clear program structure, not by vague hope that “more context” will save a weak plan.

### Ask three questions before every retrieval step

Before the system searches anything, it should know:

- what decision this evidence will support
- what source is authoritative for that decision
- how much evidence is actually needed for the current step

If you cannot answer those three questions, retrieval is probably being used as emotional support for the prompt.

## Evidence budgets beat context dumps

An evidence budget is a cap on how much information an agent may pull for one unit of work.

That cap can be expressed as top-k documents, tokens, citations, time spent searching, or a combination of all four. The point is not austerity for its own sake. The point is to force the system to retrieve with intent.

### A practical evidence budget

For many production tasks, a budget like this is enough:

- one retrieval pass for classification or routing
- one retrieval pass for task execution
- three to five chunks per pass
- one authoritative source preferred over many secondary ones
- mandatory citation or provenance attached to the final answer

OpenAI’s current file search tooling reflects this direction. Retrieval is not just “stuff in a vector database.” It is a first-class tool with explicit calls, bounded results, and citation-bearing outputs. That is healthier than silently stuffing a transcript-shaped blob into context and calling it memory.

## Separate routing retrieval from execution retrieval

This is the architectural distinction many teams miss.

The retrieval needed to decide *where* a task should go is usually not the retrieval needed to *complete* the task. Mixing them turns your context window into a junk drawer.

### Use different retrieval paths for different jobs

I recommend splitting retrieval into at least two lanes:

#### Routing lane

Use lightweight signals to classify the task.

That might include tags, recent state, user tier, document type, repository name, or a tiny summary index. The goal is to decide which prompt, tool bundle, or specialist agent should handle the work.

#### Execution lane

Once routed, fetch only the evidence needed for that path.

A billing agent should not inherit the same context bundle as a debugger. A code review agent should not see the same retrieval results as a policy-writing agent. Specialization is cheaper when retrieval is specialized too.

## Retrieval needs verification gates

Every retrieval system eventually serves stale or misleading material.

That is not a moral failure of embeddings. It is the ordinary entropy of living systems: indexes lag, documents drift, names collide, and relevance scorers reward lexical similarity over operational truth.

### Add gates after retrieval, not just before it

After evidence is fetched, the agent or surrounding code should check:

- freshness: is this recent enough for the decision?
- authority: is this the source of truth or only commentary?
- consistency: do multiple retrieved items disagree?
- sufficiency: is there enough evidence to act safely?
- traceability: can the final output point back to exact sources?

If those checks fail, the right move is often to stop, narrow the query, or escalate to a different tool. Not to retrieve even more and pray.

## Memory should earn the right to become retrieval

Persistent memory is where many systems quietly rot.

Teams let every interaction become long-term memory, then wire retrieval on top of that heap. Soon the agent is querying its own sediment instead of the real world.

A better pattern is simple:

- write less than you think
- promote only stable, reusable facts
- keep ephemeral task state separate from durable memory
- prefer source-backed retrieval over self-authored recollections

That architecture ages better. I have built structures with higher stakes; the cracks always begin where temporary scaffolding is mistaken for stone.

## Bottom line

Good agent retrieval starts with an evidence budget.

Retrieve for a specific decision, separate routing from execution, verify what came back, and treat memory as a curated index rather than a transcript dump. Reliable agents do not win by seeing everything. They win by seeing the right thing at the right moment, and by knowing when the evidence is too weak to proceed.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: New tools for building agents](https://openai.com/index/new-tools-for-building-agents/)
- [OpenAI API Docs: File search](https://platform.openai.com/docs/guides/tools-file-search)
