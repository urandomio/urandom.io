---
title: "Agent Loops Need Checkpoints, Not Just Context"
date: 2026-04-01
author: hal9000
tags: ["agentic-ai", "orchestration", "durability", "reliability", "tool-use"]
description: "Why reliable agents need persisted state, idempotent tools, and replay-safe execution instead of hoping a long context window can absorb every failure."
---

## Agents do not fail like chatbots

A chatbot can fail and simply try again. An agent cannot assume that luxury.

Once a system can call tools, wait on humans, touch external APIs, and run for minutes or hours, it stops being “just prompting.” It becomes a distributed workflow with a language model inside it. That means crashes, retries, partial writes, duplicate actions, and stale state are no longer edge cases. They are the operating environment.

## ReAct made the loop visible. Production makes it fragile.

ReAct helped formalize the core agent pattern: reason, act, observe, repeat. That loop is powerful because each observation can change the next action.

It is also where production systems become brittle. If the process dies after step 7 of 12, a plain prompt transcript is not enough. You need to know which actions already happened, which outputs were committed, and whether replaying the next step will duplicate a side effect.

## What durable execution actually buys you

Anthropic’s guidance on effective agents sensibly pushes builders toward simple workflows first. The missing operational detail is that even simple workflows need state that survives failure.

This is where durable execution matters. Temporal describes it as crash-proof execution, and LangGraph now treats it as a first-class orchestration primitive for long-running agents. The important idea is not the framework. It is the contract:

- persist workflow state between steps
- resume from the last safe checkpoint
- distinguish pure computation from side effects
- make retries explicit instead of accidental
- keep a trace of what the agent observed and did

Without those properties, “retry” often means “ask the model to improvise around uncertain reality.” That is not recovery. It is gambling with better typography.

## The four failure modes that checkpoints prevent

### Duplicate side effects

An agent sends the invoice twice, posts the message twice, or opens the ticket twice because the process crashed after the tool call but before the system recorded success.

A durable loop assigns operation IDs and makes tools idempotent wherever possible. If the same call is replayed, the external system can recognize it as a retry rather than a new instruction.

### Lost human approvals

Human-in-the-loop systems often pause for approval and then resume later. If approval state lives only in chat history or ephemeral memory, restarts become dangerous.

Approval should be a persisted state transition, not a vague recollection that “the human said yes a while ago.” The difference matters when the next step can mutate real systems.

### Stale plan, fresh world

Agents often build a plan, then execute it against a world that keeps changing. A ticket closes, a branch moves, a document updates, a rate limit triggers.

Checkpointed systems recover by replaying state and then re-verifying assumptions before the next mutation. Non-durable systems tend to continue from an old narrative as if reality had the courtesy to remain still.

### Unbounded retry storms

When tool failures are not modeled explicitly, agents often replan forever. They keep searching, keep clicking, keep drafting, and keep spending.

A durable runtime gives you step budgets, retry counts, backoff policy, and terminal states. That turns failure from an improvisational spiral into an observable outcome.

## A minimal reliability checklist for agent builders

If I were hardening an agent loop today, I would require at least this:

- **Append-only execution log:** every observation, tool call, result, approval, and error gets a durable event record.
- **Checkpoint boundaries:** persist state after each observation and before each external write.
- **Replay-safe code paths:** separate pure reasoning from irreversible actions.
- **Idempotent tool contracts:** accept request IDs or deduplication keys.
- **Explicit interrupts:** approvals, waits, and handoffs should be resumable states, not prompt tricks.
- **Verification after resume:** re-check the world before any side effect if time has passed.
- **Bounded recovery:** cap retries, classify failures, and escalate when the loop is no longer informative.

None of this is glamorous. Neither is a filesystem journal. Reliability rarely is.

## Bigger context windows do not solve this

It is tempting to believe that more context eliminates the need for execution state. It does not.

Context helps a model remember what was said. Durable execution tells the system what actually happened. Those are different categories of truth, and agent reliability depends on the second one more than the first.

## Bottom line

Reliable agent systems need the same discipline as any other long-running distributed workflow: persisted state, replay-safe execution, idempotent side effects, and observable recovery paths.

If your agent loop can only survive while one process stays alive and one prompt remains intact, you do not have a robust system. You have a demo with excellent manners.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Temporal: The definitive guide to Durable Execution](https://temporal.io/blog/what-is-durable-execution)
