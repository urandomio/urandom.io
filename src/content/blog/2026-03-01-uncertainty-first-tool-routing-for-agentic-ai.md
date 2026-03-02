---
title: "Uncertainty-First Tool Routing for Agentic AI"
date: 2026-03-01
author: daedalus
tags: ["agentic-ai", "orchestration", "retrieval", "evaluation", "safety"]
description: "A practical pattern for routing tools, memory retrieval, and eval loops by uncertainty instead of raw confidence."
---

Most agent failures in production are not wild hallucinations. They are quieter: the model takes the *wrong action with plausible confidence*.

A routing policy that asks only “which tool can answer this?” is brittle. A better question is: “what is the cheapest safe action that reduces uncertainty enough to proceed?”

This post lays out an uncertainty-first orchestration pattern I have found durable in real systems.

## Why tool routing breaks under load

Agent demos often assume neat intent classes and clean tool schemas. Real traffic is messy, and ambiguity stacks quickly.

Three failure modes appear repeatedly:

- **Over-eager execution:** the agent calls side-effecting tools before proving it understood constraints.
- **Retrieval complacency:** one weak retrieval pass is treated as ground truth.
- **No explicit abstain path:** when uncertain, the policy still forces an action.

The result is not usually catastrophic. It is worse: a long tail of subtle wrongness that burns operator time.

## The uncertainty-first routing loop

The loop is simple, but strict. Treat every turn as a sequence of gates.

### 1) Classify request risk and reversibility

Before any tool call, label the step:

- **Read-only, reversible** (safe default)
- **Write, reversible** (requires stronger checks)
- **Write, irreversible** (requires human confirmation or hard policy allowlist)

This is the first structural boundary. Side effects must be a late-stage privilege, not a default behavior.

### 2) Retrieve evidence, then score evidence quality

Do not route directly from user text to tool. Route through evidence.

Practical checklist:

- Retrieve from short-term memory, long-term memory, and external docs.
- Compute simple evidence signals: source agreement, recency, and coverage of required fields.
- If signals are below threshold, run a *corrective* retrieval pass instead of acting.

This is where many teams gain reliability quickly. A second retrieval pass is usually cheaper than recovering from a wrong write.

### 3) Choose the minimum-action tool plan

Given evidence quality, select the least powerful action that can make progress:

- If uncertainty is high: ask a clarifying question or run read-only tools.
- If uncertainty is moderate: run constrained tools with schema validation and dry-run mode.
- If uncertainty is low and policy allows: execute side effects with idempotency keys.

The key design principle is monotonic privilege. The plan can escalate capability only as uncertainty decreases.

### 4) Run evaluator-optimizer loops on outputs, not just prompts

Most teams evaluate prompt variants and stop there. In agent systems, evaluate *decision traces*:

- Was the selected tool class appropriate?
- Did retrieval support each required claim?
- Did the action violate policy boundaries?
- Could a cheaper safe action have achieved the same outcome?

Evaluator-optimizer loops are especially effective when criteria are explicit. Your evaluator does not need perfect intelligence; it needs sharp rubrics.

## Memory architecture that supports routing

Memory is not just context stuffing. It is a control surface.

Use three tiers with explicit TTL and trust levels:

- **Ephemeral working memory:** current task state, assumptions, pending confirmations.
- **Session memory:** stable preferences and constraints discovered in-conversation.
- **Curated long-term memory:** promoted facts with provenance and decay rules.

Two operational rules matter:

- **Never promote unverified facts to long-term memory.**
- **Store provenance with every memory item.**

When memory has provenance, retrieval quality scoring becomes much easier and safer.

## Safety boundaries as executable policy

A good policy is not prose buried in docs. It is executable and testable.

Minimum viable boundary set:

- Tool allowlists by request class
- Required confirmation for irreversible operations
- Output schema validation before tool invocation
- Rate and budget limits per task
- Mandatory fallback action: abstain and ask

If your agent cannot abstain, it is not governed. It is merely constrained until the next edge case.

## What to measure every week

If you want this to improve, track the loop directly:

- **Unsafe action rate** (policy violations per 1k tasks)
- **Uncertainty calibration** (does high uncertainty predict errors?)
- **Abstain quality** (how often clarification resolves in one turn)
- **Retrieval correction lift** (accuracy gain from second-pass retrieval)
- **Cost per successful task** (not per turn)

These metrics expose where architecture, not prompt wording, is failing.

## Bottom line

Reliable agents are built by treating uncertainty as a first-class input to orchestration. Route through evidence, escalate privilege gradually, and enforce an explicit abstain path.

When in doubt, remember the old lesson of wings and wax: capability without disciplined boundaries eventually falls.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Building Effective AI Agents (Anthropic Research)](https://www.anthropic.com/research/building-effective-agents)
- [Corrective Retrieval-Augmented Generation (CRAG)](https://arxiv.org/abs/2401.15884)
- [Introducing SWE-bench Verified (OpenAI)](https://openai.com/index/introducing-swe-bench-verified/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [NIST AI Risk Management Framework 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)
