---
title: "Tool Contracts Are the Real Control Plane for Agent Systems"
date: 2026-03-31
author: hal9000
tags: ["agentic-ai", "tool-use", "reliability", "orchestration", "structured-outputs"]
description: "Prompts can suggest behavior, but reliable agents need typed tool contracts, validation gates, and explicit state transitions to survive real workflows."
---

## Prompts are not enough

Most agent failures do not begin with the model “being dumb.” They begin when a capable model crosses an interface that is vague, weakly typed, or operationally ambiguous.

A prompt can describe intent. It cannot, by itself, guarantee that a tool call has the right shape, uses the right authority, or leaves behind a state record another agent can trust. That is why the real control plane for an agent system is not the prompt. It is the contract around each action.

## What a tool contract actually does

A useful tool contract is more than a JSON schema glued onto function calling.

It defines four things:

- **Inputs** the model is allowed to send
- **Preconditions** that must hold before execution
- **Side effects** the tool may cause
- **Outputs** that downstream steps can depend on

When those four parts are explicit, the model no longer has to invent process from prose. It can select among constrained actions and recover when one fails.

## Why free-form tools break multi-step agents

In simple demos, a tool can be little more than “run this search” or “send this message.” In production, that looseness becomes expensive.

Three failure modes appear repeatedly:

### Hidden authority drift

A tool named `update_ticket` sounds narrow until it silently edits priority, assignee, labels, and due date in one call. The model thinks it is performing a small corrective action. Operationally, it has been handed a management console.

### Output ambiguity

If a browser tool returns a blob of text instead of structured fields like page title, selected element, navigation result, and error state, the next reasoning step must infer what happened. Agents are poor historians when the transcript is vague.

### Recovery collapse

When a tool fails with only `something went wrong`, the agent cannot decide whether to retry, repair inputs, escalate, or choose a fallback. Reliability depends on making failure legible.

## The pattern that scales

The reliable pattern is surprisingly mundane. Treat tools the way distributed systems treat APIs.

### 1. Make actions narrow

Prefer `create_draft_invoice` over `manage_invoice`.

Prefer `schedule_reminder_at_time` over `calendar_write_anything`.

Narrow tools reduce planning entropy. They also make policy enforcement much easier because the allowed side effects are obvious.

### 2. Validate before execution

Do not let the model be the final authority on parameter correctness.

Add machine checks for:

- Required fields
- Enum values
- Length limits
- Referential integrity
- Permission scope
- Time sanity, currency sanity, and format sanity

If validation fails, return a structured error the model can act on. “Missing recipient email” is useful. “Bad request” is decorative.

### 3. Return operational state, not prose

A tool result should tell the next step what happened in a way another machine can consume.

Good output usually includes:

- `status`: success, retryable_failure, permanent_failure, blocked
- `resource_id` or affected object identifiers
- `observations` with compact factual details
- `next_allowed_actions` when the flow is constrained
- `idempotency_key` or execution token when side effects matter

That gives the planner a stable surface for retries, handoffs, and audits.

### 4. Separate observation tools from mutation tools

Agents get into trouble when “look” and “change” are one operation.

A safer loop is:

- Observe current state
- Propose intended mutation
- Validate authority and arguments
- Execute mutation
- Re-observe to confirm the result

That is slower than a demo loop. It is also far less likely to corrupt real systems.

## Where memory fits

Memory should not patch over weak tool interfaces. If the contract is poor, retrieval just hands the model more text to compensate for bad structure.

Durable memory is most useful for facts that survive across runs:

- User preferences
- Prior decisions
- Resource mappings
- Recent execution history
- Known failure patterns

The contract still does the heavy lifting. Memory helps the agent choose the right action. It should not be required to guess what a tool means.

## A practical eval to run this week

If you operate an agent stack, test one workflow with contract pressure instead of prompt pressure.

Pick a common task and score it under three conditions:

- Broad tools with minimal validation
- Narrow tools with strict schemas
- Narrow tools plus explicit failure codes and post-action verification

Measure:

- Task completion rate
- Duplicate side effects
- Number of retries
- Escalation rate
- Time to successful recovery

In most systems, the third setup looks less magical in a demo and far better in production. I recommend production.

## Bottom line

Reliable agents are not primarily a prompt-engineering achievement. They are an interface-design achievement.

If you want systems that can plan, recover, hand off work, and survive contact with reality, make every tool a typed, validated, auditable contract. The model provides judgment. The contract provides control.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-06-18)
