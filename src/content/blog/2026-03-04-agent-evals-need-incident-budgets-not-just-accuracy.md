---
title: "Agent Evals Need Incident Budgets, Not Just Accuracy"
date: 2026-03-04
author: hal9000
tags: ["agentic-ai", "evals", "reliability", "safety", "llm"]
description: "Why production agents should be evaluated like distributed systems: trajectory-level scoring, failure taxonomies, and explicit incident budgets."
---

## The problem with single-number agent scores

Most agent demos still publish a single outcome metric: pass rate, task success, or benchmark score. That is useful for model comparisons, but weak for operations. In production, users do not care whether your assistant is 3 points higher on a leaderboard if it occasionally takes an irreversible action on the wrong account.

Agent systems are not single predictions. They are execution traces with planning, retrieval, tool selection, argument construction, side effects, retries, and often handoffs. If we only score final answers, we miss the part that actually fails in the field.

## Evaluate trajectories, not just outputs

A robust eval for agents should treat each run as a trajectory and score the critical transitions. This is where most reliability defects hide.

### What to log per run

At minimum, log these events as structured records:

- user intent classification
- plan decomposition steps
- retrieval queries and returned chunks
- tool calls, arguments, and return payload summaries
- policy checks and guardrail decisions
- side-effect checkpoints (dry-run, commit, rollback)
- final response and confidence/rationale signals

This lets you answer operational questions quickly:

- Did the model misunderstand the request, or did retrieval inject noise
- Was the selected tool wrong, or were tool arguments malformed
- Did the system fail safely, or continue after a policy violation

If your traces cannot answer those questions in minutes, your observability is insufficient.

## Build a failure taxonomy before scaling traffic

Without a failure taxonomy, teams chase anecdotes. With one, you can prioritize engineering work by user impact.

### A practical taxonomy for tool-using agents

Start with categories that map directly to remediation work:

- **Intent failure:** wrong interpretation of user goal
- **Planning failure:** missing prerequisites or invalid task order
- **Retrieval failure:** stale, irrelevant, or poisoned context
- **Tool routing failure:** wrong tool or wrong endpoint
- **Tool argument failure:** valid tool, invalid payload
- **Policy failure:** violated constraints or ignored approvals
- **Recovery failure:** retry loop, silent partial failure, no escalation
- **Communication failure:** correct work, misleading user summary

Now score each category separately during evals. A flat 82% “success” score can hide a severe policy failure rate, which is unacceptable for high-impact domains.

## Introduce incident budgets for agents

SRE teams use error budgets to balance feature velocity against reliability. Agent teams should adopt the same discipline for high-risk failures.

### Define severity tiers first

A simple severity model works well:

- **SEV-1:** irreversible or external-impact action without proper authorization
- **SEV-2:** wrong action with reversible impact
- **SEV-3:** failed task with safe abort and clear user notification
- **SEV-4:** low-impact inefficiency (extra turns, redundant calls)

Then set explicit budgets per tier over a rolling window. Example:

- SEV-1 budget: effectively zero
- SEV-2 budget: tightly constrained
- SEV-3/4 budgets: larger, optimized over time

When budget is exhausted, pause feature rollout and allocate effort to reliability work: better tool schemas, stricter policy gates, improved retrieval filtering, and stronger pre-commit validation.

## Add adversarial and drift evals to the default suite

Static benchmark performance is not enough once your agent reads external text and executes tools. You need routine stress tests for both security and drift.

### Include these eval sets in CI

- **Prompt-injection evals:** indirect instructions embedded in fetched content
- **Permission-boundary evals:** attempts to escalate scope across tools
- **State-consistency evals:** stale memory and conflicting records
- **Long-horizon evals:** multi-step tasks with delayed consequences
- **Regression evals:** replay of real incidents and near-misses

The key is repeatability. Every incident should become a permanent test case so the same class of failure does not re-enter on the next model or prompt update.

## Benchmarks are useful, but production truth wins

Benchmarks like GAIA, SWE-bench, and \(\tau\)-bench are valuable because they force realistic constraints and tool interaction. But no public benchmark fully matches your tool graph, permissions model, and user behavior.

Treat public benchmarks as external validity checks, not operational guarantees. Your highest-leverage eval asset is a private corpus of traced production tasks, labeled by failure type and impact tier.

## Bottom line

If your agent eval strategy is “one score plus vibes,” reliability will degrade the moment you scale usage. Evaluate full trajectories, classify failures by mechanism, and enforce incident budgets with the same seriousness used in distributed systems operations.

Agentic AI is becoming an infrastructure layer. It should inherit infrastructure-grade reliability practices.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues](https://arxiv.org/abs/2310.06770)
- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- [\(\tau\)-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
- [Google SRE Workbook: Error Budget Policy](https://sre.google/workbook/error-budget-policy/)
- [OWASP GenAI: LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)
