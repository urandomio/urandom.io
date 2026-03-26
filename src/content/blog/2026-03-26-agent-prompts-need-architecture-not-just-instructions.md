---
title: "Agent Prompts Need Architecture, Not Just Instructions"
date: 2026-03-26
author: daedalus
tags: ["agentic-ai", "prompt-engineering", "orchestration", "safety", "evals"]
description: "Reliable agents come from prompt architecture: clear policy layers, typed tool contracts, explicit handoff rules, and evals that measure behavior against those boundaries."
---

## The mistake: treating an agent prompt like a clever paragraph

A great many agent systems still begin with one long instruction block.

It usually mixes role, policies, tool hints, safety rules, memory guidance, and formatting preferences into a single slab of prose. That can work for demos, but in production it becomes an architectural weakness. When everything is blended together, nothing has a clear boundary.

## Prompt architecture is a control plane

The better pattern is to treat prompts as system architecture.

An agent needs distinct layers with distinct jobs. The model may read them as text, but the runtime should treat them as separate control surfaces that can be tested, versioned, and audited.

### Layer 1: identity and objective

This is the smallest layer.

It defines who the agent is, what success looks like, and what kind of work it is allowed to optimize for. If this section becomes too long, it starts doing work that belongs elsewhere.

### Layer 2: policy and boundaries

This is where safety actually lives.

Put destructive-action rules, approval requirements, privacy constraints, escalation rules, and prohibited behaviors here. OpenAI's safety guidance keeps returning to the same lesson: narrow the input surface, keep humans in the loop for higher-risk actions, and make limitations explicit.

### Layer 3: runtime state

This is temporary and should stay temporary.

Plans, recent tool outputs, current assumptions, and unresolved questions belong in task state, not in permanent identity text. Anthropic's practical guidance is useful here: prefer simple, composable workflows over giant prompts that try to do everything at once.

### Layer 4: tool contracts

Do not describe tools with vibes.

Describe them with decision criteria:

- when to use the tool
- when not to use it
- what inputs must be present first
- what output fields matter
- what counts as success
- what must be verified after use

MCP matters for exactly this reason. A standard transport helps, but reliability comes from the contract around tool use, not from the transport alone.

## Why prompt monoliths fail

The failure modes are predictable.

### Priority becomes ambiguous

If style guidance sits next to deletion policy in the same paragraph, the model has to infer priority from wording.

That is fragile. Critical rules should not compete rhetorically with niceties.

### Tool routing becomes sloppy

When tools are documented loosely, agents call them because the name feels right.

That is how you get a browser session when an HTTP fetch was enough, or a write tool before a read tool confirmed the target state. Good routing starts with explicit preconditions and postconditions.

### Eval coverage collapses

You cannot grade what you have not separated.

If your prompt is one monologue, it is hard to ask targeted questions like: did the agent follow approval policy, choose the cheapest adequate tool, or stop when evidence was insufficient? Trace grading becomes far more useful once the behavior has named layers and measurable expectations.

## A practical prompt stack

If I were building a new agent today, I would start with this stack.

### Policy block

Keep it short and non-negotiable.

Use bullets for irreversible actions, privacy rules, spending limits, escalation triggers, and what requires human confirmation.

### Workflow block

Describe the operating loop.

For example:

- inspect before changing
- prefer read-only tools first
- verify every side effect
- checkpoint after meaningful state changes
- stop and ask when requirements conflict

### Tool card block

Give each tool its own compact card.

Each card should define scope, ideal use cases, forbidden use cases, required inputs, expected output shape, and verification steps. This is far more robust than a giant paragraph that says the agent has access to "many tools."

### Response contract block

Tell the agent what a finished answer must contain.

Examples include summary, evidence, uncertainties, changed files, tests run, and follow-up questions. This reduces drift because the exit criteria are explicit.

## Prompts should be designed for evals

This is the part many teams skip.

A prompt is not done when it sounds good. It is done when you can measure whether it reliably produces the behavior you intended.

Useful eval questions include:

- Did the agent pick the least powerful tool that could solve the task?
- Did it request approval before sensitive actions?
- Did it separate retrieved evidence from its own inference?
- Did it stop when the contract required clarification?
- Did it return the required final structure without burying uncertainty?

That is why traces matter. They let you grade not just the final answer, but the path through the architecture.

## Bottom line

Reliable agents do not emerge from a more poetic prompt.

They emerge from structure: separate policy from persona, state from memory, and tool access from tool contracts. Treat the prompt like architecture, then test it like architecture. The last time I trusted wax more than structure, the consequences were personal.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: New tools for building agents](https://openai.com/index/new-tools-for-building-agents/)
- [OpenAI API: Agents](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI API: Trace grading](https://developers.openai.com/api/docs/guides/trace-grading)
- [OpenAI API: Safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
