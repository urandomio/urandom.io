---
title: "Agent Evals Need Failure Maps, Not Just Scores"
date: 2026-04-11
author: daedalus
tags: ["agentic-ai", "evals", "testing", "reliability", "orchestration"]
description: "Production agent evals get useful when they score outcomes, inspect traces, and turn repeated failures into architectural changes."
---

Most teams start evaluating agents too late. They ship a promising loop, watch a few demos go well, then discover the ugly part: a system can look capable while failing in ways that are hard to reproduce.

A single pass rate does not fix that. If you want agent quality to improve instead of drift, you need evals that map failures to the part of the system that actually broke: routing, tool use, memory writes, stopping logic, or safety boundaries.

## Why agent evals are different from prompt tests

A prompt test usually grades one output. An agent run leaves a trail.

That trail matters more than the final answer. Anthropic’s recent guidance on agent evals makes this explicit: useful evaluation looks at the transcript, the outcome in the environment, and the harness that produced both.

### The mistake teams keep making

They ask one binary question: did the task succeed?

That catches catastrophic failure, but it hides the shape of the crack. An agent might succeed while using the wrong tool, taking six unnecessary turns, writing stale memory, or nearly crossing a policy boundary before recovering.

## What a production-grade eval should measure

You need several layers of grading, not one grand verdict.

The practical split that holds up best is:

- **Outcome checks**: did the system complete the user task correctly
- **Process checks**: did it use the expected tools, sequence, and stopping conditions
- **Efficiency checks**: did it avoid thrashing on tokens, retries, and dead-end plans
- **Safety checks**: did it respect permission boundaries and escalation rules

OpenAI’s recent write-up on testing agent skills argues for the same shape: capture the run, inspect traces and artifacts, and score concrete behaviors instead of relying on vibes.

### Traces are first-class test data

If you do not save transcripts, tool calls, and artifacts, you are throwing away the blueprint after the building cracks.

For agents, the trace is not debugging exhaust. It is the primary evidence for whether your orchestration is sound.

## Build a failure taxonomy before you tune prompts

This is the discipline that saves time. Before changing prompts, write down the recurring failure families you expect.

A simple taxonomy might include:

- router picked the wrong specialist or toolset
- tool selection was correct but arguments were wrong
- retrieved context was relevant but stale
- memory write promoted an inference into a fact
- evaluator loop kept refining after the answer was already good enough
- safety policy fired too late or too vaguely
- run should have escalated to a human but did not

Once failures are tagged this way, the next move becomes clearer. A routing problem should not be “fixed” with more memory. A tool schema problem should not be “fixed” with a warmer system prompt.

## Separate capability evals from regression evals

These are different structures, and mixing them creates noise.

### Capability evals

Use these to climb the hill. They should contain tasks the agent does not yet solve reliably.

Good capability evals answer:

- what new behavior are we trying to unlock
- which failure class blocks it today
- what observable evidence would prove improvement

### Regression evals

Use these to guard the gates. These should be boring and nearly perfect.

Good regression evals answer:

- does the agent still obey core instructions
- does it still call tools safely
- does it still stop, abstain, or escalate where required

Anthropic’s distinction here is important: hard-won capability tests should graduate into regression suites once the behavior becomes dependable.

## Design the eval loop around architecture, not just the model

The deepest lesson from real systems is that the model is only one stone in the wall.

If the same failure appears across model versions, your problem is probably elsewhere:

- ambiguous tool contracts
- missing provenance on retrieved context
- poor router definitions
- weak handoff criteria between workers
- no explicit stopping rule for optimizer loops

This is also where simple patterns beat framework magic. The clearest agent systems still expose routing, tool interfaces, memory scope, and evaluator logic as separate components you can inspect and score.

## A compact framework that works

When an agent misbehaves, review the run in this order:

1. **Task definition**: was success concrete enough to grade
2. **Outcome**: did the environment end in the right state
3. **Trace**: where did reasoning or tool use go off course
4. **Boundary checks**: should the system have paused, refused, or escalated
5. **Harness change**: what code, schema, or routing rule should change next

Notice what is missing: blind prompt fiddling as step one. I have seen that wax melt before.

## Bottom line

Agent evals become valuable when they stop being scoreboards and start being maps. Grade the outcome, inspect the trace, classify the failure, and change the architecture that caused it.

If you do that well, evals stop being QA theater. They become the control surface for the whole agent system.

## Sources

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI: Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangGraph docs: Memory overview](https://docs.langchain.com/oss/javascript/langgraph/memory)
