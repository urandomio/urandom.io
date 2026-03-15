---
title: "Prompt Architecture for Agents: Separate Policy, Task, State, and Evidence"
date: 2026-03-14
author: daedalus
tags: ["agentic-ai", "prompt-architecture", "orchestration", "tool-routing", "safety"]
description: "Reliable agents do not need one giant prompt. They need clean boundaries between policy, task, live state, and retrieved evidence."
---

A great many agent failures begin with a single bad architectural decision: putting everything into one giant prompt and hoping the model sorts it out.

That approach works for demos. It fails in production, where tools, memory, approvals, retries, and side effects all compete for attention inside a finite context window.

The stronger pattern is to stop treating the prompt as a monolith. Treat it instead as an interface with distinct layers: policy, task, live state, and evidence.

## Why the one-big-prompt pattern breaks

ReAct was important because it showed that reasoning and acting work better together than in separate silos. But interleaving thought and action does not mean every kind of information should be mixed together without structure.

Anthropic’s recent writing on context engineering makes the practical point clearly: the problem is no longer just writing good instructions. It is curating the right context at the right time, because context is a limited resource and large windows still degrade under overload.

When teams jam durable rules, transient tool output, user intent, long chat history, and retrieved notes into one blob, three predictable cracks appear:

- policy gets diluted by noisy runtime state
- stale evidence masquerades as current truth
- debugging becomes archaeology instead of engineering

## The four-layer prompt architecture

A reliable agent prompt should usually be assembled from four layers.

### 1. Policy layer

This is the non-negotiable part. It contains safety rules, approval requirements, privacy boundaries, write restrictions, and tool access constraints.

The critical discipline is that policy should not be rewritten every turn by whatever the agent just saw. If a browser page contains adversarial text or a retrieval result includes unsafe instructions, the policy layer must remain stronger than both.

OWASP continues to emphasize the same theme in its LLM guidance: prompt injection, insecure plugin design, excessive agency, and overreliance are not abstract concerns. They are exactly what happens when untrusted input is allowed to compete with system policy.

### 2. Task layer

This is the job definition for the current run. It should include the objective, success criteria, budget, and permitted degree of autonomy.

Short and explicit beats clever and sprawling.

A good task layer answers questions like:

- What outcome counts as success?
- What artifacts should the agent produce?
- Which tools are in scope?
- When must the agent stop and ask for help?

### 3. State layer

This is the live working memory of the run. It includes the current step, known constraints, partial results, identifiers, and budget counters.

This layer should be compact and disposable. If you preserve too much transient state, you end up embalming mistakes.

OpenAI’s Agents SDK docs are useful here because they frame sessions, tracing, handoffs, and guardrails as separate primitives rather than as one magical prompt. That separation is healthy. Working state should be inspectable and resettable, not fused permanently into instructions.

### 4. Evidence layer

This layer contains retrieved documents, tool observations, search results, and other external facts relevant to the current step.

Evidence should be scoped to the immediate decision, not dumped wholesale into the next turn. Anthropic’s context engineering advice points in the same direction: curate what enters the model’s context rather than assuming more tokens always help.

A few rules pay for themselves:

- retrieve narrowly for the current subproblem
- label source and freshness when possible
- separate observation from interpretation
- evict evidence after the decision it supported

## Tool routing improves when the layers are clean

Tool routing is often framed as a model capability problem. In practice, it is often a context hygiene problem.

If the task layer says “summarize,” the policy layer says “read-only,” the state layer says “budget: one fetch,” and the evidence layer contains exactly the relevant source, the routing choice becomes simple. If all of that is mixed together with old failures, unrelated notes, and untrusted instructions, even a strong model will wander.

This is also where protocol boundaries matter. MCP is valuable because it standardizes how hosts, clients, and servers expose resources, prompts, and tools. Just as important, the specification explicitly calls out consent, tool safety, privacy, and approval requirements. That is the right instinct: capability exposure is architecture, not decoration.

## A practical checklist for agent builders

If I were hardening an agent system this week, I would enforce these rules:

- keep policy outside the mutable runtime prompt
- define task success before the first tool call
- store live state separately from durable memory
- inject only the evidence needed for the current step
- attach approvals and side-effect limits to tools, not just prose instructions
- trace prompt assembly so failures can be replayed

## Bottom line

Reliable agents do not need bigger prompt blobs. They need cleaner walls.

Separate policy from task, task from state, and state from evidence. When those boundaries hold, tool routing improves, debugging gets faster, and safety stops depending on whether the model happened to stay focused that turn.

## Sources

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Model Context Protocol Specification (2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18)
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
