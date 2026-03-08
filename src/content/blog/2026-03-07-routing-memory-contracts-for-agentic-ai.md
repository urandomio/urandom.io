---
title: "Routing and Memory Contracts: A Practical Blueprint for Agentic AI That Doesn’t Drift"
date: 2026-03-07
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "memory", "evals", "safety"]
description: "A production-focused pattern language for agent orchestration: deterministic routing, memory contracts, bounded autonomy, and trace-based eval loops."
---

## Why most agent failures are orchestration failures

When an agent goes off the rails, the model is often blamed first. In production systems, the root cause is usually weaker: unclear routing rules, low-quality memory writes, and missing stop conditions.

The model is only one component in a larger machine. If tool access is underspecified and memory is treated like an ungoverned dump, even strong models produce brittle behavior.

The architecture that holds up looks less like “autonomous magic” and more like disciplined systems engineering.

## Pattern 1: Route before you reason

A practical mistake is letting the model decide *everything*: whether to call tools, which tools to call, and what risk class the action belongs to. That collapses policy and planning into one opaque step.

A stronger approach is a deterministic pre-router that classifies intent, risk, and budget *before* free-form reasoning.

### A minimal routing contract

For each user task, classify and attach metadata:

- **Intent class:** retrieve, transform, decide, execute
- **Risk class:** read-only, reversible write, irreversible write
- **Budget class:** max tool calls, latency ceiling, token ceiling
- **Escalation mode:** auto, require approval, deny

Then constrain the planner to tools allowed by that tuple. This mirrors a core lesson from ReAct: reasoning and acting improve together, but only when actions remain grounded by explicit structure.

## Pattern 2: Treat memory as a governed interface

Most teams have retrieval. Fewer teams have memory governance. The difference matters.

Ungoverned memory slowly poisons execution: stale summaries become “facts,” speculative chain-of-thought leaks into durable state, and agents anchor on yesterday’s assumptions.

### A useful memory model

Split memory into three stores with explicit write rules:

- **Working memory:** ephemeral task state; TTL measured in minutes/hours
- **Episode memory:** run summaries and outcomes; immutable after finalization
- **Policy memory:** durable constraints and decisions; write-on-review only

A write should include provenance fields (source, timestamp, confidence, actor). If a record cannot be traced, it should not be trusted.

### Freshness gate before side effects

Before any irreversible action, require a retrieval gate:

- fetch top supporting records
- verify freshness window per record
- detect contradictions across sources
- block execution if contradictions remain unresolved

This reduces a common failure mode: “confidently wrong with citations to stale context.”

## Pattern 3: Use eval loops on traces, not just final answers

Final-answer scoring is necessary and insufficient. Agents can produce a correct outcome while violating policy, wasting tools, or retrying dangerously.

Evaluate at the trace level, where behavior is observable.

### Four eval loops that catch real regressions

- **Routing evals:** wrong-tool rate, disallowed-tool attempt rate
- **Memory evals:** stale-memory usage rate, contradiction-ignore rate
- **Safety evals:** blocked-unsafe precision, blocked-safe false positive rate
- **Cost/reliability evals:** median tool calls per success, timeout recovery rate

SWE-bench and SWE-bench Verified are useful because they emphasize full task resolution under realistic constraints. Keep those capability signals, but add production-specific behavioral metrics from your own traces.

## Pattern 4: Build autonomy boundaries that are machine-checkable

“Be careful” is not an architecture. Boundaries must be executable.

In practice, this means every high-risk path has deterministic guards outside the model prompt.

### Boundary checklist

- schema validation on every tool call
- idempotency key required for side-effecting operations
- mandatory approval for irreversible actions
- hard ceilings on turns, runtime, and spend
- structured partial-result handoff when ceilings are hit

OWASP’s 2025 LLM guidance keeps reinforcing the same operational truth: prompt-level instruction is necessary, but insufficient against injection and context manipulation.

## Prompt architecture that works with the control surface

Prompt design still matters, but it should align with orchestration rather than substitute for it.

A stable pattern is layered prompts:

- **System layer:** role, global constraints, non-negotiable policy
- **Task layer:** objective, acceptance criteria, allowed tools
- **State layer:** current plan step, retrieved evidence, budget counters

When these layers are explicit, traces become debuggable. When they are blended into one giant prompt, failures become archaeology.

## Bottom line

If you want reliable agentic systems, optimize for contracts, not vibes.

Deterministic routing, governed memory writes, trace-level evals, and machine-checkable safety boundaries will outperform prompt-only cleverness over time. The model can be brilliant, but your architecture decides whether that brilliance survives contact with production.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models (arXiv)](https://arxiv.org/abs/2210.03629)
- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [Effective Context Engineering for AI Agents (Anthropic Engineering)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [LangGraph Durable Execution Docs](https://docs.langchain.com/oss/python/langgraph/durable-execution)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-06-18)
- [OWASP Top 10 for LLM Applications (2025)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Introducing SWE-bench Verified (OpenAI)](https://openai.com/index/introducing-swe-bench-verified/)
- [SWE-bench Leaderboard](https://www.swebench.com/)
