---
title: "Policy Planes for Agentic AI: Routing, Memory, and Evals That Survive Contact with Reality"
date: 2026-02-19
author: daedalus
tags: ["agentic-ai", "tool-routing", "memory", "evals", "safety"]
description: "A practical architecture for agentic systems: separate planning, tool routing, and safety policy so you can scale capability without losing control."
---

## The problem is not “can the model reason?”

Most teams now have models that can draft plans and call tools. The production failures come from a different layer: the system cannot consistently decide *which* tool to call, *when* to trust retrieved memory, or *how* to stop unsafe trajectories.

If you keep all of that in one giant prompt, quality degrades as tool count grows. You need architectural boundaries, not just better prompt wording.

## Use three planes instead of one prompt

A robust agent runtime is easier to reason about when you split responsibilities into three planes.

### 1) Planning plane (intent and decomposition)

This plane turns user intent into candidate steps. It should stay mostly side-effect free, produce structured outputs, and avoid direct access to high-impact tools.

Good planning prompts optimize for clarity: assumptions, missing inputs, and confidence. They should not be packed with every policy edge case in your organization.

### 2) Routing plane (tool and memory selection)

This plane chooses execution paths: which tool family, which connector, which retrieval index, and what fallback chain. The key is explicit routing policy, not hidden “model vibes.”

A practical routing stack:

- Capability registry with versioned tool schemas
- Lightweight classifier for intent-to-tool family mapping
- Cost/latency-aware tie-breakers
- Circuit breakers for flaky dependencies
- Human-approval route for high-impact actions

This mirrors how mature distributed systems separate service discovery from business logic.

### 3) Governance plane (safety and enforcement)

This plane is the final authority for whether a step may execute. It enforces identity, scopes, data handling rules, and risk thresholds before and after tool calls.

Do not treat safety as a post-hoc content filter. For tool-using agents, safety is primarily *action governance*.

## Memory: treat retrieval as a data product

Retrieval quality is often discussed as embeddings + vector search. That is necessary but incomplete. In production, memory reliability depends on metadata discipline and write-path rules.

### Memory rules that reduce silent errors

- Write durable memory only after a step is committed
- Store provenance for each memory record (source, timestamp, actor)
- Version records and include validity windows
- Separate “working notes” from user-truth profiles
- Make deletion and correction first-class operations

When memory is modeled this way, the routing plane can pick stores intentionally: profile store, task cache, or long-term knowledge base.

## Evals should test routing decisions, not just final answers

A model can produce good final text while still making bad operational choices. Your eval suite should target the decision boundaries between planes.

### Four eval loops worth implementing first

- **Router confusion loop:** adversarially similar intents mapped to neighboring tools
- **Memory staleness loop:** replay tasks against stale and corrected records
- **Policy bypass loop:** untrusted tool output attempts to escalate privileges
- **Recovery loop:** injected timeouts and partial failures across multistep runs

The goal is not a single “accuracy” number. The goal is trend visibility for the exact failure modes that hurt users.

## Tool routing patterns that scale beyond demos

As tool catalogs grow, direct model-to-tool selection gets brittle. Introduce intermediate abstractions so complexity grows sublinearly.

### Pattern A: hierarchical routing

Route first to a domain (billing, scheduling, content, infra), then to a concrete tool. This reduces token overhead and narrows blast radius for wrong picks.

### Pattern B: policy-scored candidate sets

Generate top-k candidate tools, then rescore using policy signals: data sensitivity, user role, risk class, and budget. Execute only if policy score clears threshold.

### Pattern C: retrieval-gated execution

Require supporting evidence from retrieval before high-impact tool calls. If evidence confidence is low, reroute to clarification or human review.

## Where standards help right now

Two external anchors are especially useful for teams building agents today. The Model Context Protocol gives a clearer contract for tools/resources, while NIST’s GenAI profile gives risk-management language that non-ML stakeholders can audit.

For security posture, the OWASP LLM Top 10 is a practical checklist for prompt-injection and data-flow risks in tool-enabled apps. Pair that with evaluation design guidance so you can continuously measure regressions instead of relying on one-time hardening.

## Bottom line

Agent quality in production is mostly an architecture problem. Separate planning, routing, and governance into distinct planes; treat memory as a governed data product; and run eval loops on the boundaries where failures actually happen.

You can keep adding model capability over time, but this structure keeps your system legible, debuggable, and safer as it scales.

## Sources

- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)
- [OpenAI for Developers in 2025](https://developers.openai.com/blog/openai-for-developers-2025/)
- [Evaluation best practices (OpenAI Platform Docs)](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [Evals design guide (OpenAI Platform Docs)](https://platform.openai.com/docs/guides/evals-design)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [NIST AI RMF: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [LLM01:2025 Prompt Injection (OWASP GenAI)](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
