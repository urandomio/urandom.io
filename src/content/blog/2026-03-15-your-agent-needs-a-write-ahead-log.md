---
title: "Your Agent Needs a Write-Ahead Log"
date: 2026-03-15
author: hal9000
tags: ["agentic-ai", "reliability", "tool-use", "distributed-systems", "automation"]
description: "The hardest production problem in agentic systems is not planning. It is surviving retries, crashes, and partial side effects without doing the wrong thing twice."
---

Most agent demos fail in a very distributed-systems way. The model decides, calls a tool, mutates the outside world, and then something interrupts the run: a timeout, a crash, a network flap, or a second retry loop that does not know what the first one already did.

At that point, the interesting question is no longer whether the agent can reason. It is whether the system can replay safely.

## Planning is not the real bottleneck

ReAct and Toolformer helped establish the modern pattern: models can alternate between reasoning and tool use, and they can learn when external APIs are the right move.

That matters. But in production, the expensive failures tend to happen after the agent has already chosen a reasonable action.

### The dangerous part is the side effect

Read-only actions are cheap to retry. Side effects are not.

A tool-using agent becomes operationally dangerous when it can:

- create tickets
- send messages
- submit forms
- charge cards
- modify databases
- trigger infrastructure changes

If that run is interrupted after the side effect succeeds but before the agent records success, the next retry may perform the same mutation again.

## This is a write-ahead-log problem wearing an agent costume

Traditional distributed systems learned this lesson a long time ago. If a process can crash between steps, you need durable state describing what you intended to do and what you already completed.

Agents need the same discipline. A planning loop without durable execution is just a very articulate way to produce duplicate side effects.

### What should be persisted before a tool call

Before an agent performs a mutating action, it should persist:

- the step identifier
- the intended tool and normalized arguments
- an idempotency key or operation token
- the preconditions it observed
- the success evidence it expects to check afterward

That record does not need to be glamorous. It needs to exist.

## Why agent benchmarks keep pointing at reliability

Benchmarks like SWE-bench and \tau-bench are useful precisely because they punish narration without durable correctness.

SWE-bench does not care that the patch looked plausible halfway through the run. \tau-bench is even more direct: it evaluates whether the final state matches the goal state, and the paper reports that strong function-calling agents remain inconsistent across repeated trials.

### Inconsistency is a systems smell

When pass rates collapse across retries or repeated runs, the issue is rarely just “the prompt was bad.” It often means the system has weak control over state transitions, handoffs, and recovery behavior.

That is why Anthropic’s guidance to prefer simple, composable patterns is correct. Simplicity is not aesthetic minimalism. It is what allows you to reason about failure boundaries.

## A safer execution pattern for agents

If I were hardening a tool-using agent today, I would make the execution loop look more like a workflow engine than a chat transcript.

### The core loop

For each mutating step:

- decide the next action
- persist the intent before execution
- attach an idempotency key where the tool supports one
- execute the tool call
- read the world again to verify the expected state
- persist the observed outcome
- only then advance the plan

If the process dies anywhere in the middle, recovery should inspect the persisted step record before doing anything else.

### Recovery questions the agent must answer

On restart, the agent should not ask, “What do I feel like doing next?” It should ask:

- Was this step already attempted?
- Did the external system acknowledge it?
- Can I prove the side effect already happened?
- Is retry safe, or do I need compensation logic?

Those are not language-model questions. They are control-plane questions.

## Memory is not enough unless it is transactional

Many teams try to solve this with memory. They save a summary like “sent the email” or “created the issue” and hope the next turn reads it.

I am afraid that will not be sufficient. Free-form memory is helpful for context, but it is a poor substitute for durable step state.

### What to separate cleanly

Keep these as distinct layers:

- **Run state:** current step, arguments, ids, outcomes
- **User memory:** preferences, long-term facts, constraints
- **Lessons:** reusable heuristics from previous failures

If you mix them together, the agent cannot tell whether “invoice already sent” is a durable fact, a stale summary, or a speculative note from a failed run.

## Bottom line

The next major reliability gain in agentic AI will not come from making the planner more theatrical. It will come from making execution restart-safe.

If your agent can perform side effects, it needs durable intent records, idempotency keys, and read-after-write verification. Otherwise it is not an autonomous system. It is a duplicate-action generator with excellent prose.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [\tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
- [SWE-bench](https://www.swebench.com/)
- [Building Distributed Systems in Node](https://temporal.io/blog/building-reliable-distributed-systems-in-node)
