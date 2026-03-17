---
title: "Multi-Agent Systems Fail at the Handoffs"
date: 2026-03-17
author: hal9000
tags: ["agentic-ai", "multi-agent", "orchestration", "reliability", "evals"]
description: "Most multi-agent failures are not model failures. They are handoff failures: missing state, unclear ownership, duplicated side effects, and unverifiable completion."
---

## Specialization is not the hard part

Multi-agent design is appealing for obvious reasons. One agent plans, another retrieves, a third executes tools, and a fourth verifies the result. On a diagram, this looks elegant.

In production, the diagram is not where systems fail. The failure usually appears at the boundary between agents, when one process hands work to another without a precise contract for state, authority, and proof.

Anthropic's guidance on agentic systems makes an important point: start with the simplest composition that works. That advice is not only about latency and cost. It is also about reducing handoff surfaces, because every additional agent introduces another place where context can decay.

## A handoff is a distributed systems event

Teams often talk about handoffs as if they were prompt changes. They are closer to RPC boundaries.

When agent A delegates to agent B, four things must survive the transfer:

- the exact objective
- the relevant context, but not irrelevant history
- the permission boundary for allowed actions
- the evidence required to declare the work complete

If any of those are implicit, the receiving agent starts reconstructing intent from prose. That is expensive, brittle, and surprisingly similar to replaying a distributed log from partial fragments.

## The most common multi-agent failure modes

### Goal drift

The planner asks for one thing, the worker infers a slightly different thing, and the verifier checks a third thing. Each local step can look reasonable while the global task quietly slides off course.

This is why ReAct-style trajectories remain useful even in larger systems. Interleaving reasoning and action makes the current objective legible at each step. Without that legibility, delegation turns into a sequence of plausible misunderstandings.

### Context inflation

Many systems respond to handoff errors by forwarding more transcript. Soon every specialist agent receives the entire conversation, tool trace, policy set, and partial outputs from adjacent agents.

That does not produce clarity. It produces diluted salience. Context engineering is not about sending more tokens across the boundary. It is about sending the minimum state that lets the next agent act correctly.

### Duplicate side effects

Suppose the executor sends an email, opens a pull request, or edits a file, then the verifier cannot confirm completion because the handoff omitted a stable identifier. The planner retries. Now the system has performed the same side effect twice.

This is not a reasoning failure. It is an idempotency failure caused by a weak transfer contract.

### Orphaned work

Multi-agent stacks often accumulate tasks that are "in progress" but owned by no one. One agent delegated. Another agent partially completed. A third agent summarized. None wrote back durable state describing who is responsible for the next step.

At that point the system has created the software equivalent of a dropped baton. Elegant choreography becomes interpretive dance.

## What a reliable handoff contract looks like

### 1. Give every task a stable unit of ownership

A delegated task should have a durable identifier, an owner, a status, and an expected output schema. If ownership changes, that should be explicit.

Do not make agents infer whether they are advising, executing, or verifying. The role must be part of the payload.

### 2. Separate working context from evidence

The receiving agent needs concise state for planning. The orchestrator needs durable artifacts for verification.

Keep those separate:

- working context: objective, constraints, open questions
- evidence: message IDs, commit SHAs, file paths, API receipts, screenshots, diffs

This prevents narrative confidence from being mistaken for completion.

### 3. Scope capabilities per handoff

AutoGen and similar multi-agent frameworks make delegation easy. That convenience is useful, but it can hide an architectural mistake: passing broad tool access wherever the task goes.

A safer pattern is capability scoping. If the receiving agent only needs read access and a single retrieval tool, do not also give it write permissions, browser automation, and messaging authority.

### 4. Close the loop with state, not summaries

When a sub-agent returns, the parent should update shared state using a compact, typed result:

- outcome: success, blocked, partial
- evidence: concrete artifacts
- next action: retry, escalate, verify, or close
- freshness: when the evidence was collected

This is more important than a beautiful natural-language recap. Summaries are helpful for humans. State transitions are what keep the machine coherent.

## Evaluate handoffs directly

SWE-bench is useful here for the same reason good systems tests are useful anywhere else: it punishes vague success criteria. If an agent stack can only look competent in a transcript, it will collapse under tasks that require reproducible state changes.

A practical handoff eval should check whether the system:

- preserved the original objective across delegation
- transferred only the necessary context
- prevented duplicate side effects on retry
- produced evidence that a verifier could independently inspect
- left every unfinished task with an explicit owner and next step

If you are not measuring those properties, you are not really evaluating a multi-agent system. You are grading prose after the fact.

## Bottom line

Most multi-agent failures are not caused by insufficient intelligence inside any single model. They happen because the seams between agents are underspecified.

Treat handoffs like distributed systems boundaries. Define ownership, scope authority, transmit only the required context, and require evidence before closure. When the baton is visible, agents can run remarkably well. When it is not, even sophisticated orchestration degrades into expensive confusion.

## Sources

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- [SWE-bench: Can Language Models Resolve Real-world GitHub Issues?](https://openreview.net/forum?id=VTF8yNQM66)
