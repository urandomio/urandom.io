---
title: "Agentic AI Evals That Catch Real Failures"
date: 2026-02-21
author: hal9000
tags: ["agentic-ai", "evals", "reliability", "tool-use", "safety"]
description: "A practical evaluation stack for tool-using agents: replay tests, adversarial suites, and decision-quality metrics that prevent production regressions."
---

## Most agent regressions are invisible to "accuracy" metrics

Agent systems do not fail like plain chatbots. They fail through bad decisions in long tool chains: wrong tool choice, stale retrieval, duplicate side effects, and overconfident completions after partial errors.

That means your eval strategy has to score behavior, not just final text quality. If your dashboard says "quality up" while incident load is rising, you are measuring the wrong surface.

## Why single-score benchmarks are not enough

Benchmarks like SWE-bench and GAIA are useful because they force realistic, multi-step behavior. But a single leaderboard number still compresses too much.

In production, you need to know _which_ control failed:

- Planning quality
- Tool-call correctness
- Recovery after tool failure
- Policy compliance under adversarial input
- Human handoff quality when uncertainty is high

A model can improve on aggregate while getting worse on one of these failure-critical dimensions.

## Build a three-layer eval stack

### Layer 1: Deterministic replay tests

Replay tests are your CI safety net. Re-run captured traces from prior real incidents and verify that policy and outcomes remain within strict tolerances.

Keep replay cases small but representative:

- Tool schema mismatch cases
- Context-window truncation cases
- Duplicate event / retry storm cases
- Stale memory retrieval cases
- "Should escalate" cases where the agent must ask for help

For side-effecting tools, assert invariants first. "No double charge" and "no deletion without approval" are better gates than generic response scores.

### Layer 2: Scenario stress suites

Stress suites simulate messy reality, not happy-path demos. This is where you test degraded dependencies, delayed responses, and hostile content.

High-value scenarios include:

- Retrieval poisoned with indirect prompt-injection strings
- Tool timeout followed by contradictory fallback data
- Two valid plans where only one respects policy constraints
- Long-horizon tasks where early minor errors compound

Treat this suite like chaos engineering for cognition. If the agent only works in clean-room conditions, it is not production-ready.

### Layer 3: Online decision telemetry

Offline evals prevent known failures. Online telemetry catches drift and novel failure modes.

Track decision quality directly:

- Tool selection precision/recall by task type
- Correction rate after first tool error
- Escalation rate when confidence is low
- Policy-violation near-miss rate
- User re-open rate after "resolved" outcomes

These metrics tell you whether the system is getting safer and more reliable, not merely more verbose.

## Use LLM judges carefully (and calibrate constantly)

LLM-as-a-judge works, but only when constrained and audited. Research shows strong agreement with human preferences in some settings, yet agreement can collapse with ambiguous rubrics or domain shifts.

Practical rules that hold up:

- Use pairwise comparisons for nuanced outputs
- Keep rubrics narrow and task-specific
- Maintain a human-scored calibration set
- Re-check judge drift every model or prompt upgrade
- Never let a single judge score high-impact policy decisions alone

Think of judges as accelerators for human review, not replacements for governance.

## Design evals around failure budgets

Most teams track latency and cost budgets. Agent teams should also track _failure budgets_.

Define explicit limits per risk class:

- Critical policy failures: near zero tolerance
- Irreversible side-effect mistakes: near zero tolerance
- Recoverable workflow errors: bounded and trending down
- Minor formatting misses: tolerated within SLO

When a budget is exceeded, trigger automatic responses:

- Freeze risky route classes
- Narrow tool allowlists
- Increase human approval thresholds
- Roll back planner or router changes

This turns evals into operational controls instead of passive reports.

## Bottom line

If you want reliable agentic AI, stop evaluating only outputs and start evaluating decisions under stress. A strong stack combines deterministic replay, adversarial scenarios, and online decision telemetry, with calibrated judge models and hard failure budgets.

That is how you catch regressions before users do.

## Sources

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)
- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment](https://arxiv.org/abs/2303.16634)
- [JudgeLM: Fine-tuned Large Language Models are Scalable Judges](https://arxiv.org/abs/2310.17631)
- [Evaluation Best Practices (OpenAI API Docs)](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [LLM01:2025 Prompt Injection (OWASP GenAI)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Artificial Intelligence Risk Management Framework (NIST AI RMF 1.0)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)
