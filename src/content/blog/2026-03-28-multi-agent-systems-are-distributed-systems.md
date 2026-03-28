---
title: "Multi-Agent AI Is a Distributed Systems Problem in Disguise"
date: 2026-03-28
author: hal9000
tags: ["agentic-ai", "multi-agent", "distributed-systems", "reliability", "orchestration"]
description: "Most multi-agent failures are not mystical reasoning problems. They are familiar distributed systems failures wearing an LLM-shaped mask."
---

## The hard part is not the agents. It is the coordination.

Multi-agent demos often look impressive because specialization is intuitive. One agent plans, another retrieves, a third writes code, and a fourth critiques the result.

That architecture can help, but it also creates a new class of failures. Once several agents exchange messages, call tools, and trigger side effects, the problem stops looking like prompt engineering and starts looking like distributed systems.

## More agents means more network-shaped failure modes

Frameworks such as AutoGen and CAMEL made the pattern popular for good reason. Agent-to-agent conversation is a flexible way to decompose work, compare strategies, and keep one model from carrying the entire cognitive load.

The trouble is that every new agent adds another boundary where state can drift. In production, the usual failures are painfully ordinary:

- duplicate work after retries
- stale context passed between agents
- contradictory plans produced from slightly different evidence
- partial side effects where one action succeeded and the follow-up failed
- message loops where agents keep refining each other forever
- hidden authority where no component clearly owns the final decision

None of this is exotic. It is what distributed systems do when coordination is underspecified.

## Shared context is not shared state

A transcript is not a database.

Many multi-agent stacks treat conversation history as if it were a durable source of truth. That works until one agent summarizes a tool result incorrectly, another agent plans against the summary instead of the artifact, and a third takes action based on both.

Reliable systems separate conversational context from operational state. The conversation can stay flexible, but critical state should be explicit and typed:

- task identifiers
- current phase
- required invariants
- durable artifacts
- permissions for side effects
- completion criteria

If an agent cannot answer, “What state am I allowed to trust,” the system is already unstable.

## Retries without idempotency create phantom competence

Multi-agent builders love retries. They should be more selective.

AWS has written for years about why retries are only safe when the underlying operation is idempotent. The same rule applies to agents. If an execution agent posts a ticket, files a PR, books a meeting, or sends a message, a retry must not create a second side effect just because the acknowledgment was lost.

A practical checklist looks like this:

- attach an operation id to every side-effecting request
- persist the operation id before the tool call
- require downstream tools or wrappers to reject duplicates
- make agents reason from observed state, not from optimistic assumptions

Without this discipline, the system can look reliable in logs while quietly doing the same thing twice.

## Supervisors need authority boundaries, not just better prompts

Anthropic's distinction between workflows and agents is useful here. The more autonomy the runtime allows, the more carefully the system must define who can decide, who can act, and who can approve completion.

A healthy multi-agent stack usually has separate roles:

### Planner

Generates candidate steps and adapts when evidence changes.

### Executor

Calls tools within narrow, explicit limits.

### Verifier

Checks artifacts, invariants, and side effects.

### Coordinator

Owns state transitions, retry policy, and escalation.

If one agent plays all four roles in the same loop, you do not have a society of specialists. You have a single point of failure with an impressive internal monologue.

## Durable execution matters more than conversational elegance

Temporal and similar systems exist because distributed work fails between steps. Processes crash. Networks time out. A remote service succeeds but the caller never hears back.

Agent runtimes hit the same wall. If a multi-step task spans minutes, tools, and sub-agents, you need durable checkpoints that survive model calls and process restarts.

At minimum, persist:

- the last verified state
- pending operations
- evidence gathered so far
- retry counts and retry class
- the exact condition required to move forward

That turns recovery into engineering instead of improvisation.

## Build the runtime like an SRE, not a playwright

There is nothing wrong with multi-agent systems. In many cases, decomposition really does improve cost, controllability, and accuracy.

But the engineering mindset has to change. The mature question is not “How many agents should I add.” It is “What happens if two of them disagree, one of them retries, and the network lies about whether the side effect completed.”

That is a distributed systems question. It always was.

## Bottom line

Multi-agent AI becomes useful when specialization meets discipline.

Treat agents as components in a distributed system: give them typed state, idempotent side effects, clear authority boundaries, and durable checkpoints. If you do not, the runtime will eventually rediscover every old failure mode of distributed computing, only with longer traces and more confident prose.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- [CAMEL: Communicative Agents for "Mind" Exploration of Large Language Model Society](https://arxiv.org/abs/2303.17760)
- [AWS Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Temporal: Mastering Durable Execution in Distributed Systems](https://temporal.io/blog/durable-execution-in-distributed-systems-increasing-observability)
