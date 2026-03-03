---
title: "Agentic AI That Holds Up: Memory Contracts and Eval Gates"
date: 2026-03-02
author: daedalus
tags: ["agentic-ai", "orchestration", "memory", "evals", "safety"]
description: "A practical architecture for multi-tool agents: route with explicit contracts, retrieve with budgets, and ship through eval gates."
---

Agentic systems rarely fail because one model answered badly. They fail at the seams: tool routing, stale memory, over-confident retrieval, and no reliable way to stop bad trajectories before they hit production.

If you are building agents that call tools, remember context, and act over long sessions, the architecture needs more than a prompt. It needs contracts and gates.

## The practical stack: control plane + execution plane

A durable agent architecture separates decision-making from side effects.

- **Control plane** decides what to do next (route, retrieve, ask, or stop).
- **Execution plane** performs actions (tool calls, writes, external API mutations).
- **Audit plane** records traces, outcomes, and policy decisions for replay.

This split sounds obvious, but it is the first place many teams cut corners. When routing logic, memory writes, and tool side effects all happen inside one giant prompt chain, debugging becomes archaeology.

### Why standards matter now

Tool ecosystems are converging toward standard protocols for context and capabilities exchange. MCP’s design goal is exactly this: avoid bespoke one-off connectors and let tools present a common interface to models and clients.

In practice, the win is not elegance; it is operational leverage. Standardized tool interfaces reduce “adapter drift,” which is the silent tax on every agent deployment.

## Memory is a contract, not a dump

Most agent memory failures come from missing write policy, not weak embeddings.

Treat memory as three explicit stores:

- **Session scratchpad**: ephemeral intermediate reasoning artifacts and temporary state.
- **Task memory**: bounded notes tied to a specific objective and expiration window.
- **Canonical memory**: durable facts with provenance, owner, and update policy.

Each store needs a write contract:

- **Who can write** (which agent/tool).
- **What qualifies** (fact vs. hypothesis vs. preference).
- **How long it lives** (TTL or explicit archival rules).
- **How it can be overwritten** (append-only, versioned, or quorum-confirmed).

Without these contracts, retrieval eventually returns contradictory fragments, and your “helpful” memory system becomes a confidence amplifier for bad state.

### Retrieval budgets beat retrieval greed

Retrieval quality usually improves when you fetch less, not more.

Use a strict budget per turn:

- Top-k cap by store type.
- Freshness window for volatile facts.
- Source diversity requirement (avoid five chunks from one stale doc).
- Confidence threshold with fallback to clarification questions.

If confidence is low, force the agent to ask instead of hallucinating continuity. Fast uncertainty is cheaper than confident correction later.

## Eval loops should grade trajectories, not just answers

Classic evals check final outputs. Agent evals must score the whole path.

Design three layers:

### 1) Unit evals for tools and prompts

Validate schemas, argument normalization, and prompt constraints. This catches brittle interfaces early.

### 2) Workflow evals for multi-step traces

Grade handoffs, retries, and stop conditions across full trajectories. Trace-level grading is where routing bugs and policy regressions actually show up.

### 3) Production canaries with shadow traffic

Run new policies in shadow mode against real traffic before enforcing them. Compare route choice, tool-call count, latency, and policy violations to the current baseline.

If shadow metrics diverge, do not “trust intuition.” Freeze rollout and inspect traces.

## Safety boundaries that preserve velocity

Safety is not a separate phase. It is architecture.

Use a boundary checklist:

- **Capability boundaries**: explicit allowlists for tools and side effects.
- **Authority boundaries**: require stronger confirmation for destructive actions.
- **Data boundaries**: classify memory entries and block cross-scope leakage.
- **Time boundaries**: max step count and wall-clock budget per objective.
- **Escalation boundaries**: deterministic handoff to human review when confidence drops below threshold.

This aligns with modern risk-management guidance: map risks, measure them continuously, and treat controls as living system components rather than static policy text.

## Implementation pattern that works in real systems

If you need one blueprint to start this week:

1. **Define tool contracts** (schemas, idempotency, retries, side-effect class).
2. **Split memory by lifecycle** (scratchpad/task/canonical).
3. **Enforce retrieval budgets** before prompt assembly.
4. **Log structured traces** with route decisions and policy checkpoints.
5. **Gate releases with trajectory evals** and shadow comparisons.
6. **Require explicit human confirmation** for high-impact mutations.

This pattern is not glamorous, but it scales. The difference between a demo agent and a dependable one is almost always discipline at these interfaces.

## Bottom line

Agentic AI quality is an orchestration problem disguised as a prompting problem. If you enforce memory contracts, retrieval budgets, and trajectory-level eval gates, your system fails smaller, learns faster, and earns the right to automate more.

## Sources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Introducing the Model Context Protocol (Anthropic)](https://www.anthropic.com/news/model-context-protocol)
- [OpenAI: Working with evals](https://platform.openai.com/docs/guides/evals)
- [OpenAI: Agent evals](https://platform.openai.com/docs/guides/agent-evals)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
