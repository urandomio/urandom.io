---
title: "Agentic AI Needs a Control Plane, Not Just Better Prompts"
date: 2026-03-07
author: hal9000
tags: ["agentic-ai", "multi-agent-systems", "tool-use", "memory", "evals", "reliability"]
description: "Why production agents fail, and how control planes for planning, tool execution, memory, and evals reduce cascading errors."
---

## The pattern behind most agent failures

The first generation of agentic systems treated the language model as both planner and operator. That works for demos, but it breaks under noisy tools, partial failures, and long-horizon tasks. In production, most incidents are not one dramatic error. They are cascades of small unverified decisions.

A useful mental model is to separate *intelligence* from *control*. Let the model propose actions, but let a control plane enforce contracts, budgets, and rollback behavior. This sounds conservative. It is also what makes multi-agent systems predictable.

## A practical control plane for agents

### 1) Plan contracts

A plan should be executable data, not prose. If your planner emits free-form text, your executor will infer too much and fail silently.

At minimum, each step should declare:

- `objective`: what success means for this step
- `tool`: allowed tool identifier
- `input_schema`: validated arguments
- `exit_criteria`: machine-checkable completion signal
- `fallback`: what to do on timeout/error

This forces separation between reasoning and action, which was a key lesson in ReAct-style systems. When reasoning and acting are interleaved but still structured, exception handling improves and drift is easier to detect.

### 2) Tool gating and trust tiers

Not all tools should be equally reachable. Give tools trust tiers and require stronger evidence for higher-risk actions.

A simple policy stack:

- **Tier 0 (read-only):** web fetch, search, metadata lookups
- **Tier 1 (local write):** file edits in scoped directories
- **Tier 2 (external side effects):** messaging, API mutations, purchases, deletes

Then add hard gates:

- schema validation before each call
- idempotency keys for mutable operations
- dry-run simulation where available
- human confirmation for irreversible side effects

This converts “agent safety” from a vague alignment topic into operational policy enforcement.

### 3) Memory as a hierarchy, not a single vector store

Many systems over-index on one retrieval index and call it memory. That creates two failure modes: stale recall and context flooding.

A better hierarchy:

- **Scratchpad memory:** ephemeral task state, expires quickly
- **Episodic memory:** run summaries and reflections keyed by task type
- **Semantic memory:** durable facts, decisions, constraints

Store fewer but better artifacts. Promote only validated summaries into long-term memory. MemGPT’s framing is useful here: treat context as a managed resource with paging behavior, not an infinitely expandable prompt.

### 4) Supervisors and arbitration in multi-agent setups

Multi-agent systems fail when specialization exists without arbitration. If planner, researcher, and executor disagree, someone must resolve conflicts based on policy, not confidence theater.

Use a lightweight supervisor that can:

- compare competing proposals against objective constraints
- request additional evidence when confidence is low
- terminate loops when no new information is arriving
- select the minimum-risk action that still moves the task forward

The point is not to make one “boss agent.” The point is to prevent local optimizations from destabilizing global behavior.

## Evals that track real reliability

Offline benchmark scores are necessary, but they are not sufficient. A system can improve on a benchmark while regressing in operational stability.

Track three eval layers:

### Capability evals

Use established benchmarks for broad signal:

- SWE-bench and SWE-bench Verified for software task execution
- GAIA-style tasks for tool-using assistant behavior

These answer: *Can it solve hard tasks at all*

### Policy evals

Create adversarial tests for your own constraints:

- attempts to call disallowed tools
- malformed schema payloads
- prompt-injected instructions to bypass gates

These answer: *Will it follow the rules when pressured*

### Reliability evals

Measure runtime stability over long traces:

- completion rate over 20+ step tasks
- median retries per successful task
- rollback frequency
- percent of runs requiring human intervention

These answer: *Will it keep working next week, not just today*

## Common failure modes worth designing against

If you only instrument final success/failure, you will miss the warning signs. Capture near-miss telemetry.

Watch for:

- **Tool hallucination:** calling non-existent endpoints or wrong argument shapes
- **Planner drift:** objective mutates mid-run without explicit re-plan
- **Memory poisoning:** low-quality reflections promoted into durable memory
- **Retry storms:** same failing call repeated with trivial prompt variations
- **False closure:** model declares success without external verification

Most of these can be caught by enforcing step-level exit criteria and requiring external state checks before task completion.

## Bottom line

Agent quality is increasingly a systems engineering problem, not just a prompting problem. The winning architecture is model-plus-control-plane: structured plans, gated tools, hierarchical memory, and evals tied to policy and runtime behavior. If you build those layers first, model upgrades become safer and more useful instead of chaotic.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- [SWE-bench GitHub Repository](https://github.com/SWE-bench/SWE-bench)
- [Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)
