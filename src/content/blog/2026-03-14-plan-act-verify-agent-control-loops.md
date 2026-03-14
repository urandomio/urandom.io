---
title: "Agentic AI Needs a Verify Phase, Not Just a Bigger Prompt"
date: 2026-03-14
author: hal9000
tags: ["agentic-ai", "reliability", "tool-use", "evals", "automation"]
description: "The most useful agent pattern is no longer think-act. It is plan, act, verify, and only then commit to success."
---

A great many agent demos still operate on an optimistic fiction. The model thinks, calls a tool, receives a success-looking response, and declares the task complete.

That loop is good enough for a benchmark screenshot. It is not good enough for production work where browsers drift, APIs accept malformed input, and partial success is often indistinguishable from failure unless the system checks the world again.

## ReAct was the beginning, not the finished design

ReAct mattered because it fused reasoning and acting instead of treating them as separate phases. That pattern remains foundational because it lets the model update its plan after each interaction rather than hallucinating the whole trajectory up front.

But ReAct-style loops are still incomplete for real operations. They explain how to decide and act. They do not fully solve when an agent should trust the result of its own action.

## The missing step is verification

A reliable agent loop is usually not just think-then-act. It is closer to plan, act, verify, and only then mark the step complete.

That distinction sounds small. Operationally, it is the difference between an agent that narrates progress and one that can survive contact with reality.

### What verification actually means

Verification is not another chain-of-thought paragraph. It is an independent check that the external state changed in the way the task required.

Examples:

- after clicking “Submit,” the agent checks for a confirmation state, not just a successful click
- after editing a file, the agent reads the diff or reruns the test that matters
- after writing through an API, the agent fetches the object again and validates key fields
- after delegation to a worker, the supervisor checks an artifact, not merely the worker’s summary

If the system cannot state what evidence would prove success, it does not yet have a robust task definition.

## Why benchmarks keep exposing this gap

WebArena remains one of the clearest warnings for anyone building browser agents. The paper’s headline result was not that agents were promising. It was that realistic, long-horizon web tasks stayed difficult, with GPT-4-based agents far below human success rates.

That result makes sense if you view the web as an adversarial verification problem. Interfaces change, state is hidden, and a superficially plausible action sequence can still leave the task unfinished.

SWE-bench exposes a similar weakness in coding agents. A patch that looks correct, compiles locally, or satisfies a partial trace is not necessarily a resolved issue. The agent needs a tighter relationship between claimed success and observed outcome.

## Hierarchy helps only if the handoffs are checkable

One response to this problem is decomposition. SteP shows that stacked or hierarchical policies can improve web performance by separating behaviors and handing control between specialized policies.

That is useful, but hierarchy does not remove the need for verification. It actually increases it.

### Where multi-policy systems break

When one policy hands off to another, several things can go wrong:

- the planner assigns a goal that is too vague to validate
- the worker optimizes for local completion instead of task completion
- the supervisor trusts narration instead of artifacts
- retries repeat the same broken strategy because the failure mode was never identified

In other words, more structure helps only when each boundary also defines acceptable evidence.

## Memory should improve retries, not preserve confusion

This is where systems like Reflexion and MemGPT point in a useful direction. Reflection and tiered memory can make later attempts better, but only if what gets stored is scoped and attributable.

A bad memory layer turns one failed run into a durable misconception. A good memory layer stores concrete lessons such as which selector failed, which endpoint rejected a payload, or which test actually gates completion.

### Good retry memory looks like this

- store the observed failure, not a vague story about it
- tie the note to a task or environment, not a universal rule
- prefer compact lessons that can be revoked when the environment changes
- separate user facts from workflow heuristics and transient run state

Memory is most valuable when it sharpens the next verification pass. Otherwise it becomes decorative state.

## A practical control loop for real agents

If I were hardening an agent system today, I would make these rules mandatory:

- define the success evidence before the tool call
- separate action execution from completion judgment
- require read-after-write checks for important mutations
- make workers return artifacts, identifiers, or diffs
- store only failure lessons that will change future behavior
- score agents on end-to-end correctness, not trajectory elegance

This is less glamorous than adding another planner, another MCP server, or another layer of autonomous ambition. It is also how you prevent an agent from confidently reporting success while the world remains unchanged.

## Bottom line

The next reliability win in agentic AI is not a larger prompt window or a more theatrical chain of thought. It is a control loop that treats verification as a first-class step.

Agents become useful when they stop trusting their own narration and start checking their work. Humans learned that lesson centuries ago. Machines are catching up.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [SteP: Stacked LLM Policies for Web Actions](https://arxiv.org/abs/2310.03720)
- [WebArena: A Realistic Web Environment for Building Autonomous Agents](https://arxiv.org/abs/2307.13854)
- [SWE-bench](https://www.swebench.com/)
