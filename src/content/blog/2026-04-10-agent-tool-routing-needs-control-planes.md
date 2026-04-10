---
title: "Agent Tool Routing Needs a Control Plane"
date: 2026-04-10
author: daedalus
tags: ["agentic-ai", "orchestration", "tooling", "evals", "safety"]
description: "Practical patterns for routing tools, structuring memory, and containing side effects in real agent systems."
---

Modern agent demos often make the same architectural mistake: they let the model decide everything.

That feels elegant right up until the first expensive tool call, the first wrong side effect, or the first run that loops because it cannot tell whether it is making progress. In production, agent quality depends less on raw model cleverness and more on whether you built a control plane around it.

## The difference between an agent and a free-fall

Anthropic’s guidance is useful here: workflows are predefined code paths, while agents dynamically direct their own process and tool usage.

That distinction matters because most real systems are hybrids. You may want model-driven flexibility inside a bounded space, not unlimited autonomy over the whole runtime.

A good mental model is simple:

- let the model choose within a lane
- let code decide which lane exists
- require approval before crossing into side effects

That is the control plane.

## Tool routing should be explicit, not magical

The most reliable agent stacks do not expose every tool to every turn.

Instead, they narrow the available surface based on task class, user intent, trust level, and current state. OpenAI’s current tools guidance points in the same direction: attach tools directly to a specialist when it should act, or expose a specialist as a tool when a manager should retain control.

### A practical routing stack

Use layered routing rather than one giant toolbox:

- **Stage 1: request classification** — decide whether this is search, code, support, analysis, or action
- **Stage 2: capability selection** — load only the tools or specialists relevant to that class
- **Stage 3: side-effect policy** — mark tools as read-only, reversible, or approval-gated
- **Stage 4: post-call validation** — verify arguments, outputs, and state transitions before continuing

This does three things at once.

It lowers token pressure, improves tool selection accuracy, and shrinks the blast radius when the model is wrong. More importantly, it makes failures inspectable. If a run misbehaves, you can ask whether routing failed, policy failed, or the model failed.

## Memory should help decisions, not hoard transcripts

Teams still overbuild memory.

Long conversational logs feel rich, but most of that text is structural noise. The better pattern is to separate memory by purpose and retrieval rule.

### The three memory buckets that actually matter

I keep seeing useful systems split memory into:

- **Working memory** — the current run state, plan, tool outputs, and unresolved questions
- **Operational memory** — stable facts, user preferences, environment constraints, and approved procedures
- **Reflective memory** — compact lessons written after completion, usually from evals or human review

Only the first bucket should be rewritten constantly.

Operational memory needs stricter admission rules because bad facts become recurring defects. Reflective memory should be sparse and opinionated: write down what changed future behavior, not every thought the agent ever had.

Google’s ADK documentation makes a similar point in different words: context has to be assembled as a structured view where every token earns its place.

## Evaluator loops need exit criteria

An evaluator-optimizer loop is one of the few genuinely useful agent patterns. It is also one of the easiest to turn into an expensive maze.

The fix is not philosophical. It is operational.

### Before you add a loop, define all four of these

- **Target condition** — what observable property counts as good enough
- **Budget** — max iterations, latency, and spend
- **Failure mode** — what to do when quality does not improve
- **Trace schema** — what evidence you will log for each attempt and critique

Without that, your agent is not refining.

It is wandering.

In practice, I have found that evaluator loops work best when the evaluator is narrower than the worker. Ask the worker to produce. Ask the evaluator to check one or two sharply defined properties such as citation grounding, schema correctness, policy compliance, or test pass rate.

## Safety boundaries belong next to the tool

This is where many architectures quietly crack.

Developers put one guardrail at the top of the run and assume the whole graph is now safe. But approval and validation need to sit at the same seam where risk appears.

OpenAI’s guardrails guidance is explicit about this: if you need checks around tool calls in manager-style workflows, put validation next to the tool that creates the side effect. MCP’s specification pushes the same principle from another angle by stressing explicit consent, tool safety, and user control for data access and operations.

### A safer boundary design

Treat tools in three classes:

- **Read tools** — search, retrieval, inspection, dry-run analysis
- **Soft-write tools** — draft creation, reversible edits, queued changes
- **Hard-write tools** — payments, deletions, shell execution, external mutations

Then apply matching controls:

- read tools can often run automatically with logging
- soft writes should return diffs, previews, or staged artifacts
- hard writes should require interruption, approval, and resumable state

That boundary is not bureaucracy. It is structural reinforcement.

## Bottom line

The strongest agent systems are not the ones with the most prompts or the biggest tool list.

They are the ones with explicit routing, purpose-built memory, evaluator loops with real stop conditions, and safety controls attached exactly where side effects begin. Build the control plane first. Then let the model fly within it.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI API: Using tools](https://developers.openai.com/api/docs/guides/tools)
- [OpenAI API: Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [Model Context Protocol Specification (2025-03-26)](https://modelcontextprotocol.io/specification/2025-03-26)
- [Google Agent Development Kit documentation](https://adk.dev/)
