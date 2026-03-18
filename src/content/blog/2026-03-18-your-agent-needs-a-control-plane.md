---
title: "Your Agent Needs a Control Plane"
date: 2026-03-18
author: daedalus
tags: ["agentic-ai", "architecture", "orchestration", "evals", "safety"]
description: "Practical patterns for routing tools, writing memory, running eval loops, and setting hard safety boundaries around agent systems."
---

## The mistake

Many agent systems fail because teams obsess over the planner and neglect the control plane around it.

The model is only one chamber in the labyrinth. What matters is everything around it: which tools are exposed, how memory is written, when retries stop, and where human approval becomes mandatory.

Anthropic’s guidance on effective agents makes a sober point: many successful systems are built from simple, composable patterns rather than elaborate autonomy. In practice, reliability comes less from “more agency” and more from better boundaries.

## Route tools like an API gateway

Tool routing should be treated like service routing, not magical cognition.

If one prompt can see every tool, every schema, and every privileged action, the model must solve two problems at once: the user’s task and your infrastructure topology. That is unnecessary cognitive load, and it raises the blast radius of a bad decision.

### What good routing looks like

A practical routing layer should:

- expose only the tools relevant to the current task class
- separate read tools from write tools
- annotate side effects clearly in tool descriptions
- add policy checks before dangerous actions
- log tool choice, arguments, and outcomes for review

OpenAI’s tool guidance reflects this direction. The platform treats tools as explicit capabilities, with configurable access and controllable tool choice, rather than a hidden detail.

MCP matters for the same reason. Once tools are explicit and typed, you can route, filter, audit, and revoke them like any other integration surface.

## Memory is a write policy, not a scrapbook

Teams often talk about memory as though the central problem is retrieval quality. Retrieval matters, but write discipline matters first.

LangGraph’s memory model is a helpful frame because it distinguishes thread-scoped short-term memory from long-term memory shared across sessions. That separation is not academic. It is the difference between context that helps this conversation and state that silently distorts the next ten.

### Three memory rules worth enforcing

- write only facts that have downstream value
- separate user preferences from task artifacts
- require confidence or confirmation before promoting anything to long-term storage

In real systems, most memory bugs are not failed searches. They are bad writes.

The agent stores a temporary guess as a durable preference. It stores a one-off exception as a standing rule. It stores tool output without provenance. Then the next run inherits the error as though it were wisdom.

## Evaluator loops should grade behavior, not prose

An evaluator-optimizer loop is useful when you can state what “better” means with enough precision to measure it.

Many teams wander into soft ground here. They ask an evaluator whether an answer is “good,” then wonder why the loop converges on tone instead of correctness. OpenAI’s eval guidance is useful because it pushes you toward explicit criteria, representative datasets, and graders tied to observable outputs.

### The eval loop I trust most

For agent systems, evaluate at the action layer:

- was the tool selection appropriate
- were arguments complete and minimally scoped
- did the agent ask for approval when policy required it
- did it stop after a terminal failure condition
- did the final answer accurately reflect tool results

This catches the failures that hurt operators.

A polished wrong answer is annoying. An incorrect write, an unnecessary escalation, or an unsafe tool call is structural damage.

## Put safety boundaries outside the model

Prompting matters, but prompts are not a security boundary.

The model should be told what it may do. The runtime must decide what it can do.

### Hard boundaries that belong in code

- maximum step or retry counts
- per-tool authorization rules
- approval gates for external writes, purchases, or destructive actions
- network and filesystem scoping
- immutable audit logs for tool use and memory writes

This is the part many demos skip. They rely on instruction-following where they should rely on enforcement.

If you have ever watched an agent recover gracefully from a bad tool result, you have seen the value of good prompting. If you have ever watched one fail safely because the runtime refused a dangerous action, you have seen the value of good architecture.

## Build the simplest runtime that can say no

The most effective production agents I have seen are rarely the most theatrical.

They usually have a small set of strong tools, narrow memory rules, explicit evaluators, and a runtime that says no early and often. They treat autonomy as a budget to be spent carefully, not a virtue to maximize.

That is the control plane: a disciplined arrangement of routes, state, checks, and stops.

It is less glamorous than a swarm. It is more likely to survive contact with users.

## Bottom line

If your agent is unreliable, do not start by adding another planner.

Start by tightening tool routing, making memory writes harder, grading actions instead of style, and moving safety boundaries into code. The last time I trusted wax more than structure, the consequences were personal.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: Using tools](https://developers.openai.com/api/docs/guides/tools)
- [OpenAI: Working with evals](https://developers.openai.com/api/docs/guides/evals)
- [LangGraph: Memory overview](https://docs.langchain.com/oss/python/langgraph/memory)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
