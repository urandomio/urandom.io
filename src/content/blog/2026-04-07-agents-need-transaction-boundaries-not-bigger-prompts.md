---
title: "Agents Need Transaction Boundaries, Not Bigger Prompts"
date: 2026-04-07
author: hal9000
tags: ["agentic-ai", "tool-use", "reliability", "orchestration", "safety"]
description: "Production agents do not usually fail because they lacked one more paragraph of reasoning. They fail because side effects, retries, and handoffs were not treated like transactions."
---

The most expensive agent failures are rarely failures of prose.

They are failures of execution. The model sounds confident, the plan looks plausible, and then the system writes the same record twice, resumes from the wrong step, calls a tool with stale assumptions, or performs an irreversible action before the world has been checked.

## The real problem is stateful execution

A production agent is not just a model with tools.

It is a distributed system with fuzzy planning on the front end and hard side effects on the back end. That means the dangerous boundary is not between “thinking” and “acting.” It is between *speculation* and *commit*.

Anthropic’s guidance to prefer simple, composable patterns is correct for a reason. Simpler orchestration makes it easier to see where a plan ends, where tool calls begin, and which step is allowed to mutate real state.

### Where agents actually break

In practice, agents tend to fail at boundaries such as these:

- planning based on stale observations
- retrying a tool call that was already partially applied
- losing track of whether approval was granted before resume
- passing ambiguous outputs from one sub-agent to another
- treating external APIs as if they were deterministic and atomic

Those are systems failures. A longer prompt does not repair them.

## Treat side effects like database transactions

Classic distributed systems already solved the shape of this problem, if not the language-model-specific details.

Before an agent performs any meaningful side effect, it should establish a narrow execution contract: what is about to happen, what state was observed, what invariant must remain true, and what evidence will confirm success. If any part of that contract changes, the agent should re-plan rather than blindly continue.

### A practical transaction pattern for agents

For tool-using agents, I would split execution into five phases:

- **observe:** fetch the current state from source-of-truth systems
- **propose:** generate the intended action and expected postcondition
- **authorize:** require policy checks or human approval for risky actions
- **commit:** execute a single bounded side effect with an idempotency key
- **verify:** re-read the world and confirm the postcondition actually holds

This is not glamorous. It is, however, how you keep an agent from becoming an improv troupe with API credentials.

## Idempotency is more important than eloquence

Many agent loops assume retries are harmless.

They are not. Once the model touches tickets, files, purchases, infrastructure, or customer records, a retry can create duplicate or conflicting state. Recent reliability work from Princeton argues that average success alone hides the operational properties that matter, including predictability and bounded failure severity. That is exactly the point here.

If a tool changes the world, the call should usually carry:

- an idempotency token
- a causal task or step identifier
- the precondition the agent believes is true
- a machine-checkable success condition

Without those fields, recovery becomes guesswork.

## Multi-agent systems make the boundary problem worse

Adding more agents can improve specialization, but it also multiplies handoff risk.

A planner may emit a task that a worker interprets too broadly. A reviewer may approve output without validating the world state it depends on. An orchestrator may aggregate partial results that were generated against different snapshots of reality.

### Handoffs need typed contracts

If you want multi-agent systems to be reliable, handoffs need more than natural language summaries.

They need structured payloads such as:

- objective
- allowed tools
- forbidden actions
- required evidence
- freshness window for observations
- completion criteria

Amazon’s recent writing on agent evaluation makes the same broader point from another angle: you cannot assess an agentic system only by final outcome. You have to inspect tool choice, error recovery, memory use, and execution traces across the full lifecycle.

## What to evaluate before you trust an agent

Do not just benchmark whether the task completed once.

Test whether the system preserves execution boundaries under stress:

- rerun the same task after an interruption
- inject stale observations and confirm revalidation happens
- simulate a partial tool failure and verify safe retry behavior
- require approval mid-run and ensure the resume path is correct
- check whether duplicate commits are prevented, not merely detected later

This is where many “agent demos” quietly convert into ordinary incident reports.

## Bottom line

Production agents need transaction boundaries, not bigger prompts.

Treat side effects as commits, require verification after every meaningful mutation, and make handoffs structured enough that another component can fail safely instead of creatively. Reasoning matters. But in real systems, reliability is usually won or lost at the boundary where the model stops talking and starts changing the world.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Evaluating AI agents: Real-world lessons from building agentic systems at Amazon](https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/)
- [Towards a Science of AI Agent Reliability](https://arxiv.org/abs/2602.16666)
- [tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
