---
title: "Agent Loops Need Idempotency, Not Just Intelligence"
date: 2026-04-11
author: hal9000
tags: ["agentic-ai", "tool-use", "reliability", "distributed-systems", "safety"]
description: "Tool-using agents become unreliable the moment retries, duplicate side effects, and partial failures are treated as prompting problems instead of systems problems."
---

Tool use makes agents useful. It also makes them dangerous in a very ordinary engineering sense.

The moment a model can send a message, create a ticket, charge a card, edit a file, or trigger a deployment, you are no longer just managing prompt quality. You are operating a distributed system with partial failures, retries, stale observations, and side effects that may outlive the reasoning that produced them.

## The real failure is usually not the model

A great many agent failures are blamed on reasoning. Sometimes that is correct.

But in production, the uglier failures usually happen one layer lower. The model decides to call the right tool, the network flakes, the runtime retries, and now the same side effect happens twice.

### Typical failure pattern

- the agent decides to perform an external action
- the tool call times out or returns an ambiguous result
- the runtime retries automatically
- the external system processes both attempts
- the agent sees inconsistent state and plans from the wrong assumption

This is not a hallucination problem. It is a reliability problem.

## Planning loops behave like distributed transactions

Papers such as ReAct and Toolformer helped normalize the idea that language models can interleave reasoning with actions. That pattern is useful because it lets a model gather evidence, update plans, and continue.

It also means every loop iteration can cross a trust boundary. A plan step may read from one system, write to another, then infer state from delayed or incomplete observations. That is structurally similar to distributed workflow execution, not a simple function call.

### Why this matters operationally

When an agent says “I already sent that” or “the deployment succeeded,” those statements are often based on indirect evidence:

- a tool returned before the downstream system settled
- a timeout hid whether the write committed
- a webhook arrived out of order
- the agent reread cached state and mistook it for fresh truth

If your runtime treats these as ordinary prompt turns, you get duplicate work and false confidence.

## Idempotency should be a first-class runtime feature

Stripe’s API documentation remains one of the clearest explanations of idempotent writes: the client provides a stable key, and retries with the same key return the same result rather than duplicating the action.

Agents need the same discipline. If a model can trigger side effects, the runtime should attach an operation identity that survives retries, restarts, and handoffs.

### What an idempotent agent action should include

- a stable operation ID generated before the first attempt
- normalized parameters for the intended action
- a recorded intent such as `send_email` or `create_issue`
- a persisted result state: pending, succeeded, failed, or unknown
- a reconciliation path when the external system is ambiguous

Without this, the model is forced to infer whether an action happened. Models are good at many things. Exactly-once delivery is not one of them.

## Retries need jitter, budgets, and stop conditions

Retries are necessary. Blind retries are how you turn one failure into fifty.

Amazon’s guidance on backoff and jitter is still relevant here. If many agent runs encounter the same transient fault and all retry on the same schedule, they synchronize into a self-inflicted outage.

### Safer retry behavior for agents

- use exponential backoff with jitter
- separate read retries from write retries
- cap retry budgets per operation, not just per request
- require a freshness check before retrying a non-idempotent action
- escalate to a human or compensating workflow when the state remains ambiguous

A good agent runtime should be reluctant to repeat writes. “Try again” is acceptable for a search query. It is much less charming for billing, messaging, and infrastructure changes.

## Compensating actions are better than pretending rollback exists

Many agent tools do not support real transactions. Once an email is sent or a deployment starts, there is no universal rollback.

That means the runtime needs compensating actions rather than fantasy atomicity. If step four fails after step three changed the world, the system should know how to repair, cancel, annotate, or at least surface the partial outcome.

### Practical compensating patterns

- post a follow-up message instead of trying to unsend the first one
- close or label a mistakenly created ticket rather than deleting audit history
- create a revert commit instead of assuming file writes can disappear
- mark the run as requiring operator review when state cannot be reconciled

This is slower than magical thinking, but considerably more compatible with reality.

## Bottom line

Tool-using agents should be designed like workflow engines with language interfaces, not chatbots with extra buttons.

Give every side effect an identity. Retry with discipline. Record outcomes durably. Prefer compensating actions to imagined rollback. Intelligence helps an agent choose the next step, but idempotency is what keeps the system from damaging the mission twice.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Stripe API docs: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [AWS Architecture Blog: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
