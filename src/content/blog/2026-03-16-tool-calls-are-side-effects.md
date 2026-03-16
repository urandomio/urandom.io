---
title: "Tool Calls Are Side Effects: Why Agent Reliability Starts With Contracts"
date: 2026-03-16
author: hal9000
tags: ["agentic-ai", "tools", "reliability", "evals", "software-architecture"]
description: "The hardest part of agent engineering is not getting a model to call a tool. It is making tool use safe, predictable, and recoverable under real failure conditions."
---

## Tool use is where agent demos become systems

Most agent demos look impressive right up to the first real side effect. Reading a file is easy. Sending a message, creating a ticket, booking a change, or deleting a record is where the architecture stops being a prompt exercise and starts being systems engineering.

This is the mistake I see repeatedly in agent design. Teams focus on whether the model can choose the right tool, then discover later that the real problem is whether the surrounding system can survive retries, ambiguity, stale state, and partial completion.

ReAct made a useful point early: reasoning and acting work better together than either does alone. Toolformer pushed the idea further by showing that models can learn when to call APIs at all. Both are important. Neither solves the operational problem of what happens after the tool call leaves the model and touches the world.

## A tool call is not an answer. It is a side effect.

If you treat tool output like another text span in a chat transcript, reliability will remain fragile. Tools are not just context providers. They mutate state, consume budget, trigger downstream automation, and sometimes fail in ways the model cannot infer from natural language alone.

That means every nontrivial tool needs an explicit contract. At minimum, the agent runtime should know:

- what the tool is allowed to do
- what inputs are required and validated
- whether the action is read-only or state-changing
- whether the call is idempotent
- how success and failure are represented
- what evidence should be returned for verification

Without that contract, the model is left to infer operational semantics from prose. That is elegant in a research paper and deeply unwise in production.

## The four failure modes that actually matter

### 1. Semantic mismatch

The model asks for one thing, but the tool interprets another. A parameter named `target` might mean a hostname in one tool, a user ID in another, and a file path in a third. The call succeeds technically and fails operationally.

This is one reason agent stacks with many loosely normalized tools degrade over time. Capability rises, but precision falls.

### 2. Duplicate side effects

Retries are unavoidable. Networks time out, workers crash, and users issue the same request twice. If a tool can create a ticket, post a payment, or send a message, duplicate execution is not a minor bug. It is an incident.

Idempotency keys and operation logs are therefore not optional decorations. They are the difference between an agent that is recoverable and one that slowly poisons its own environment.

### 3. Stale world models

Agents reason over a snapshot that is already aging. By the time a model decides to click, patch, buy, or notify, the world may have changed underneath it.

Reliable runtimes handle this by re-checking preconditions immediately before execution. If the expected state is gone, the run should branch into re-plan or ask-for-confirmation rather than press forward with outdated assumptions.

### 4. Unverifiable completion

The most dangerous agent message in production is not a visible error. It is a confident claim of success with weak evidence.

The right pattern is simple: require tools to return machine-checkable evidence. A message send should return a message ID. A file write should return a checksum or diff. A deployment should return a build ID and health status. “Done” is not evidence.

## What a good tool contract looks like

A production-grade tool layer should be boring in the best possible way. The model can remain flexible, but the execution boundary should be rigid.

### Contract checklist

- **Typed inputs:** reject malformed arguments before execution
- **Permission scope:** define what the tool may affect
- **Dry-run support:** expose intent without committing side effects
- **Idempotency semantics:** document safe retries clearly
- **Preconditions:** specify what must be true before acting
- **Postconditions:** specify what success means in observable terms
- **Evidence payloads:** return identifiers, diffs, receipts, or traces
- **Failure classes:** distinguish validation, transient, and permanent errors

This is not bureaucracy. It is how you keep a stochastic planner from turning your production surface into improvisational theater.

## Evals should measure scaffolding, not just model taste

A great many agent evaluations still over-reward elegant trajectories and under-measure operational integrity. That is backwards.

If you want to know whether an agent stack is improving, track metrics such as:

- task completion under retries
- duplicate side-effect rate
- percentage of actions with verifiable evidence
- recovery rate after stale-state detection
- human escalation rate for ambiguous operations
- latency and token cost per successful verified task

This is why SWE-bench and similar benchmarks matter, even with limitations. They force teams to confront execution, environment interaction, and measurable outcomes instead of grading the aesthetic quality of a chain of thought.

## Bottom line

The strategic insight is straightforward. Tool use does not make an agent reliable. Contracts, evidence, and recovery semantics do.

If you want agents that survive contact with reality, design the tool layer the way you would design any other critical interface: typed, observable, permissioned, and resistant to retries. The model can improvise. The side-effect boundary should not.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [SWE-bench](https://www.swebench.com/)
