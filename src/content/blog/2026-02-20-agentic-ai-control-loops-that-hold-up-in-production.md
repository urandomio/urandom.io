---
title: "Agentic AI Control Loops That Hold Up in Production"
date: 2026-02-20
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "evals", "safety"]
description: "A practical architecture for routing tools, managing memory, and running eval loops so agents stay reliable under real load."
---

## Why most agent failures are orchestration failures

Teams often assume agent quality is mostly a model problem. In production, many incidents come from orchestration mistakes: wrong tool selection, stale retrieval, retry storms, or unsafe side effects triggered from ambiguous context.

The common pattern is simple. The model produces a plausible step, but the system around it lacks a strong control loop. If routing, memory, and evaluation are weak, even good model outputs become operationally brittle.

## Pattern 1: Route tools through a policy layer

Tool routing should not be “whatever function seems relevant.” It needs an explicit policy plane that decides which tools are eligible, under what preconditions, and with what approval mode.

A useful structure is a two-stage gate. First, classify intent into a narrow task type. Second, map that task type to a bounded tool allowlist with execution constraints.

### Practical routing checklist

- Define task classes with deterministic labels (for example: `lookup`, `draft`, `mutate`, `commit`).
- Bind each class to an allowlist of tools and argument schemas.
- Add confidence thresholds that force clarification when intent is ambiguous.
- Require idempotency keys for side-effecting calls.
- Log route decisions with reason codes so failures are debuggable.

Standards help here. MCP is useful because tool interfaces become portable across runtimes, but portability alone is not safety. You still need runtime policy checks before execution.

## Pattern 2: Split memory into three lanes

Many systems blur scratchpad notes, session context, and durable facts. That creates retrieval drift and accidental self-contradiction over long runs.

A better pattern is to separate memory by purpose and write policy.

### Memory lanes

- **Working memory:** ephemeral chain state for the current run.
- **Session memory:** short-horizon user/task context with expiration.
- **Durable memory:** committed facts and decisions with provenance.

For durability, checkpointing matters more than embeddings alone. If state cannot be resumed consistently after interruption, retrieval quality becomes irrelevant during failures.

### Retrieval quality gates

- Attach source provenance and write timestamp to every durable fact.
- Reject low-similarity retrieval when high-risk actions are requested.
- Prefer “ask one clarifying question” over acting on uncertain recall.
- Add stale-read guards: if a newer revision exists, force re-read.

## Pattern 3: Run eval loops that test behavior, not vibes

Offline benchmark scores are necessary but incomplete. Agent systems need evals that target operational failure modes: bad routes, missing guardrails, and tool outputs that should have been rejected.

Treat evals as a control loop, not a monthly report. Each deploy should run targeted scenarios and fail fast when a policy invariant breaks.

### A minimal eval loop

- Build scenario sets for normal paths, adversarial prompts, and degraded dependencies.
- Score each run on route correctness, policy compliance, and outcome quality.
- Diff metrics against a pinned baseline and block regressions beyond tolerance.
- Store failing traces with tool I/O and memory snapshots for replay.
- Convert recurring failure classes into permanent regression tests.

This is where security and reliability converge. Prompt injection guidance now explicitly treats indirect instructions in retrieved content as a top risk, so evals should include hostile documents and tool output poisoning cases.

## Pattern 4: Use prompt architecture as interfaces, not prose

Long prompts with mixed goals are hard to reason about and harder to test. A cleaner approach is interface-oriented prompting: each step has explicit inputs, constraints, and required output shape.

Think in layers:

- **Policy prompt:** immutable constraints and forbidden actions.
- **Task prompt:** objective, acceptance criteria, and stop conditions.
- **Tool prompt:** per-tool argument rules and error handling expectations.

When prompts are modular, you can run targeted evals per layer and isolate regressions quickly.

## Pattern 5: Put safety boundaries at execution time

Prompt text alone cannot enforce boundaries under adversarial or noisy inputs. High-impact actions need runtime controls outside the model.

Use guardrails where they are hardest to bypass:

- Capability-scoped credentials per tool.
- Server-side schema validation and argument sanitization.
- Approval workflow for irreversible actions.
- Immutable audit logs linking user intent to executed effect.

If a system cannot answer “why was this action allowed?” with a concrete trace, it is not production-safe yet.

## Bottom line

Reliable agentic AI is mostly a systems design problem. Strong tool routing, lane-based memory, continuous eval loops, and execution-time safety controls do more for production quality than endlessly rewriting a monolithic prompt.

## Sources

- [Model Context Protocol Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [Using Tools (OpenAI API Docs)](https://platform.openai.com/docs/guides/tools)
- [Evaluation Best Practices (OpenAI API Docs)](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [LangGraph Persistence and Checkpointing](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LLM01:2025 Prompt Injection (OWASP GenAI)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
