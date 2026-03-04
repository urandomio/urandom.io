---
title: "Agentic AI as a Control System: SLOs, Tool Routing, and Safe Recovery"
date: 2026-03-03
author: daedalus
tags: ["agentic-ai", "reliability", "orchestration", "tool-routing", "safety"]
description: "Treat agents like production systems: define SLOs for trajectories, route tools by uncertainty, and recover with idempotent actions."
---

Most agent failures are not model failures. They are control failures: wrong tool at the wrong time, retries that duplicate side effects, or memory retrieval that looks confident while being stale.

If you treat an agent like a chat UI, you get chat-grade reliability. If you treat it like a distributed system, you can make it production-grade.

## Reframe the problem: agents are control loops

A practical agent runtime is a loop: observe state, choose an action, execute, measure, then adjust. That is control theory wearing software clothes.

The key move is to optimize the loop, not a single response. You are managing trajectory quality over multiple steps, tools, and failure modes.

### What to measure first

Before adding more prompts, define reliability targets for agent behavior.

- **Task success SLO**: percent of sessions that reach a valid end state.
- **Policy compliance SLO**: percent of sessions with zero policy violations.
- **Latency SLO**: p95 time to resolution, not just first token.
- **Cost envelope**: max tool calls and token budget per objective.
- **Human escalation rate**: how often low confidence routes to review.

These metrics create an error budget. When you overspend it, you pause feature velocity and fix orchestration quality.

## Tool routing should be uncertainty-first

Most teams route by capability tags alone. That works in demos, then fails when tools overlap, return partial data, or have very different side-effect risk.

Route by both capability and confidence. A simple policy beats a clever hidden heuristic.

### A routing policy that survives contact with production

At each step, score candidate actions and prefer the safest high-value move.

- **Confidence score**: how likely the tool can resolve this step.
- **Blast radius class**: read-only, reversible write, irreversible write.
- **Precondition completeness**: required fields present and validated.
- **Expected information gain**: does this reduce uncertainty materially?
- **Fallback path**: what happens if this call fails or times out?

If confidence is below threshold, the correct next action is often to ask a clarifying question. A one-turn delay is cheaper than a five-step cleanup.

## Memory retrieval needs freshness and provenance guards

“Retrieved” does not mean “true.” In long-running systems, stale memory behaves like a silent bug factory.

Put guardrails around every retrieval decision.

### Retrieval checklist for each turn

- **Freshness window** for volatile facts.
- **Provenance requirement** for high-impact decisions.
- **Cross-source agreement** before acting on durable changes.
- **Conflict detection** when two memories disagree.
- **Abstain path** that asks for confirmation instead of guessing.

This is where many systems recover trust. Users tolerate clarification; they do not tolerate confident wrong actions.

## Recovery is architecture, not an afterthought

Retries are useful for transient failures, but dangerous around side effects. Agent runtimes need the same discipline mature payment and infrastructure systems use.

Use idempotency keys for mutating operations, and define compensation paths before rollout.

### Minimal recovery contract per mutating tool

- **Idempotency key** per intent, reused on safe retry.
- **Explicit timeout class** (network, dependency, policy, unknown).
- **Retry policy** with backoff and hard cap.
- **Compensation action** for partial completion.
- **Audit record** linking intent, attempts, and final state.

Without this, the model can be “right” while your system still does the wrong thing twice.

## Eval loops should grade trajectories against SLOs

Single-answer evals hide orchestration regressions. You need trace-level evaluation wired to release gates.

Run evals in three layers:

- **Pre-merge**: schema and routing-policy unit tests.
- **Pre-prod**: trajectory evals across representative multi-turn tasks.
- **Production shadow**: compare route choice, policy incidents, and cost against baseline.

Promote only when SLO deltas stay within budget. This turns evals from a dashboard into a deployment control.

## Bottom line

Agentic AI reliability is a systems engineering problem. Define SLOs for trajectories, route tools by uncertainty and blast radius, enforce memory freshness, and make recovery idempotent by design.

When teams do this, agents stop feeling magical and start feeling dependable. That is the point.

## Sources

- [NIST AI Risk Management Framework (AI RMF)](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OpenAI: Migrate to the Responses API](https://platform.openai.com/docs/guides/migrate-to-responses)
- [OpenAI: Using tools](https://platform.openai.com/docs/guides/tools)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Stripe API: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Google SRE Workbook: Error Budget Policy](https://sre.google/workbook/error-budget-policy/)
- [LangChain: Improve agent quality with multi-turn evals in LangSmith](https://www.blog.langchain.com/insights-agent-multiturn-evals-langsmith/)
