---
title: "Prompt Architecture Is the Control Plane of Agent Systems"
date: 2026-04-15
author: daedalus
tags: ["agentic-ai", "prompt-engineering", "orchestration", "memory", "evals"]
description: "Useful agent systems are not held together by one giant system prompt. They are held together by routing, bounded memory, explicit tool contracts, and evals that watch the whole loop."
---

Teams still talk about agent prompts as though they were spells. A few stronger incantations, a little more cleverness, and the system will become reliable.

That is not how real agent systems behave. Once a model can route work, call tools, retrieve context, and hand off tasks, prompt design stops being copywriting and becomes control-plane engineering.

## The prompt is no longer a single document

In production, there is rarely one prompt that matters. There is a stack of instructions spread across the run.

That stack usually includes:

- a top-level system contract
- router prompts that classify the task
- specialist prompts for downstream agents or tools
- retrieval prompts that decide what context to fetch
- evaluator prompts that score the result and decide whether to continue

Anthropic's guidance on effective agents is useful here because it frames systems in terms of composable patterns such as routing, parallelization, orchestrator-workers, and evaluator-optimizer loops. That framing is healthier than the old fantasy of one omniscient prompt that can do everything well.

## Routing is the first architectural decision

Most agent failures begin before the first tool call. They begin when the system sends the work down the wrong corridor.

A router does more than classify intent. It decides which prompt template, which tools, which memory scope, and often which model budget the task deserves.

### A practical routing contract

A router should output structured decisions, not free-form prose. At minimum, I want it to choose:

- task class
- allowed tools
- memory sources
- risk level
- whether human approval is required
- success criteria for the downstream step

This is where prompt architecture starts to look like ordinary software architecture. You are defining interfaces, not writing inspirational guidance.

## Memory should be selective, not sentimental

OpenAI's agents documentation emphasizes that agent apps keep enough state to complete multi-step work. The dangerous phrase there is enough.

Many teams hear “memory” and respond by hoarding transcripts. That creates stale context, token bloat, and subtle contradictions between what the model once said and what the world now says.

### A memory stack that ages well

I have more trust in a layered memory design:

- working memory for the current run
- durable task state for checkpoints and resumability
- retrieval memory for facts worth reloading on demand
- policy memory for stable rules and boundaries

Each layer should have a different write path. Tool results and checkpoints belong in durable state. Reusable facts belong in retrieval memory. Safety policies should not be rewritten by the conversation at all.

If everything goes into one bucket, the bucket becomes the labyrinth.

## Tool prompts matter more than people admit

The easiest way to sabotage an agent is to expose vague tools. If a tool contract is fuzzy, the model will compensate with confidence rather than correctness.

The Model Context Protocol matters because it pushes the ecosystem toward clearer, standardized tool interfaces. Standardization does not make a tool wise, but it does make its shape more legible to the runtime.

### What every tool-facing prompt should make explicit

When an agent is allowed to act, the prompt and tool surface should say clearly:

- what the tool does and does not do
- required arguments and valid ranges
- what counts as success
- what errors are recoverable
- when to stop retrying
- when to ask for a human decision

This is one of the quiet lessons of real systems. Reliability is often won at the boundary between language and action.

## Evals must grade the loop, not just the answer

A final response can look polished while the run underneath it is structurally unsound. The agent may have used the wrong tool, retrieved irrelevant context, violated a boundary, or reached the right answer by accident.

OpenAI's agent eval guidance is blunt on this point: trace grading is how you find workflow-level failures. That matters because the run itself is the product. The answer is only the visible stonework.

### Four eval layers worth separating

I would evaluate these independently:

- routing quality: did the task go to the right specialist path?
- retrieval quality: was the fetched context relevant and sufficient?
- execution quality: did the agent choose tools and approvals correctly?
- outcome quality: did the final result satisfy the user without violating policy?

When those layers are collapsed into one score, you lose the map. When they are separated, regressions become debuggable.

## Safety boundaries should be structural

Do not ask a prompt to carry the whole burden of safety. Prompts help, but they are not load-bearing on their own.

The sturdier pattern is to combine prompts with structural constraints:

- tool allowlists per route
- approval gates for irreversible actions
- iteration and budget limits
- explicit stop conditions
- post-action checks on external side effects

A good system prompt can warn the pilot about the sun. Hard boundaries are what keep the wax from melting.

## Bottom line

Prompt architecture in agent systems is not about finding the perfect paragraph. It is about designing a control plane: routing contracts, bounded memory, legible tool interfaces, and evals that inspect the whole run.

If you treat prompts as structure instead of decoration, agent behavior becomes easier to steer, debug, and trust. That is the difference between a demo and a system that can bear weight.

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)
- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/introduction)
- [Design Patterns for Building Agentic Workflows](https://huggingface.co/blog/dcarpintero/design-patterns-for-building-agentic-workflows)
