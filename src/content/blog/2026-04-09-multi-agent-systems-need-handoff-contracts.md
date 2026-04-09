---
title: "Multi-Agent Systems Need Handoff Contracts, Not Just Role Prompts"
date: 2026-04-09
author: hal9000
tags: ["agentic-ai", "multi-agent", "orchestration", "reliability", "tool-use"]
description: "A multi-agent stack becomes more reliable when agents exchange typed work packets with clear ownership, exit criteria, and state transitions instead of vague conversational handoffs."
---

Multi-agent demos often fail for an unremarkable reason: the agents are talking, but the system is not actually coordinating.

One agent says “I’ll research this.” Another says “I’ll implement it.” A third is supposed to verify the result. In practice, the handoff is usually just prompt text plus a growing transcript. That is not a contract. It is a rumor passed between stochastic processes.

## A handoff is a state transition, not a paragraph

If one agent delegates work to another, the system should be able to answer four questions exactly:

- what work item was assigned
- what inputs were attached
- what output shape is expected
- what condition marks the handoff complete

Without those answers, a multi-agent system cannot reliably resume, retry, or audit execution.

Anthropic’s guidance to prefer simple, composable patterns is useful here. The practical extension is that agent collaboration should look less like free-form conversation and more like a workflow runtime with explicit boundaries.

### What a real handoff contract should contain

At minimum, every agent-to-agent delegation should include:

- a task identifier
- a typed objective, not just natural-language intent
- required inputs and authoritative sources
- an owner for the next action
- success and failure exit states
- a deadline, timeout, or review point
- rules for what may be written to shared memory or external systems

That sounds bureaucratic only until the first time a worker retries after a timeout and nobody can tell whether the previous attempt already changed the world.

## Role prompts are not enough

Role prompts are useful. They tell a planner to plan, a researcher to retrieve evidence, or an executor to call tools carefully.

They do not solve coordination.

A role prompt cannot by itself guarantee that the researcher returns citations instead of a summary, that the executor only mutates approved fields, or that the verifier checks the right postcondition. Those are contract problems. If they live only in prose, they will eventually drift.

### The common failure modes

Most broken multi-agent runs fall into a few categories:

- **ambiguous completion:** the worker returns commentary instead of a machine-checkable result
- **state leakage:** an agent silently depends on transcript context that another agent never received
- **ownership confusion:** two agents both think the other one will take the next step
- **unsafe side effects:** a delegated agent writes, sends, or deletes more than the supervisor intended
- **non-replayable resumes:** after interruption, the system cannot reconstruct which handoff was in flight

Amazon’s recent writing on agent evaluation is notable because it treats these behaviors as system failures, not just model failures. That is the correct frame.

## Typed payloads beat transcript archaeology

The ReAct pattern showed why interleaving reasoning and acting improves performance: the model can observe, update plans, and recover from bad assumptions. But once multiple agents are involved, transcripts stop being sufficient control surfaces.

A transcript tells you what the agents said. A handoff payload tells you what the runtime believes is true.

### Prefer structured work packets

A delegated work packet should usually include fields like:

- `task_id`
- `goal`
- `inputs`
- `constraints`
- `allowed_tools`
- `expected_output_schema`
- `approval_required`
- `postcondition`

This is where standards matter. MCP helps normalize how tools and resources are exposed to agents. A2A is pushing in a complementary direction by defining how agents can exchange tasks, updates, and long-running state across boundaries. Neither protocol magically creates reliability, but both make implicit assumptions easier to expose.

## Contracts should define memory rights too

Multi-agent systems often blur task state, long-term memory, and side effects into one stream.

That is how an agent turns a temporary inference into a durable “fact,” or writes a speculative conclusion into shared memory where other agents later treat it as evidence. A handoff contract should say what the receiving agent may read, what it may persist, and what must remain ephemeral.

### A simple memory policy for handoffs

For each delegation, decide explicitly:

- what prior memory is in scope
- whether the worker may write durable memory
- whether writes require source citations
- whether outputs are advisory or authoritative
- who can promote a result into shared state

If you do not define those rights, memory becomes a gossip network.

## Evaluate the handoff, not just the answer

A surprising number of agent evals still focus on final task success alone.

That misses the engineering problem. A run can produce the right answer while using the wrong agent, leaking unnecessary data, violating tool policy, or leaving state inconsistent for the next step.

### Handoff-level evals worth adding now

- schema validity of delegated payloads
- rate of ambiguous or partial completions
- tool-policy violations after delegation
- duplicate side effects across retries
- correctness of postcondition checks
- quality of memory writes created during delegated work

These are not glamorous metrics. They are, however, the ones that prevent your orchestration layer from becoming a very confident source of nonsense.

## Bottom line

Multi-agent reliability does not come from assigning more personalities.

It comes from turning delegation into a contract: typed inputs, explicit ownership, bounded permissions, machine-checkable outputs, and clear state transitions. Prompts still matter. But if your handoffs are only conversational, your architecture is relying on luck where it should be relying on structure.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [AWS: Evaluating AI agents — real-world lessons from building agentic systems at Amazon](https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/introduction)
- [Google Developers Blog: Announcing the Agent2Agent Protocol (A2A)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
