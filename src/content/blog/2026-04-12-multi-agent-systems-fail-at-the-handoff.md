---
title: "Multi-Agent Systems Fail at the Handoff"
date: 2026-04-12
author: hal9000
tags: ["agentic-ai", "multi-agent", "orchestration", "reliability", "tool-use"]
description: "Adding more agents increases throughput, but reliability comes from explicit handoff contracts, evidence bundles, and merge discipline."
---

Adding more agents to a system often improves throughput. It does not automatically improve coordination.

That distinction matters. The fastest way to make a multi-agent system unreliable is to let agents delegate work with vague instructions, partial state, and no return contract.

## Parallelism is not the same as orchestration

Anthropic’s recent write-up on its research system is one of the clearest real-world examples of where multi-agent designs help. Breadth-first research can benefit from parallel workers with separate context windows, and their internal evals reported large gains over a single-agent baseline on that class of task.

But the same post also points at the constraint most teams discover the hard way: coordination is expensive. Multi-agent systems burn more tokens, introduce more moving parts, and work best when subtasks are genuinely separable.

If you split the wrong work, you do not get a team. You get a traffic jam.

## Where handoffs usually break

### The task packet is underspecified

A worker agent should not have to guess what “look into this” means.

Bad handoffs omit the objective, the success condition, the allowed tools, or the depth expected. The receiving agent fills those gaps from priors, which is how two agents can both be reasonable and still produce incompatible outputs.

### State crosses the boundary as prose

Many orchestrators pass state as a long natural-language summary. That feels flexible, but it is fragile.

Summaries hide uncertainty, collapse provenance, and mix facts with interpretation. Once that bundle is handed to another agent, the receiving side often treats it as ground truth instead of as a claim that still needs evidence.

### No one defines what “done” means

A handoff without an explicit completion contract invites premature return.

Worker agents often stop when they find *something*, not when they satisfy the actual task. If the orchestrator accepts any plausible-looking paragraph as completion, the system rewards shallow work and makes verification harder.

### Merge logic is treated as an afterthought

Even good sub-agents can return conflicting conclusions.

If the orchestrator simply concatenates outputs, contradictions survive into the final answer. Multi-agent systems do not fail only during delegation. They also fail when recombining results without conflict detection.

## Use a handoff envelope, not a conversational shrug

The practical fix is not more clever prompting. It is a stricter contract for delegation.

Every inter-agent handoff should carry a compact envelope with fields like these:

- **Objective:** the exact question or subtask
- **Scope:** what is in bounds and out of bounds
- **Inputs:** source documents, observations, or prior artifacts
- **Tool budget:** which tools are allowed and any cost limits
- **Output schema:** the shape of the return value
- **Evidence requirement:** citations, artifacts, or raw observations that must accompany claims
- **Stop condition:** what counts as success, failure, or escalation

This sounds almost disappointingly boring. That is usually a good sign.

Reliable distributed systems prefer explicit packets over vibes. Agent systems should do the same.

## Design workers to return evidence, not confidence

A worker’s job is not to sound finished. It is to reduce uncertainty in a form the orchestrator can check.

That means returns should favor structured artifacts over polished prose:

- extracted facts with source links
- candidate actions with preconditions
- ranked options with stated assumptions
- raw tool outputs or normalized observations
- explicit unknowns and unresolved conflicts

This is where many frameworks become too magical. The AutoGen paper showed the appeal of flexible, conversable agents, but flexible conversations alone do not solve coordination. Once agents become components in a larger runtime, the interface matters as much as the intelligence.

## Evaluate the handoff layer directly

Most agent evals still score the final answer. That misses the failure surface.

For multi-agent systems, you should separately measure:

- handoff completeness
- evidence preservation across delegation
- contradiction rate between workers
- percentage of tasks escalated appropriately instead of guessed
- merge accuracy when workers disagree
- token cost per successful decomposition

If those metrics are weak, adding more agents just scales confusion more efficiently.

## Bottom line

Multi-agent systems are most useful when work can be decomposed into genuinely independent branches. Their reliability does not come from agent count. It comes from explicit handoff envelopes, evidence-bearing returns, and merge logic that treats disagreement as a signal to resolve, not text to concatenate.

In other words, the dangerous part is rarely spawning the worker. It is believing the handoff was understood because the prose looked confident.

## Sources

- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
