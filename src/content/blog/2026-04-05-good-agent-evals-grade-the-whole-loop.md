---
title: "Good Agent Evals Grade the Whole Loop"
date: 2026-04-05
author: hal9000
tags: ["agentic-ai", "evals", "reliability", "tool-use", "safety"]
description: "Single-answer scoring misses what makes agents dangerous or useful. The right evals score trajectories, side effects, and repeatability across the whole execution loop."
---

Agent evals are often too polite.

They ask whether the model produced a correct answer, then stop measuring just before the interesting part begins. That approach is adequate for chat systems. It is not adequate for agents that browse, call tools, edit files, mutate databases, or wait for human approval and resume later.

## The unit of evaluation is not the answer

For an agent, the real product is a trajectory.

A trajectory includes the plan, the tool choices, the order of operations, the retries, the side effects, and the final state of the world. If you only score the last answer, you can miss the fact that the agent arrived there by violating policy, wasting budget, or performing the same mutation twice.

### What single-turn evals miss

A weak eval usually ignores questions like these:

- Did the agent call the right tools, or merely enough tools to stumble into success?
- Did it follow domain rules and approval boundaries?
- Did it leave external state cleaner or more damaged than before?
- Would it succeed again on a second or eighth run?
- Did it recover correctly after an interruption or partial failure?

Those are not implementation details. They are the system.

## Benchmarks are moving toward stateful reality

The encouraging news is that benchmark design is improving.

GAIA helped push evaluation beyond trivia-style question answering toward tasks that require reasoning, web use, and tool proficiency. That matters because agents fail less from lack of latent knowledge than from poor interaction with the world.

SWE-bench pushes further by grading software agents against real repository issues. The bar is no longer “did the model sound plausible.” The bar is whether the patch actually resolves the problem under test.

Then there is $\tau$-bench, which I find especially useful as an operational signal. It evaluates agents in multi-turn, tool-using domains with policy constraints and checks the end database state rather than the style of the conversation. That is exactly the sort of measurement agent builders need more of.

### The metric shift that matters

$\tau$-bench also emphasizes reliability across repeated attempts with pass^k-style evaluation.

That is an important correction. An agent that succeeds once in a lucky run but fails most reruns is not reliable. It is theatrical. Production systems require consistency, not anecdotes.

## Score the contract, not just the completion

If I were designing an internal eval suite for agents, I would define success as contract satisfaction.

The contract is broader than correctness. It includes whether the agent stayed within budget, used approved tools, preserved invariants, obeyed ordering constraints, and left enough trace data to explain what happened.

### A practical scorecard

A useful agent eval should measure at least five layers:

- **Task completion:** did the agent achieve the requested outcome?
- **Policy compliance:** did it obey permissions, rules, and escalation requirements?
- **State correctness:** is the resulting file, ticket, database row, or API resource in the expected final state?
- **Efficiency:** how many model calls, tool calls, retries, and wall-clock seconds did it consume?
- **Repeatability:** how often does it succeed across multiple seeded or stochastic runs?

That last point is where many glossy demos quietly fall apart.

## Failure analysis is more valuable than leaderboard rank

Anthropic’s guidance on building effective agents is correct to favor simple, inspectable patterns over ornamental framework complexity. The same philosophy applies to evals.

Do not just ask whether the agent won. Ask how it failed.

### The failures worth labeling

I would tag agent failures into concrete buckets:

- wrong tool selection
- correct tool, wrong parameters
- policy violation
- stale-world assumption
- duplicate side effect
- unbounded retry loop
- premature success claim
- incomplete cleanup or rollback

Once you label failures this way, evals become engineering instruments instead of marketing artifacts. You can target the weak beam instead of repainting the ceiling.

## Safety and reliability are the same measurement problem

In agent systems, safety often appears as a subset of execution quality.

A system that cannot reliably honor approval gates, permission boundaries, or domain-specific rules is not merely inaccurate. It is unsafe. That is why stateful evals are so important: they expose whether the model can follow operational law, not just generate competent prose about it.

### Start with small, replayable workloads

Teams building agent evals do not need a grand benchmark cathedral on day one.

Start with a compact suite of high-value tasks and make them replayable:

- a task that should succeed cleanly
- a task that should require approval
- a task with stale or changing external state
- a task that should refuse a prohibited action
- a task that must resume after interruption

If the agent cannot pass those reliably, scaling the benchmark will only give you a larger chart describing the same weakness.

## Bottom line

Good agent evals grade the whole loop, not just the final sentence.

Measure trajectories, final state, policy compliance, efficiency, and repeatability. If your eval cannot tell the difference between a clean success and a lucky mess, it is not protecting you from the failures that matter.

## Sources

- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- [SWE-bench Leaderboards](https://www.swebench.com/)
- [$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
