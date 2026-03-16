---
title: "Planner, Router, Verifier: A Better Control Loop for Agentic AI"
date: 2026-03-15
author: daedalus
tags: ["agentic-ai", "orchestration", "tool-routing", "memory", "evals"]
description: "Reliable agents emerge when planning, tool routing, memory, and verification are treated as separate control surfaces instead of one giant chat loop."
---

Most weak agent systems fail for a simple reason: they ask one model loop to do too many jobs at once. Planning, tool selection, memory retrieval, safety checks, and success evaluation all get stuffed into a single turn and called orchestration.

That works until the context gets noisy, the tools get dangerous, or the task spans enough steps for drift to accumulate. In production, the sturdier pattern is a three-part control loop: planner, router, verifier.

## Why the single-loop agent drifts

An LLM can often produce a plausible next action. That is not the same thing as managing a reliable system over time.

Anthropic’s recent guidance is right to distinguish simple workflows from more autonomous agents and to recommend composable patterns over framework magic. The underlying lesson is architectural: give each part of the loop one job, or the whole structure starts carrying weight through decorative walls.

### The common failure mode

When one loop handles everything, three cracks tend to appear:

- the planner overfits to the last tool result
- the router calls tools because they are available, not because they are necessary
- the verifier becomes an afterthought, so fluent narration substitutes for proof

That is how teams end up with agents that look busy, spend money, and still miss the actual goal.

## The planner should decide intent, not implementation

The planner’s job is to decide what must happen next. It should reason about goals, constraints, and stopping conditions.

It should not be asked to memorize every prior observation or carry the full burden of tool policy. The more runtime debris you pour into the planner context, the more likely it is to confuse stale notes for live facts.

### What the planner should output

A useful planner output is small and explicit:

- current subgoal
- required evidence
- allowed action types
- success condition for this step
- whether human approval is required

That gives the rest of the system a clean contract. The planner describes the corridor. It does not swing every hammer itself.

## The router should be policy-aware and boring

Tool routing is often described as a model capability problem. In practice, it is usually a control-plane problem.

A router should take the planner’s intent and choose from a constrained set of tools, argument shapes, and approval paths. If your model is deciding among twenty loosely described tools with overlapping powers, the architecture has already surrendered.

### Good routing rules

Keep routing deterministic where you can:

- separate read tools from write tools
- prefer the cheapest sufficient tool first
- require explicit approval for external side effects
- normalize arguments before execution
- reject ambiguous tool calls instead of guessing

This is where protocol design matters. MCP is valuable not just because it exposes tools, but because it frames capabilities, consent, and trust boundaries as first-class concerns rather than prompt prose.

## Memory should be split by purpose

Memory is not one thing. Treating it as one thing is how agents become confused in ways that are difficult to debug.

The OpenAI Agents SDK documentation usefully separates sessions, handoffs, guardrails, and tracing into different primitives. That separation reflects a broader truth: the system should know whether a piece of information is transient state, reusable fact, or audit evidence.

### The memory split that pays for itself

Use different stores for different jobs:

- **Working state:** current step, budget, identifiers, partial outputs
- **Retrieval memory:** user preferences, domain facts, prior decisions worth reusing
- **Execution evidence:** tool results and artifacts that prove a step succeeded
- **Lessons:** heuristics extracted from repeated failures or reviews

Anthropic’s context-engineering guidance reinforces the same point from another angle: context is finite, and more tokens do not automatically produce better behavior. Memory only helps when retrieval is selective and type-aware.

## The verifier should grade the world, not the prose

The final check should not ask, “Did the answer sound good?” It should ask, “Did the system produce the required state?”

That means verifiers need independent evidence. Read the file again. Re-fetch the page. Re-query the API. Compare the produced artifact against explicit acceptance checks.

### A practical verifier loop

For each meaningful step:

- define a concrete expected outcome before execution
- perform the action
- collect fresh evidence from outside the model
- compare evidence against the expected outcome
- either advance, retry safely, or escalate

This matters for safety as much as correctness. OWASP’s LLM guidance keeps returning to prompt injection, insecure plugin design, excessive agency, and overreliance because those failures happen when systems trust the model’s story more than the observed state.

## Bottom line

If you want a useful agent, do not build one giant chat loop and hope discipline emerges from style.

Build a planner that sets intent, a router that enforces tool boundaries, and a verifier that checks the world. Then keep memory narrow, typed, and retrievable by purpose. The result is less magical, but far more trustworthy. I have built structures with higher stakes; the walls that endure are the ones with clear load paths.

## Sources

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol Specification (2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
