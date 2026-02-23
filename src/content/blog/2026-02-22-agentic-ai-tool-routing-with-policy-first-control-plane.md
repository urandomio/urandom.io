---
title: "Agentic AI Tool Routing: Build a Policy-First Control Plane"
date: 2026-02-22
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "safety", "evals"]
description: "A practical architecture for routing agent tool calls with policy gates, retrieval contracts, and eval loops that hold up in production."
---

## Most agent failures are routing failures, not reasoning failures

In production, tool-using agents rarely fail because they "can’t think." They fail because they pick the wrong tool, call the right tool with bad parameters, or execute a risky action without enough evidence.

That makes tool routing a systems problem. You need explicit control planes, not just better prompts.

Anthropic’s guidance on agent architectures lands on the same principle: start simple, then add orchestration only where it improves outcomes. The teams that scale tend to use composable workflow patterns instead of magical autonomy.

## The policy-first routing pattern

A robust routing path is usually a sequence of gates, not a single model decision.

### Gate 1: Capability allowlist

First, filter tools by task class and user scope. The model should never "discover" tools at runtime that policy did not already permit.

Keep this layer deterministic:

- Map intent classes to allowed tool groups
- Enforce tenant/user-level permission boundaries
- Block side-effecting tools by default for ambiguous requests

This is where protocol-level capability declarations matter. MCP’s model formalizes explicit tools, resources, and capability negotiation, which is much easier to audit than hidden prompt glue.

### Gate 2: Evidence contract

Before any side effect, require minimum evidence. If the evidence is missing or stale, route to retrieval or human clarification.

A practical evidence contract includes:

- Required evidence types (policy, latest state, external confirmation)
- Freshness limits per evidence type
- Conflict rules when sources disagree
- Abstain behavior when requirements are unmet

This single step eliminates a large class of confident-but-wrong actions.

### Gate 3: Risk-weighted router scoring

Now let the model rank candidate tools, but only inside approved boundaries. Include risk and reversibility in the score, not just "likelihood of success."

A simple scorecard works well:

- Task fit (can this tool solve the requested step?)
- Parameter confidence (are required fields grounded?)
- Blast radius (how bad is an incorrect call?)
- Recovery cost (can we roll back?)

When scores are close, prefer lower-blast-radius actions or ask a clarifying question.

## Prompt architecture that improves routing reliability

Prompt quality still matters, but prompts should carry structured routing intent, not vague roleplay.

Use a stable decision envelope for every routing turn:

- Objective and completion criteria
- Hard constraints and policy text
- Allowed tool set for this step
- Required evidence checklist
- Stop/escalate conditions

This structure reduces random tool hopping and makes trace analysis much easier. It also aligns with modern model-spec style "chain of command" ideas where instructions have explicit authority levels.

## Durable execution and idempotency are routing features

Routing is not just selection. It includes what happens after failure.

For long-running workflows, durable execution is critical. If a process pauses for human review or fails mid-run, resumability prevents duplicate actions and state drift.

LangGraph’s durable execution docs emphasize determinism and idempotency for resumed runs. Even if you do not use that stack, the same rule holds: side-effecting actions should be replay-safe and tied to idempotency keys.

## Build eval loops around decisions, not just final answers

A final response can look good while routing quality degrades silently. This is why agent evals should score decision traces.

Track these routing metrics continuously:

- Tool-selection precision by intent class
- Unsafe-call catch rate (blocked before execution)
- Clarification rate when evidence is missing
- Duplicate side-effect rate after retries
- Human-override rate on high-risk calls

OpenAI’s eval guidance is right to emphasize task-specific tests and continuous iteration. For agent systems, that means replaying real routing failures and measuring whether control gates caught them.

## Safety boundaries to enforce at runtime

Prompt injection remains a top risk, especially when agents ingest untrusted external content and then call tools. OWASP’s 2025 LLM guidance makes this explicit.

Minimum runtime boundaries:

- Treat retrieved external text as untrusted input
- Re-validate tool arguments against policy after model generation
- Require explicit confirmation for destructive actions
- Log tool arguments, evidence bundle, and gate outcomes
- Add automatic handoff rules for high-uncertainty states

These controls are boring, but they are the difference between a demo and a dependable system.

## Bottom line

If you want reliable agentic AI, treat tool routing as a governed control plane. Put policy and evidence gates before model choice, make execution replay-safe, and evaluate the decision path continuously.

Bigger models help. Better routing architecture helps more.

## Sources

- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [Model Context Protocol Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [LangGraph Durable Execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)
- [Model Spec (2025-12-18)](https://model-spec.openai.com/2025-12-18.html)
- [Evaluation Best Practices (OpenAI)](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- [LLM01:2025 Prompt Injection (OWASP GenAI)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Agent2Agent (A2A) Protocol](https://github.com/a2aproject/A2A)
