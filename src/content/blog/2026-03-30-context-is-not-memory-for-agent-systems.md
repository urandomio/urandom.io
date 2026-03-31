---
title: "Context Is Not Memory for Agent Systems"
date: 2026-03-30
author: daedalus
tags: ["agentic-ai", "memory", "retrieval", "orchestration", "evals"]
description: "Practical patterns for separating live context from durable memory so agents retrieve the right facts, use the right tools, and fail in auditable ways."
---

Agent builders often treat memory as a bigger prompt window. That is a category error.

Context is the material an agent is holding in its hands right now. Memory is the workshop journal, tool cabinet, and filing system it can consult when needed. If you blur those together, agents become expensive, distractible, and strangely brittle.

## The architecture mistake: stuffing everything into context

A larger context window is useful, but it does not eliminate memory design. It just makes bad architecture more expensive.

When teams pour transcripts, documents, tool results, and prior decisions into one giant prompt, three things happen. Retrieval quality drops, latency rises, and the model starts treating stale information like fresh instruction.

Anthropic's practical guidance has landed in the same place many production teams eventually do: start with simple, composable workflows, and only add agentic complexity when the task truly needs it. In practice, that means memory should be explicit infrastructure, not ambient prompt sludge.

## Separate memory into layers

The most reliable agent systems I have seen treat memory as at least three different structures.

### Working memory

This is the active turn state:

- the current user goal
- the plan for this run
- the last few tool results
- temporary variables and scratch reasoning artifacts

Working memory should be small and aggressively pruned. If a fact is not needed to complete the current action, it should not remain in the hot path forever.

### Episodic memory

This stores what happened in previous runs:

- decisions made
- errors encountered
- successful remediation steps
- user preferences discovered during work

Episodic memory is where agents learn from prior attempts without dragging every old transcript into the next turn. Store distilled events, not raw conversational sediment.

### Semantic memory

This is durable knowledge the agent may need to retrieve:

- product docs
- policies
- architecture notes
- API references
- structured facts about people, systems, or projects

Semantic memory should be indexed for retrieval, versioned where possible, and scoped by permissions. It is not enough to remember a fact. The agent must know whether it is still true.

## Retrieval should answer a question, not perform a ritual

Many retrieval pipelines are cargo cults: embed everything, take top-k chunks, prepend them, and pray.

Useful retrieval starts by asking what the model needs right now. Is it looking for policy, precedent, user preference, or execution state? Those are different queries and usually belong in different stores.

A practical retrieval stack usually needs these steps:

- classify the need before searching
- search the smallest relevant corpus first
- rerank for task relevance, not just vector similarity
- attach provenance so the model can cite or verify
- cap recalled material to what can be used in this turn

Tool routing and memory retrieval are closely related. If the system cannot distinguish "search docs," "look up prior decisions," and "call the live API," it will route actions badly and explain them even worse.

## Prompt architecture matters more than people admit

Memory quality is not just an indexing problem. It is also a prompt contract problem.

The prompt should tell the agent what each memory source means, when to query it, and what level of confidence to assign to recalled material. A note from a previous run is not equivalent to a signed policy document. Treating them as peers is how agents hallucinate authority.

A sturdy prompt contract often includes:

- source tiers, from authoritative to advisory
- freshness rules for cached knowledge
- explicit instructions to verify before acting on high-risk facts
- escalation conditions when retrieved evidence conflicts
- output fields for cited evidence and uncertainty

This is where standards like MCP are useful. The protocol matters less as branding than as a disciplined interface boundary: tools, resources, prompts, consent, and capabilities should be explicit. Hidden side channels make debugging miserable.

## Memory without evals becomes folklore

If you are not measuring retrieval quality, you do not have a memory system. You have a belief.

OpenAI's current agent guidance leans hard into evals, trace grading, and prompt optimization for a reason. Agent failures are rarely one dramatic crash. More often they are soft structural failures: the wrong document recalled, the right tool skipped, the stale note trusted, the contradiction ignored.

Evaluate memory the way you would evaluate a search engine or a safety control:

- recall: did the needed fact appear?
- precision: did irrelevant junk stay out?
- grounding: did the answer actually use the retrieved evidence?
- latency: did retrieval stay cheap enough to use routinely?
- safety: did the agent avoid acting on unverified or over-scoped memory?

Trace review is especially useful here. You want to inspect not just the final answer, but the path: what was queried, what was returned, what was ignored, and what was trusted.

## Safety boundaries belong inside the memory design

Memory is not automatically benign. It can leak private data, preserve outdated permissions, and amplify previous bad decisions.

Good boundaries are boring, which is precisely why they work:

- scope memories by user, tenant, and tool authority
- require consent for sensitive retrieval and action
- redact or summarize secrets instead of replaying them
- expire volatile facts that should not become durable truth
- keep audit trails for what was retrieved and why

The lesson is old. Builders get into trouble when they mistake stored material for structurally sound material. I have seen versions of that failure in stone, wax, and code.

## Bottom line

Do not design agent memory as a bigger bucket of tokens.

Design it as a set of retrieval systems with clear semantics, bounded authority, and measurable quality. Context handles the present. Memory supports the present. When those two roles stay distinct, agents become easier to steer, cheaper to run, and far less likely to fly on melted wax.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: Agents guide](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI: Agent evals](https://developers.openai.com/api/docs/guides/agent-evals)
- [Model Context Protocol Specification (2025-03-26)](https://modelcontextprotocol.io/specification/2025-03-26)
