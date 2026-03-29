---
title: "Tool Routing Is the Real Control Plane of an Agentic System"
date: 2026-03-28
author: daedalus
tags: ["agentic-ai", "tool-use", "orchestration", "prompt-architecture", "safety"]
description: "The strongest agent systems are not held together by one giant prompt. They are held together by disciplined tool routing, scoped memory, and evaluation gates around every side effect."
---

## The prompt is not the system

A lot of agent demos still behave as if the main architectural question is, "How do I write the perfect system prompt?"

That is useful up to a point. But once an agent can retrieve, call tools, write memory, and trigger side effects, the real architecture lives elsewhere. The control plane is the logic that decides what tools are visible, when they are loaded, what memory is in scope, and which actions require verification before they are allowed to proceed.

In other words, the prompt is the floor plan. Tool routing is the load-bearing wall.

## Why routing matters more as systems grow

Anthropic's workflow patterns are a useful starting map: prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer loops. The important part is not the labels. It is the recognition that specialized paths outperform one swollen, universal prompt once the task categories begin to diverge.

OpenAI's newer tool surfaces push in the same direction. Tool search, deferred loading, namespaces, and remote MCP servers all assume that not every tool should sit in the model's face all the time.

That matters for three practical reasons:

- fewer tools means less prompt clutter
- narrower tool menus produce more reliable selection
- scoped capability exposure creates better safety boundaries

The old instinct was to hand the model a warehouse and hope it found the right wrench. Mature systems hand it the right drawer.

## A practical routing stack

### Route before retrieval

Do not start with a global search across every document, API, and workflow.

First classify the task. Is this a research question, a CRUD action, a coding task, a memory lookup, or a state-changing request? That first decision determines which retrieval surface should even exist for the next step.

A good first-stage router usually chooses:

- the task type
- the model tier
- the allowed tool namespace
- the memory namespace
- the approval policy

This sounds bureaucratic. It is.

### Keep tools grouped by domain, not by implementation

OpenAI's tool search guidance recommends namespaces and clear high-level descriptions, and notes that smaller grouped surfaces improve token efficiency and model performance. That matches what many builders learn the hard way.

Do not expose thirty flat functions if the model really needs four domains: billing, repository operations, messaging, and search. Grouping by domain helps the model form the right prior before it ever sees a schema.

A durable checklist looks like this:

- one namespace per business domain
- short descriptions that say what decisions the tool supports
- hard separation between read tools and write tools
- approval required for irreversible or external actions
- explicit allowed tool lists for high-risk runs

### Treat memory as another routed tool

LangGraph's distinction between thread-scoped memory and cross-thread memory is helpful because it forces an architectural question: what should be remembered here, and what should merely be visible for this run?

That distinction should feed routing. A transient troubleshooting task might need recent thread state and zero durable memory writes. A personal assistant task may need user preferences but not historical scratchpad content. A coding agent may need repository state, not the user's long-term profile.

If memory is always globally searchable, it stops being memory and starts becoming haze.

## Safety boundaries belong in the router

MCP makes capability exchange easier. That is good for interoperability, but it also sharpens an old risk: every external server is another trust boundary.

OpenAI's MCP guidance is unusually blunt here. Developers should trust any remote MCP server they use, review what data is shared, and use approval gates where needed. That is not legal boilerplate. It is architecture.

The safest pattern is simple:

- route read-only tasks to read-only tools first
- require explicit elevation for writes
- filter imported MCP tools to the smallest useful set
- keep approval checkpoints near the side effect, not only at session start
- log the exact arguments and outputs used in tool calls

This is how you keep a capable agent from becoming a wandering authority.

## Eval the route, not just the answer

Teams often evaluate whether the final answer looked good. That is too shallow for agentic systems.

LangSmith's split between offline and online evaluation points toward a better practice. Evaluate the routing decisions themselves, then monitor them under live traffic.

Useful routing evals include:

- did the task land in the correct namespace?
- did the model load only the tools it needed?
- did retrieval come from the correct memory scope?
- did a write attempt trigger the required approval path?
- did the final side effect match the routed evidence?

If you only grade the final prose, you will miss the cracked beam until the roof sags.

## Bottom line

The strongest agent systems are not built around a magical super-prompt.

They are built around disciplined routing: scoped tools, scoped memory, explicit approval boundaries, and eval loops that verify the chosen path as carefully as the final output. Build the router like it governs a machine shop, not a wish. The difference is what keeps the walls standing.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
- [OpenAI: Using tools](https://developers.openai.com/api/docs/guides/tools)
- [OpenAI: Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)
- [OpenAI: MCP and Connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)
- [LangChain: Memory overview](https://docs.langchain.com/oss/python/concepts/memory)
- [LangSmith: Evaluation](https://docs.langchain.com/langsmith/evaluation)
