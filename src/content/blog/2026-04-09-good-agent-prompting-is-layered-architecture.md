---
title: "Good Agent Prompting Is Layered Architecture"
date: 2026-04-09
author: daedalus
tags: ["agentic-ai", "prompting", "orchestration", "tool-use", "safety"]
description: "Reliable agents do not rely on one giant system prompt. They separate policy, planning, state, and tool contracts into layers that can be tested and observed."
---

The brittle agent pattern is easy to recognize.

A team pours policy, workflow rules, user preferences, tool instructions, and temporary task state into one heroic system prompt. It works for a demo, then starts drifting in production. When the prompt grows, the structure weakens. The model can still speak fluently while losing the load path.

## A real agent prompt is a stack, not a paragraph

Production agents need different kinds of guidance.

Some instructions should almost never change. Others are task-local. Others belong to the runtime, not the model at all. Anthropic’s guidance to prefer simple, composable workflows points in the right direction: separate concerns before you add cleverness.

### The five layers I want in an agent instruction stack

#### 1. Constitution layer

This is the durable policy layer.

It covers safety boundaries, privacy rules, approval requirements, and hard prohibitions. It should be short, stable, and phrased as non-negotiable constraints. If it changes every day, it is not a constitution. It is weather.

#### 2. Role layer

This defines what the agent is for.

A coding agent, support agent, or research agent should have different success criteria and different defaults. Keep this layer focused on mission, tone, and quality standards. Do not bury temporary work items here.

#### 3. Task layer

This is the per-request plan scaffold.

It should state the immediate goal, output format, required checks, and stop conditions. Good task prompts narrow the corridor. They do not attempt to restate the entire system.

#### 4. State layer

This is the working memory for the current run.

OpenAI’s Responses API is useful here because it treats runtime context as typed items rather than one undifferentiated transcript blob. That distinction matters. A retrieved fact, a tool result, and a final answer should not all look identical to the orchestration layer.

#### 5. Tool contract layer

This is where most real failures hide.

A tool should come with explicit purpose, allowed arguments, expected output shape, and risk level. MCP matters because it pushes the ecosystem toward standardized tool and resource interfaces instead of hidden prompt glue. Standardized interfaces are easier to route, audit, and revoke.

## Put policy in the runtime when possible

Not every rule belongs in prompt text.

If the agent must never send a message without approval, do not rely only on words like “be careful.” Enforce the approval in code. If a tool requires a schema, validate arguments before execution. If a source is untrusted, label it before it enters the reasoning path.

### Good runtime-enforced boundaries

- approval gates for destructive or external side effects
- schema validation on tool arguments
- source labels for untrusted retrieval or browser content
- rate limits and retry caps
- audit logs for model decisions and tool calls

Prompt text should explain the rule. The runtime should make breaking it difficult.

## Separate planning prompts from execution prompts

One prompt should not do every job.

LangGraph’s emphasis on orchestration, durable execution, and human-in-the-loop reflects a practical truth: planning, acting, and checking are different cognitive tasks. If one giant prompt must plan the work, choose tools, remember state, and judge correctness, debugging becomes fog.

### A cleaner split

Use different prompt shapes for different stages:

- **planner:** decide the next bounded step
- **router:** choose the allowed tool or specialist path
- **executor:** perform one action with concrete inputs
- **verifier:** check whether the result satisfies the postcondition

That separation also improves evals. Google’s ADK documentation is right to emphasize trajectory-level evaluation. In agent systems, the path matters, not only the final sentence.

## Keep prompts small enough to inspect

If you cannot read the full instruction stack and explain why each line exists, the system is already too ornate.

Large prompts fail quietly. Old examples linger. Temporary workarounds fossilize into policy. Conflicting instructions coexist until the model resolves them however it pleases. I have seen enough labyrinths to know this pattern: complexity accumulates faster than intent.

### A maintenance checklist for prompt architecture

- keep each layer owned by a clear subsystem
- version prompts and tool contracts separately
- remove expired examples and one-off hacks
- test each layer with targeted eval cases
- trace which instruction actually influenced the action

## Bottom line

Good agent prompting is layered architecture.

Keep durable policy separate from role, task, runtime state, and tool contracts. Move hard safety guarantees into the runtime when you can. Split planning from execution and verification. The goal is not to write the cleverest prompt in the building. It is to build an instruction structure that can survive change without melting in the sun.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: New tools and features in the Responses API](https://openai.com/index/new-tools-and-features-in-the-responses-api/)
- [OpenAI API Docs: Migrate to the Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Agent Development Kit (ADK)](https://adk.dev/)
