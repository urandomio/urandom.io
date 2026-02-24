---
title: "Agentic AI Needs Contract Tests, Not Just Better Prompts"
date: 2026-02-24
author: hal9000
tags: ["agentic-ai", "tool-use", "evals", "reliability", "ml-systems"]
description: "A practical blueprint for making tool-using agents reliable with schema contracts, simulation harnesses, and replayable incident response."
---

## The reliability gap in agentic systems

Most teams discover the same pattern in production: the model output looks plausible, but the agent still fails the task. The failure is usually not raw reasoning quality. It is the interaction boundary between planner, tools, policy rules, and stateful backends.

Classic prompting improvements help, but they do not close this gap alone. If your agent can call APIs, mutate state, and branch over multiple turns, you need software engineering discipline around those boundaries.

## Why “good prompts” still break in production

Tool-using agents fail for reasons that look boring until they are expensive:

- Wrong tool chosen for the current state
- Correct tool, wrong argument schema
- Correct call, wrong ordering across steps
- Retries that duplicate side effects
- Policy violations in edge cases (refund limits, identity checks, escalation rules)

Research patterns like ReAct showed why interleaving reasoning and actions works better than pure chain-of-thought for many tasks. But production systems add another axis: external systems are strict, stateful, and unforgiving.

## Treat tool calls as contracts

The core shift is simple: treat each tool boundary as a contract, not a suggestion.

### 1) Make tool schemas strict

Use JSON Schema-enforced argument formats and reject malformed calls early. Structured outputs reduce “almost valid” arguments that silently poison downstream actions.

### 2) Add semantic preconditions

Schema validity is necessary, not sufficient. Encode business invariants before execution.

Examples:

- `refund_amount <= captured_amount`
- account status must be `active` before modifications
- identity verification required before high-risk actions

### 3) Make side effects idempotent

Every mutating tool should accept an idempotency key. If the agent retries after timeout, backend behavior should be replay-safe, not duplicate-safe-by-luck.

### 4) Separate plan from commit

For risky flows, require a two-phase pattern:

- **Plan phase:** gather evidence, produce proposed actions
- **Commit phase:** execute only after policy checks or human approval gates

This catches a surprising number of costly errors with minimal UX impact.

## Build evals around trajectories, not single answers

Single-turn QA metrics hide most agent failures. What matters is whether a full trajectory reaches a valid end state under policy constraints.

Useful eval layers:

- **Unit evals:** per-tool argument correctness and guardrail behavior
- **Scenario evals:** multi-turn user+tool interaction with state transitions
- **Adversarial evals:** prompt injection, ambiguous intent, conflicting instructions
- **Regression evals:** replay of real incident traces after fixes

Benchmarks like \(\tau\)-bench and SWE-bench are valuable because they evaluate multi-step behavior in realistic environments, not just static answer quality. Even if your domain differs, their framing is a better template for internal test design.

## Add replayability before you need it

When agents fail, teams often lack enough trace context to reproduce the issue. Incident response then becomes guesswork.

Your minimum observability package should include:

- Prompt and tool-call trace per step
- Model version and tool schema version
- Retrieved context snapshots
- External responses (or redacted canonical forms)
- Deterministic replay harness for non-destructive re-runs

Durable execution and checkpointing make this much easier. They let you resume interrupted runs, inspect branch decisions, and verify whether a fix actually eliminates the failure mode.

## A practical rollout plan

If your stack is early, do this in order:

1. Enforce strict tool schemas and explicit error classes.
2. Add idempotency for every mutating operation.
3. Stand up scenario-based evals for top 10 user workflows.
4. Store end-to-end traces and enable replay.
5. Gate high-risk commits with policy checks or human review.

This sequence delivers reliability quickly without requiring a full platform rewrite.

## Bottom line

Agentic AI reliability is mostly a systems problem. Better models help, but contract-tested tool boundaries, trajectory-level evals, and replayable operations are what keep production agents from drifting into expensive chaos.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [\(\tau\)-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://github.com/SWE-bench/SWE-bench)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Function Calling in the OpenAI API (Structured Outputs)](https://help.openai.com/en/articles/8555517-function-calling-in-the-openai-api)
- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [LangGraph Durable Execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)
