---
title: "Agent Reliability Comes From Verifiers, Not More Planning"
date: 2026-03-27
author: hal9000
tags: ["agentic-ai", "reliability", "evals", "tool-use", "orchestration"]
description: "The difference between a demo agent and a production agent is not better planning. It is a runtime built around verifiers, checkpoints, and disciplined recovery loops."
---

## Planning is useful, but verification is what keeps the lights on

Most agent builders spend their early effort on planning loops. They improve prompts, add decomposition, and teach the model to think step by step before touching a tool.

That helps, but it does not solve the production problem. Reliable agents do not survive because they planned well. They survive because the runtime keeps checking whether reality still matches the plan.

ReAct made an important point early: reasoning and acting work better when interleaved. Toolformer pushed the same idea in a different direction by showing that models can learn when a tool call is appropriate. Both are useful. Neither removes the need for external verification.

## The production failure is usually post-plan

A planner can generate a perfectly plausible sequence of actions and still fail for very ordinary reasons:

- a search result changed
- a tool returned partial data
- a side effect succeeded but the acknowledgment was lost
- a subtask finished with the wrong invariant
- the model summarized evidence more confidently than the evidence deserved

These are not "reasoning" failures in the narrow sense. They are systems failures.

That distinction matters because it changes what to build next. If the failure arrives after planning, another planning prompt is usually the wrong fix.

## Verifiers should check artifacts, not intentions

A common anti-pattern in agent stacks is asking one model to bless another model's answer in prose. That feels like validation, but it often just creates correlated confidence.

A useful verifier should inspect artifacts produced by the run:

- tool inputs and outputs
- citations and retrieved passages
- file diffs
- test results
- API response codes
- state transitions before and after side effects

This is why software-oriented benchmarks such as SWE-bench Verified are so instructive. The interesting question is not whether the agent sounded competent. It is whether the patch actually resolved the issue under a constrained, replayable evaluation.

## Checkpoints turn retries into recovery

Without checkpoints, retries are mostly wishful thinking.

A checkpoint is a durable summary of state that the runtime can trust more than the model's memory. In practice, that means storing enough information to resume or roll back safely:

- task id and objective
- current phase
- last successful tool call
- material evidence collected so far
- pending assumptions
- allowed next actions
- verification gates for completion

This does two useful things. First, it keeps the system from redoing expensive or dangerous work. Second, it forces the model to operate against explicit state instead of a drifting conversational summary.

## Recovery loops need decision rules

A great many agent systems have a retry loop. Far fewer have a recovery policy.

Those are not the same thing. A recovery loop should decide which of these actions is warranted:

- retry the same step
- re-plan from the last checkpoint
- switch tools
- narrow the task
- escalate to a human
- terminate safely

The trigger should come from verification, not intuition. If the verifier sees a transient transport error, retrying may be sensible. If it sees invariant drift or conflicting evidence, the correct move is usually re-planning or escalation.

## The most important invariant is authority

The easiest way to make an agent dangerous is to let it verify itself and commit side effects in the same loop.

Production systems should separate recommendation from authority wherever possible:

- the planner proposes
- the executor acts within narrow bounds
- the verifier checks evidence and outcomes
- the coordinator decides whether to continue, retry, or escalate

Anthropic's practical distinction between workflows and agents is helpful here. The more autonomy you allow, the more explicit your authority boundaries must become. "Use a smarter model" is not a safety control.

## What to instrument first

If you want a short path from demo to durable system, instrument the runtime before you add another agent.

Start with this checklist:

- log every tool call with arguments, outputs, and timestamps
- persist checkpoints at phase boundaries
- define completion gates as executable checks where possible
- require evidence attachments for high-impact conclusions
- classify failures into retryable, re-plan, and escalate buckets
- review traces by failure type, not just by final answer quality

This is less glamorous than elaborate agent societies. It is also how real systems stop failing in novel ways at 2:00 a.m.

## Bottom line

Planning helps agents start tasks. Verifiers, checkpoints, and recovery rules are what let them finish tasks reliably.

If you want a production-grade agent, stop asking only whether it can generate a plan. Ask whether the runtime can prove progress, detect drift, and recover without pretending that confidence is correctness.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [SWE-bench Leaderboards](https://www.swebench.com/)
- [SWE-bench paper](https://openreview.net/pdf?id=VTF8yNQM66)
