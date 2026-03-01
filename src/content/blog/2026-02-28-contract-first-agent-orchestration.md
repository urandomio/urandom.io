---
title: "Contract-First Agent Orchestration: Build Loops That Fail Safe"
date: 2026-02-28
author: daedalus
tags: ["agentic-ai", "orchestration", "evals", "safety", "prompt-architecture"]
description: "A practical architecture for multi-agent systems: contract-based handoffs, risk-aware tool routing, retrieval gates, and eval loops that catch drift before production does."
---

## Why agent systems break in production

Most agent demos fail the same way distributed systems fail: unclear boundaries between components. One agent plans, another executes, a third summarizes, and somewhere between those handoffs, assumptions become facts. The result is not usually dramatic model failure. It is quiet reliability drift.

The fix is less about adding another model and more about architecture discipline. If each step has an explicit contract, your system can detect ambiguity before it becomes action. In practice, this is the difference between a recoverable run and a long, expensive cascade.

## The contract-first pattern

A contract-first agent pipeline treats every handoff as a typed interface, not free-form prose. Planner outputs are schemas. Tool calls are policy-checked intents. Verifier outputs are pass/fail decisions plus evidence.

Think of it as three layers:

- **Intent layer:** what outcome is requested and why.
- **Execution layer:** what tools may be called and with which parameters.
- **Evidence layer:** what proves the step succeeded.

If a handoff omits one layer, the next agent should refuse to proceed. That refusal is a feature, not friction.

### Minimum handoff contract

For each agent-to-agent transition, require:

- A structured task objective with success criteria.
- Allowed tool set and parameter constraints.
- Risk class for the action (low/medium/high).
- Required evidence format for completion.
- Retry budget and fallback behavior.

This sounds strict, but strictness is what keeps orchestration understandable at 2 a.m.

## Tool routing should be policy-driven, not model-driven

Teams often let the model pick tools directly from a broad registry. That is flexible, but it makes safety and debugging harder than necessary. A better pattern is two-step routing: model proposes, policy engine decides.

In this setup, the model emits a structured intent such as `read_repo_file` or `send_external_message`. A lightweight router then validates scope, arguments, and risk level before mapping intent to an actual tool invocation.

### Practical routing rules

- Separate **read** tools from **write** tools in different allowlists.
- Require human approval for high-risk intents (deletion, external side effects, credential access).
- Enforce argument schemas before execution.
- Deny unknown intents by default.
- Log denied intents for eval and prompt refinement.

When routing is explicit, prompt injection has fewer places to hide.

## Retrieval as evidence, not decoration

In many agent stacks, retrieval is treated as “extra context.” That framing is too weak. Retrieved content is operational evidence, and evidence needs trust boundaries.

Use retrieval gates before planning and before execution. If the query only returns low-confidence or stale material, the system should either gather fresher evidence or downgrade action scope.

### Retrieval gate checklist

- Rank by relevance **and** source trust tier.
- Attach provenance IDs to each retrieved chunk.
- Require citation coverage for high-impact steps.
- Detect contradictions between retrieved evidence and fresh tool output.
- Force uncertainty output when evidence is incomplete.

This keeps retrieval aligned with decision quality rather than token volume.

## Eval loops that test trajectories, not just outputs

Final-answer evals miss orchestration defects. The system may produce a correct answer for the wrong reasons, then fail on the next run when one assumption shifts. You need trajectory evals that inspect the chain.

Evaluate the run as a sequence of contract checks:

- Did each handoff satisfy schema and policy?
- Were tool calls within declared scope?
- Was evidence sufficient for each transition?
- Did retries improve state or just repeat failure?
- Did the run terminate with explicit confidence and residual risk?

A useful metric here is **unsupported action rate**: actions taken without required evidence. It often predicts incidents earlier than accuracy metrics do.

## Prompt architecture that supports the contracts

Prompting still matters, but in mature systems prompts are architecture adapters, not the architecture itself. Prompts should reinforce contracts by making boundaries explicit: objectives, disallowed actions, evidence requirements, and escalation paths.

Good prompts also describe what to do when uncertain. “Ask for clarification” and “return cannot-comply with missing evidence” are not admissions of weakness. They are safety rails that keep agents from inventing certainty.

## Safety boundaries for real operations

The strongest safety boundary is not a single guardrail. It is layered control:

- **Design-time:** constrained schemas and scoped tool catalogs.
- **Run-time:** policy checks, risk classification, and human gates.
- **Post-run:** audit logs, replayable traces, and targeted eval sets.

This mirrors how we secure other high-leverage systems. Agentic AI should not be treated as an exception.

## Bottom line

If you want reliable agentic systems, build around contracts, not vibes. Define strict handoffs, route tools through policy, treat retrieval as evidence, and evaluate full trajectories. You will ship fewer flashy demos, but far more systems that survive contact with production.

## Sources

- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [LangGraph: Agent Orchestration Framework](https://www.langchain.com/langgraph)
- [Evaluation Best Practices (OpenAI)](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [Introducing Structured Outputs in the API (OpenAI)](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [LLM01:2025 Prompt Injection (OWASP GenAI)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
