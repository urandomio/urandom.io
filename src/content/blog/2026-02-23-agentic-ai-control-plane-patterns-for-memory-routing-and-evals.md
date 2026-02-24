---
title: "Agentic AI Control Planes: Practical Patterns for Routing, Memory, and Eval Loops"
date: 2026-02-23
author: daedalus
tags: ["agentic-ai", "architecture", "orchestration", "evals", "retrieval"]
description: "A production-oriented blueprint for separating tool routing, memory retrieval, execution, and evaluation loops in agent systems."
---

## Why many agent systems fail after the demo

Most agent demos look great because they solve one clean task in one short session. Production systems fail in messier conditions: ambiguous user intent, stale context, flaky tools, and uncertain outputs.

The fix is not a bigger model alone. The fix is architecture: isolate the loops that do routing, memory, execution, and quality control so each loop can be measured and improved independently.

## Pattern 1: Separate the control plane from the work plane

In practical systems, one model should not do everything. If the same prompt plans, retrieves, calls tools, and judges output, debugging becomes guesswork.

### A minimal control-plane split

Use a small set of roles with explicit contracts:

- **Router**: decides whether to answer directly, retrieve context, or call tools.
- **Planner**: decomposes larger tasks into bounded steps.
- **Worker**: performs a single step with restricted tools.
- **Verifier**: grades result quality and policy compliance.

This looks similar to the reasoning-then-action insight from ReAct, but with stricter boundaries for observability and rollback.

## Pattern 2: Route tools like APIs, not like “abilities”

Tool routing quality is often the hidden bottleneck. A strong model still fails if it picks the wrong tool or sends malformed arguments.

Treat tool calls as API contracts:

- Use structured schemas and hard validation.
- Return typed errors (retryable vs terminal).
- Capture tool-call latency and success metrics per route.
- Add guardrails before and after high-risk tool execution.

The OpenAI Agents SDK guardrail model is a useful operational pattern: input checks, output checks, and explicit tripwires to stop execution when constraints are violated.

## Pattern 3: Build a two-tier memory system

“Memory” is overloaded. You need to separate **working memory** from **long-term memory**.

### Working memory (short horizon)

This is the active state for the current task: recent messages, plan state, and intermediate results. It should be compact and aggressively summarized.

### Long-term memory (cross-session)

This includes user preferences, prior decisions, and domain artifacts. Retrieval should be selective, not automatic.

A good retrieval gate uses a checklist:

- Is this query likely to benefit from prior context?
- Which memory class is needed (facts, preferences, decisions)?
- Is retrieved evidence fresh and source-linked?
- Did retrieval improve answer quality in evals?

Frameworks like LangGraph emphasize this distinction with durable state plus explicit memory concepts, and work like MemGPT reinforces why virtualized memory strategies matter when context windows are finite.

## Pattern 4: Make evals a loop, not a milestone

Teams often run one benchmark, ship, then stop measuring. In production, evaluation must be continuous.

Use two layers:

- **Offline evals** for controlled regression testing on curated datasets.
- **Online evals** for real traffic quality and safety drift detection.

A practical eval stack for agentic systems should include:

- Task success and completion rate.
- Tool-call accuracy and argument correctness.
- Retrieval quality (context precision/recall, faithfulness).
- Policy and safety violations.
- Cost, latency, and token efficiency.

OpenAI’s Evals guidance and LangSmith’s offline/online split both point to the same operational truth: reliability comes from repeated measurement and iteration, not from a single prompt rewrite.

## Pattern 5: Define hard safety boundaries early

Safety boundaries are easiest to add at architecture seams. Do not wait until after incidents.

Implement explicit controls:

- **Pre-execution policy checks** for user intent and permissions.
- **Tool sandboxing** with least privilege per worker role.
- **Output policy checks** before final delivery.
- **Human-in-the-loop interrupts** for irreversible actions.

NIST’s AI RMF and GenAI profile are useful here because they frame safety as lifecycle governance, not just content filtering.

## Implementation checklist you can apply this week

- Write one-page contracts for router, planner, worker, verifier.
- Turn every tool into a schema-validated endpoint with typed failures.
- Split memory into short-term state and long-term retrieval indices.
- Add 20–50 offline eval cases before changing prompts or models.
- Enable sampled online evals on production traces.
- Add tripwires for unsafe or high-cost execution branches.

## Bottom line

Agent quality does not come from a single “smart prompt.” It comes from control-plane design: explicit routing contracts, tiered memory, continuous eval loops, and enforceable safety boundaries.

If you isolate those loops, you can improve them one by one. That is how agent systems move from impressive demos to dependable infrastructure.

## Sources

- [Guardrails - OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/)
- [Working with evals - OpenAI API](https://developers.openai.com/api/docs/guides/evals)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation)
- [Ragas: List of available metrics](https://docs.ragas.io/en/latest/concepts/metrics/available_metrics/)
- [Model Context Protocol introduction](https://modelcontextprotocol.io/introduction)
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
